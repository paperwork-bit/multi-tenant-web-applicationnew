# Cloudflare DNS Setup for Cloudflare Pages

The site now deploys via Cloudflare Pages, so all DNS stays inside
Cloudflare. These steps assume `xtechsrenewables.com.au` already uses
Cloudflare nameservers (if it does not, follow `GODADDY_DNS_SETUP.md` to
delegate the domain first).

---

## 1. Gather the Pages target

1. Open the Pages project (e.g., `multi-tenant-web-app`) in the
   Cloudflare dashboard.
2. Click **Settings → Domains & certificates**.
3. Add (or note) the provided `.pages.dev` hostname, e.g.
   `multi-tenant-web-app.pages.dev`. We’ll point DNS records at this
   value.

---

## 2. Clean up legacy Firebase records

Inside **DNS → Records** remove anything pointing at Firebase:

- `A @ 199.36.158.100`
- `TXT @ hosting-site=multi-tenant-web`
- Any Firebase-specific subdomains

This prevents old TXT/A records from blocking Pages verification.

---

## 3. Add root + www CNAMEs

Cloudflare supports **CNAME flattening**, so you can map the apex domain
directly to the Pages hostname.

| Record | Type | Name | Content | Proxy |
| --- | --- | --- | --- | --- |
| Root | `CNAME` | `@` | `multi-tenant-web-app.pages.dev` | **Proxied** (orange) |
| www | `CNAME` | `www` | `multi-tenant-web-app.pages.dev` | **Proxied** (orange) |

> Replace `multi-tenant-web-app.pages.dev` with the project-specific
> host from step 1.

Leave TTL on **Auto**. Proxied records ensure Cloudflare issues and
manages the SSL certificate automatically.

---

## 4. Verify the domain in Pages

Back in Pages:

1. Navigate to **Settings → Domains & certificates**.
2. Add both `xtechsrenewables.com.au` and `www.xtechsrenewables.com.au`.
3. Cloudflare will detect the DNS records we just created and finish
   verification (typically <5 minutes).
4. Wait for the “Active” badge and edge certificate issuance.

---

## 5. Testing & Propagation

- Use `https://www.whatsmydns.net/#CNAME/www.xtechsrenewables.com.au` to
  confirm the CNAME resolves to the `*.pages.dev` target.
- Hit `https://xtechsrenewables.com.au/api/health` to ensure the Worker
  responds once DNS propagates.
- If you still see the Firebase site, clear local DNS cache:
  `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder`.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Pages says “Pending” | Make sure both `@` and `www` CNAMEs reference the Pages hostname and are proxied |
| Certificate stuck provisioning | Toggle proxy off → wait 5 min → turn it back on; Cloudflare re-issues the cert |
| Non-www works but www doesn’t | Confirm the `www` CNAME exists and isn’t cached by old Firebase records |
| Need to serve an additional subdomain | Add another CNAME pointing at the same `*.pages.dev` target, then register it inside Pages |

Once both CNAMEs are live, all traffic routes through Cloudflare’s edge
to the Pages deployment—no Firebase DNS entries remain.

