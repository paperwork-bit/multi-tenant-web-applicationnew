import { db, firebaseEnabled } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type Unsub = () => void;

export function lsKey(namespace: string, docId: string) {
  return `xtr_${namespace}_${docId}`;
}

export function subscribeDoc<T>(namespace: string, docId: string, onData: (data: T | null) => void): Unsub | undefined {
  if (!firebaseEnabled || !db) {
    try {
      const raw = localStorage.getItem(lsKey(namespace, docId));
      if (raw) onData(JSON.parse(raw));
    } catch {}
    return undefined;
  }
  const ref = doc(db, namespace, docId);
  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      // do not clobber local if missing
      try {
        const raw = localStorage.getItem(lsKey(namespace, docId));
        if (raw) onData(JSON.parse(raw));
        else onData(null);
      } catch { onData(null); }
      return;
    }
    const data = snap.data() as T;
    onData(data);
    try { localStorage.setItem(lsKey(namespace, docId), JSON.stringify(data)); } catch {}
  });
  return unsub;
}

export async function writeDocSafe<T extends object>(namespace: string, docId: string, data: T): Promise<void> {
  // Normalize undefined to null/empty to avoid Firestore errors
  const normalized = JSON.parse(JSON.stringify(data, (_k, v) => (v === undefined ? null : v)));
  try {
    if (firebaseEnabled && db) {
      await setDoc(doc(db, namespace, docId), normalized, { merge: true });
    }
  } catch (e) {
    // fall back silently
    // eslint-disable-next-line no-console
    console.error('[persistence] Firestore write failed, using local only', e);
  } finally {
    try { localStorage.setItem(lsKey(namespace, docId), JSON.stringify(normalized)); } catch {}
  }
}


