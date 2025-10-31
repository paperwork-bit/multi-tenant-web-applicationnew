import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read config from env. Keep optional to allow local-only mode if missing
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function hasAllConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

export const app = hasAllConfig()
  ? (getApps()[0] ?? initializeApp(firebaseConfig))
  : undefined;

export const auth = app ? getAuth(app) : undefined as unknown as ReturnType<typeof getAuth>;
export const db = app ? getFirestore(app) : undefined as unknown as ReturnType<typeof getFirestore>;

export const firebaseEnabled = Boolean(app);
if (firebaseEnabled) {
  // Minimal safe log to verify env is wired
  // eslint-disable-next-line no-console
  console.log('[Firebase] Enabled with project:', firebaseConfig.projectId);
} else {
  // eslint-disable-next-line no-console
  console.warn('[Firebase] Disabled. Missing config:', {
    hasApiKey: Boolean(firebaseConfig.apiKey),
    hasAuthDomain: Boolean(firebaseConfig.authDomain),
    hasProjectId: Boolean(firebaseConfig.projectId),
    hasAppId: Boolean(firebaseConfig.appId),
  });
}

