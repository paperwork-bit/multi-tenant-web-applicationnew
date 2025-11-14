### Firebase Setup (New Project)

1. Create a web app in your new Firebase project and copy the config values.
2. Create a `.env.local` in the project root with:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3. Start the app normally:

```
npm run dev
```

4. Optional: Deploy hosting with Firebase CLI after `npm run build`:

```
firebase login
firebase init hosting   # select this folder, set public to build
firebase deploy --only hosting
```

The client bootstrap lives at `src/lib/firebase.ts` and safely no-ops when env is missing.


