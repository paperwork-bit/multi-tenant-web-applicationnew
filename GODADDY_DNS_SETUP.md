# GoDaddy DNS Setup for Cloudflare Pages

Use this guide only if the domain is still managed at GoDaddy. The goal
is to delegate DNS to Cloudflare so Pages + Workers control the records.

---

## 1. Grab your Cloudflare nameservers

1. Log in to https://dash.cloudflare.com.
2. Open the `xtechsrenewables.com.au` zone (or create it if this is the
   first time).
3. In **Overview → Nameservers**, copy the two servers Cloudflare
   provides. They look like `name.ns.cloudflare.com` and
   `name2.ns.cloudflare.com`.

---

## 2. Update GoDaddy to use those nameservers

1. Log in to GoDaddy → **My Products**.
2. Locate `xtechsrenewables.com.au` and click **DNS** (or **Manage DNS**).
3. In the **Nameservers** section click **Change**.
4. Choose **Enter my own nameservers (advanced)** and paste the two
   Cloudflare values from step 1.
5. Confirm the warning and save.

GoDaddy may email a confirmation—approve it if prompted. Nameserver
changes can take up to 24–48 hours to propagate.

---

## 3. Verify delegation

Use one of the following to confirm GoDaddy is no longer authoritative:

```bash
dig NS xtechsrenewables.com.au
```

or https://www.whatsmydns.net/#NS/xtechsrenewables.com.au

You’re ready to manage DNS inside Cloudflare once those lookups return
the Cloudflare nameservers.

---

## 4. Configure DNS inside Cloudflare

After delegation finishes, follow `CLOUDFLARE_DNS_SETUP.md` to add the
`@` and `www` CNAME records that point to the Pages project. All records
now live in Cloudflare; remove any lingering DNS entries from GoDaddy’s
panel to avoid confusion.

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| GoDaddy refuses the change | Ensure the domain is unlocked and privacy guard isn’t preventing edits |
| Nameservers keep reverting | Some GoDaddy plans require confirming via email; re-open the confirmation email and approve |
| Propagation taking too long | Clear the GoDaddy DNS cache by toggling to default nameservers → save → re-enter Cloudflare nameservers |
| Need to roll back | Re-open the GoDaddy DNS screen and choose “Use default nameservers,” but note this disables Cloudflare’s CDN/Workers |

Once the nameservers point to Cloudflare you should perform all future
DNS edits (including custom subdomains) directly inside the Cloudflare
dashboard.

