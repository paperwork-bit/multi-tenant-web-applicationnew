# Testing Checklist (Cloudflare Stack)

## 1. Local full-stack run

```bash
npm run cf:dev
```

Validate:
- `/` renders with project/resource data from the seeded D1 instance.
- Creating/editing a project updates the board immediately and remains
  after a refresh.
- `/api/health` returns `{ "ok": true }`.

## 2. Worker-only smoke test

```bash
curl http://127.0.0.1:8787/api/health
curl http://127.0.0.1:8787/api/xero/status
wrangler d1 execute D1_DB --command "SELECT COUNT(*) AS projects FROM projects;"
```

Expect HTTP 200 responses and a valid row count from D1.

## 3. Production validation

1. `npm run build` — ensures the SPA compiles.
2. Deploy to the Pages preview (`npm run cf:deploy`).
3. Open the preview URL:
   - Confirm data loads (coming from production D1).
   - Add a resource; check the Worker logs (Pages dashboard) for the
     `/api/storage` write.
4. Hit the custom domain `/api/health` to verify DNS + certs.

## 4. Regression checklist

- Kanban drag/drop persists after reload.
- Resource CRUD updates counts/stats.
- Site visit/on-field forms still read/write cached data.
- Xero buttons respond (even if mocked) without console errors.

Document any failures in the Pages deployment summary before promoting a
preview to production.


