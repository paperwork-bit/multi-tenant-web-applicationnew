# Cloudflare Deployment Guide

This project now ships through **Cloudflare Pages + Functions** with a D1
database for persistence. Firebase and the old deploy scripts are fully
retired.

---

## 1. Prerequisites

- Node 20+ and npm 10+
- Cloudflare account with Pages + D1 access
- `wrangler` already installed as a dev dependency (`npm install` pulls it)
- Logged in locally via `npx wrangler login`
- D1 database provisioned and wired to `wrangler.toml`

---

## 2. One-Time Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure your D1 binding in `wrangler.toml`
   ```toml
   [[d1_databases]]
   binding = "D1_DB"
   database_name = "<your-db-name>"
   database_id = "<production-id>"
   preview_database_id = "<preview-id>"
   ```
3. Apply the initial schema
   ```bash
   npm run cf:migrate
   ```
4. Store any secrets (e.g., Xero creds) in Cloudflare
   ```bash
   npx wrangler secret put XERO_CLIENT_ID
   npx wrangler secret put XERO_CLIENT_SECRET
   ```

---

## 3. Deploying to Production

```bash
npm run build            # Vite build → dist
npm run cf:deploy        # Upload dist + functions to Cloudflare Pages
```

The `cf:deploy` script automatically runs `wrangler pages deploy dist`.
Deployments appear in the Pages dashboard where you can promote previews,
add custom domains, and trigger rollbacks.

---

## 4. Preview / Local Development

Use the Pages dev server to run the SPA + Functions + D1 locally:

```bash
npm run cf:dev
```

This command:
- Serves the SPA with Vite HMR
- Runs the Workers/Pages functions
- Spins up a local persistent D1 database (`.wrangler/state/`)

If you only need the Vite dev server without Workers, `npm run dev`
still works, but API calls to `/api/*` will 404 unless `cf:dev` is also
running in another terminal.

---

## 5. Data Migration

For first-time Cloudflare cutover, dump your existing localStorage
snapshot into JSON (shape `{ "xtr_projects": "...", ... }`) and run:

```bash
npm run migrate:local -- \
  --input ./data/local-storage.json \
  --api https://<your-pages-domain>/api \
  --token <optional-bearer-token>
```

The script replays every `xtr_*` key through the new `/api/storage`
endpoint so D1 mirrors your previous Firebase/local data. Pass
`--dry-run` to verify without writing.

---

## 6. Smoke Tests Before Cutting Over

1. `npm run cf:dev` locally, then:
   - Load `/` and confirm Kanban/CRM/resource data appears (synced from D1)
   - Add/update a project and refresh to ensure persistence
2. Run the production build:
   ```bash
   npm run build
   ```
3. (Optional) Hit the Worker health endpoint:
   ```bash
   curl https://<your-pages-domain>/api/health
   ```

---

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `wrangler` cannot find the DB | Confirm `database_id` + `preview_database_id` in `wrangler.toml` |
| Storage writes fail | Ensure the Pages Function binding is named `D1_DB` and that your user has D1 access |
| Local dev shows stale data | Clear `.wrangler/state/`, rerun `npm run cf:dev`, or run `npm run migrate:local -- --api http://127.0.0.1:8787/api` |
| Custom domain 404 | Follow `CLOUDFLARE_DNS_SETUP.md` to point the domain at Pages |

All new infrastructure changes should happen through Wrangler + D1
migrations—no Firebase CLI required going forward.


