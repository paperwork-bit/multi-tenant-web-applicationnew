const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '') || '/api';

let bootstrapPromise: Promise<void> | null = null;
let patched = false;
let syncSuspended = false;

const pendingWrites = new Map<string, string>();
const pendingDeletes = new Set<string>();
let flushTimer: number | null = null;

const shouldSyncKey = (key: string) => key?.startsWith('xtr_');

export function ensureCloudSync(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap();
  }
  return bootstrapPromise;
}

async function bootstrap() {
  if (typeof window === 'undefined') return;
  await hydrateFromCloud();
  patchStorage();
}

async function hydrateFromCloud() {
  try {
    const res = await fetch(`${API_BASE}/storage/snapshot`, {
      credentials: 'same-origin',
    });
    if (!res.ok) return;
    const data = (await res.json()) as { keys?: Record<string, string> };
    const entries = Object.entries(data.keys || {});
    if (!entries.length) return;
    syncSuspended = true;
    for (const [key, value] of entries) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore per-key failures
      }
    }
  } catch (error) {
    console.warn('[cloudflareSync] Failed to hydrate snapshot', error);
  } finally {
    syncSuspended = false;
  }
}

function patchStorage() {
  if (patched || typeof window === 'undefined') return;
  const storageProto = window.Storage?.prototype;
  if (!storageProto) return;
  patched = true;
  const originalSetItem = storageProto.setItem;
  const originalRemoveItem = storageProto.removeItem;

  storageProto.setItem = function patchedSetItem(this: Storage, key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this === window.localStorage && !syncSuspended && shouldSyncKey(key)) {
      queueWrite(key, value);
    }
  };

  storageProto.removeItem = function patchedRemoveItem(this: Storage, key: string) {
    originalRemoveItem.call(this, key);
    if (this === window.localStorage && !syncSuspended && shouldSyncKey(key)) {
      queueDelete(key);
    }
  };
}

function queueWrite(key: string, value: string) {
  pendingDeletes.delete(key);
  pendingWrites.set(key, value);
  scheduleFlush();
}

function queueDelete(key: string) {
  pendingWrites.delete(key);
  pendingDeletes.add(key);
  scheduleFlush();
}

function scheduleFlush() {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushQueue();
  }, 200);
}

async function flushQueue() {
  if (typeof window === 'undefined') return;
  if (!pendingWrites.size && !pendingDeletes.size) return;

  const writes = Array.from(pendingWrites.entries());
  const deletes = Array.from(pendingDeletes.values());
  pendingWrites.clear();
  pendingDeletes.clear();

  await Promise.allSettled([
    ...writes.map(([key, value]) => pushWrite(key, value)),
    ...deletes.map((key) => pushDelete(key)),
  ]);
}

async function pushWrite(key: string, value: string) {
  try {
    await fetch(`${API_BASE}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } catch (error) {
    console.warn('[cloudflareSync] Failed to persist key', key, error);
  }
}

async function pushDelete(key: string) {
  try {
    await fetch(`${API_BASE}/storage/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
  } catch (error) {
    console.warn('[cloudflareSync] Failed to delete key', key, error);
  }
}


