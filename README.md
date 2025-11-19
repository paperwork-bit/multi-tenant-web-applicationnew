
  # Multi-Tenant Web App UI Kit

  This is a code bundle for Multi-Tenant Web App UI Kit. The original project is available at https://www.figma.com/design/azTY9ywS0q7FLr2wOqnMe9/Multi-Tenant-Web-App-UI-Kit.

  ## Cloudflare Stack

  - Frontend: Vite SPA deployed via Cloudflare Pages
  - API: Cloudflare Pages Functions (`functions/api/[[path]].ts`)
  - Database: Cloudflare D1 (`wrangler.toml` binding `D1_DB`)

  ## Commands

  | Purpose | Command |
  | --- | --- |
  | Install deps | `npm install` |
  | Vite dev server only | `npm run dev` |
  | Full stack dev (Vite + Workers + D1) | `npm run cf:dev` |
  | Build SPA | `npm run build` |
  | Deploy to Cloudflare Pages | `npm run cf:deploy` |
  | Apply D1 migrations | `npm run cf:migrate` |
  | Replay localStorage export into D1 | `npm run migrate:local -- --input ./data/local-storage.json --api http://127.0.0.1:8787/api` |

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  