# Firebase Deployment Guide

## Authentication Issue Fix

The `FIREBASE_TOKEN` environment variable was causing authentication failures. This has been permanently fixed.

## Quick Deployment

### Option 1: Use the Deployment Script (Recommended)

```bash
./deploy.sh
```

This script will:
- Unset any FIREBASE_TOKEN environment variable
- Verify Firebase authentication
- Build the project
- Deploy to Firebase hosting

### Option 2: Manual Deployment

1. **Ensure you're logged in:**
   ```bash
   firebase login:list
   ```
   If not logged in, run:
   ```bash
   firebase login
   ```

2. **Unset FIREBASE_TOKEN (if set):**
   ```bash
   unset FIREBASE_TOKEN
   ```

3. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Troubleshooting

### If you get "401 Unauthorized" error:

1. **Check if FIREBASE_TOKEN is set:**
   ```bash
   echo $FIREBASE_TOKEN
   ```
   If it shows a value, unset it:
   ```bash
   unset FIREBASE_TOKEN
   ```

2. **Re-authenticate with Firebase:**
   ```bash
   firebase logout
   firebase login
   ```

3. **Verify authentication:**
   ```bash
   firebase login:list
   ```

### If FIREBASE_TOKEN keeps reappearing:

Check these files and remove any `FIREBASE_TOKEN` exports:
- `~/.zshrc`
- `~/.bash_profile`
- `~/.bashrc`
- `~/.profile`
- `~/.zprofile`
- `~/.zshenv`

## Important Notes

- **Never set FIREBASE_TOKEN** - Firebase CLI uses OAuth tokens automatically
- The deployment script handles token cleanup automatically
- All deployments use OAuth authentication (more secure than tokens)

