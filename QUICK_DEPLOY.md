# Quick Deploy Instructions

## First Time Setup (One-time)

If you get authentication errors, run:

```bash
firebase login
```

This will open a browser for OAuth authentication. Follow the prompts.

## Deploy to Live Site

### Method 1: Use the Script (Easiest)
```bash
./deploy.sh
```

### Method 2: Manual
```bash
# 1. Unset token (if needed)
unset FIREBASE_TOKEN

# 2. Build
npm run build

# 3. Deploy
firebase deploy --only hosting
```

## Verify Authentication

```bash
firebase login:list
```

Should show: `Logged in as paperwork@xtechsrenewables.com.au`

## If Token Error Persists

1. **Check current session:**
   ```bash
   echo $FIREBASE_TOKEN
   ```
   If it shows a value, run: `unset FIREBASE_TOKEN`

2. **Open a new terminal window** (this loads the updated .zshrc)

3. **Re-authenticate:**
   ```bash
   firebase logout
   firebase login
   ```

4. **Try deployment again:**
   ```bash
   ./deploy.sh
   ```

