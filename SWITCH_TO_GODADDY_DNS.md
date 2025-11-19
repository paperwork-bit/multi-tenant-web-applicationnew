# (Legacy) Switching DNS away from Cloudflare

> **Not recommended.** The app now depends on Cloudflare Pages +
> Workers + D1, which all require Cloudflare-managed DNS. Only follow
> this guide if Cloudflare becomes unavailable and you must fall back to
> GoDaddy for a temporary static host. Expect to lose Workers, caching,
> SSL automation, and the D1-backed APIs.

---

## Why you should stay on Cloudflare

- Cloudflare Pages terminates TLS, serves the SPA, and routes
  `/api/*` requests into the Worker we just built.
- D1 bindings are only accessible when the request enters through
  Cloudflare’s edge.
- Features such as caching, WAF, and KV/R2 integrations are also tied to
  Cloudflare.

If you switch the nameservers back to GoDaddy you will need a completely
different hosting strategy (e.g., Netlify, Vercel, manual servers). This
document exists purely as a disaster-recovery note.

---

## Absolute fallback steps

1. **Switch nameservers** to GoDaddy defaults (`ns1.godaddy.com`,
   `ns2.godaddy.com`). Follow the procedure that used to live in this
   file, but understand the change can take 48 h and breaks the live
   site during propagation.
2. **Deploy a static build** somewhere else (S3, Netlify, etc.) and
   update GoDaddy A/CNAME records to point at that host.
3. **Disable all Worker features** in the UI (Xero sync, Kanban sync,
   etc.) or replace them with another backend because the Cloudflare
   Worker will be unreachable once traffic leaves Cloudflare’s network.

---

## Recovery: returning to Cloudflare

When the edge is available again:

1. Update GoDaddy nameservers to the two Cloudflare values.
2. Wait for propagation and confirm via `dig NS domain`.
3. Re-apply the Pages CNAMEs described in `CLOUDFLARE_DNS_SETUP.md`.

---

### TL;DR

Keep DNS at Cloudflare unless you have no other option. All current
automation assumes Cloudflare is authoritative; shifting back to GoDaddy
should be treated as a manual DR event, not a normal workflow.

