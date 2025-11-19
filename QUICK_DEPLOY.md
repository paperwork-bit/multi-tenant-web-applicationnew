# Quick Deploy (Cloudflare)

1. **Install** (if you haven’t already)
   ```bash
   npm install
   npx wrangler login
   ```

2. **Run migrations** (only when schema changes)
   ```bash
   npm run cf:migrate
   ```

3. **Ship**
   ```bash
   npm run cf:deploy
   ```

That’s it—Pages handles both the SPA (dist) and functions (under
`functions/`). The last command prints a preview + production URL.

---

## Helpful Extras

- **Local full-stack dev**
  ```bash
  npm run cf:dev
  ```
  Uses Wrangler to serve Vite + Workers + D1 in one process.

- **Data import**
  ```bash
  npm run migrate:local -- --input ./data/local-storage.json --api http://127.0.0.1:8787/api
  ```

- **Secrets**
  ```bash
  npx wrangler secret put XERO_CLIENT_ID
  ```

No Firebase CLI, tokens, or deploy scripts are required anymore.

