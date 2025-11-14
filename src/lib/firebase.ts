import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Fresh Firebase bootstrap (new project): reads config only from env
// Provide your new project's web app config via Vite env variables
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function configLooksValid(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export const firebaseApp = configLooksValid()
  ? (getApps()[0] ?? initializeApp(config))
  : undefined;

export const auth = firebaseApp ? getAuth(firebaseApp) : undefined as unknown as ReturnType<typeof getAuth>;
export const db = firebaseApp ? getFirestore(firebaseApp) : undefined as unknown as ReturnType<typeof getFirestore>;

export const firebaseEnabled = Boolean(firebaseApp);
if (firebaseEnabled) {
  // eslint-disable-next-line no-console
  console.log('[Firebase] Connected to project:', config.projectId);
} else {
  // eslint-disable-next-line no-console
  console.warn('[Firebase] Not initialized. Missing or invalid env configuration.');
}


