// Firebase removed. Persistence now uses localStorage only.

type Unsub = () => void;

export function lsKey(namespace: string, docId: string) {
  return `xtr_${namespace}_${docId}`;
}

export function subscribeDoc<T>(namespace: string, docId: string, onData: (data: T | null) => void): Unsub | undefined {
      try {
        const raw = localStorage.getItem(lsKey(namespace, docId));
        if (raw) onData(JSON.parse(raw));
        else onData(null);
      } catch { onData(null); }
  return undefined;
}

export async function writeDocSafe<T extends object>(namespace: string, docId: string, data: T): Promise<void> {
  const normalized = JSON.parse(JSON.stringify(data, (_k, v) => (v === undefined ? null : v)));
    try { localStorage.setItem(lsKey(namespace, docId), JSON.stringify(normalized)); } catch {}
}


