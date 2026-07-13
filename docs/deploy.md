# Deploy — Cloudflare Pages + Sanity webhook

Host is **Cloudflare Pages** (not Vercel): the booking endpoint
[functions/api/book.ts](../functions/api/book.ts) is a Cloudflare Pages Function.
GitHub push → Cloudflare build → deploy. Publishing in Sanity triggers a rebuild
via a deploy hook.

Repo: `github.com/augustelvevold/nordicspeakers`, branch `main`.

## 1. Connect the repo (Cloudflare dashboard)

dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick `augustelvevold/nordicspeakers`.

Build settings:

| Setting | Value |
|---|---|
| Framework preset | Astro (or None) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repo root) |

The `functions/` directory is auto-detected — no config needed for `/api/book`.
The `studio/` workspace is not part of the site build.

## 2. Environment variables (Pages → Settings → Environment variables)

Set for **Production** (and Preview if used):

| Variable | Value | Needed for |
|---|---|---|
| `NODE_VERSION` | `22` | Astro 7 requires Node ≥ 22.12 |
| `PUBLIC_SANITY_PROJECT_ID` | `2xo7pdy5` | build (content) |
| `PUBLIC_SANITY_DATASET` | `production` | build |
| `PUBLIC_SANITY_API_VERSION` | `2024-01-01` | build |
| `SANITY_API_TOKEN` | *(Viewer token)* | **build — REQUIRED** (private dataset) |
| `RESEND_API_KEY` | *(Resend key)* | booking form delivery |
| `BOOKING_TO_EMAIL` | *(inbox)* | booking form delivery |
| `BOOKING_FROM_EMAIL` | *(verified sender)* | booking form (optional) |

> **Critical:** without `SANITY_API_TOKEN` the build still succeeds but the site
> is empty (tokenless reads of a private dataset return nothing). Set it before
> the first deploy, or redeploy after adding it.

## 3. Rebuild on publish (Sanity → Cloudflare)

1. Cloudflare Pages → Settings → **Deploy hooks** → create one → copy the URL.
2. manage.sanity.io → project `2xo7pdy5` → **API** → **Webhooks** → **Create webhook**:
   - URL: the deploy hook URL
   - Trigger on: create / update / delete
   - Dataset: `production`
   - (Optional) filter to published docs only

## 4. Custom domain

Pages → **Custom domains** → add `nordicspeakers.no` and follow the DNS steps.

## Local form testing (optional)

`astro dev` does not run `functions/`. To test the booking POST end-to-end
locally: `npm run build` then `npx wrangler pages dev dist` (needs a Cloudflare
login). In normal `astro dev` the form UI works but the POST 404s — expected.

## Still outstanding (see roadmap step 6)

- `public/og-default.png` — 1200×630 share image for pages without a photo.
- Self-hosted brand font (system stack for now).
- Run Lighthouse against the deployed URL (target ≥ 95).
