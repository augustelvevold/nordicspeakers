# Deploy — Cloudflare Pages via GitHub Actions

Host is **Cloudflare Pages**, project **`nordicspeakers`** (account: Elvevold),
created with `wrangler`. Live at https://nordicspeakers.pages.dev/. The booking
endpoint [functions/api/book.ts](../functions/api/book.ts) is a Pages Function,
deployed alongside the static site.

## How deploys happen (CI)

[.github/workflows/deploy.yml](../.github/workflows/deploy.yml) builds and
deploys on:

- **push to `main`** — every code change
- **`repository_dispatch` (`sanity-publish`)** — content rebuild from a Sanity webhook
- **manual** — the "Run workflow" button

The job runs `npm ci`, `npm run build` (fetches Sanity content), then
`wrangler pages deploy dist` (ships `dist/` **and** `functions/`).

> The dashboard "Connect to Git" flow funnels into the Workers importer (wants a
> PR/wrangler config) — we don't use it. CI via the Action is the source of truth.

### Required GitHub secrets

Repo → Settings → Secrets and variables → Actions:

| Secret | What | How |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | deploy auth | CF → My Profile → API Tokens → Custom → **Account · Cloudflare Pages · Edit** |
| `SANITY_API_TOKEN` | build reads the private dataset | Sanity Viewer token (same value as local `.env`) |

Non-secret build config (`PUBLIC_SANITY_*`) and the CF `accountId` are baked into
the workflow file.

## Rebuild on publish (Sanity → GitHub → deploy)

So the client publishing in Studio updates the live site:

1. Create a GitHub **fine-grained PAT** for this repo with **Contents: Read and write**.
2. manage.sanity.io → project `2xo7pdy5` → **API → Webhooks → Create**:
   - URL: `https://api.github.com/repos/augustelvevold/nordicspeakers/dispatches`
   - Method **POST**; Headers: `Authorization: Bearer <PAT>`, `Accept: application/vnd.github+json`
   - Filter: `!(_id in path("drafts.**"))` — published docs only (no draft-spam rebuilds)
   - Projection (payload): `{"event_type": "sanity-publish"}`
   - Dataset `production`, trigger on create/update/delete

> **Token in use:** fine-grained PAT `Sanity rebuild – nordicspeakers`, **expires 15 June 2027**.
> Rotate before then — regenerate the PAT and update the webhook's `Authorization` header —
> or the auto-rebuild silently stops.

## Studio (CMS) — where content is edited

Deployed (Sanity **v6**) at **https://nordicspeakers.sanity.studio/**. Editors log
in there and create/publish documents — each becomes a page. No code involved.

- Invite editors: manage.sanity.io → project `nordicspeakers` → **Members**.
- Redeploy the Studio after schema changes: `cd studio && npx sanity deploy`
  (host + appId pinned in [studio/sanity.cli.ts](../studio/sanity.cli.ts), so it's
  non-interactive). The Studio is separate from the site build — deploying it does
  not touch the live website.
- Publishing content triggers a site rebuild once the webhook above is wired.

## Booking-form email delivery

Runtime secrets on the **Pages project** (not GitHub) — the function reads them at
request time:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name nordicspeakers
npx wrangler pages secret put BOOKING_TO_EMAIL --project-name nordicspeakers
# optional: BOOKING_FROM_EMAIL (a verified sender)
```

Until set, the form validates + accepts but does not email (no error shown).

## Custom domain

Pages → **Custom domains** → add `nordicspeakers.no` and follow the DNS steps.

## Manual deploy (fallback)

From the repo **root** (not `studio/`):

```bash
npm run build
npx wrangler pages deploy dist --project-name nordicspeakers --branch main --commit-dirty=true
```

## Local form testing

`astro dev` does not run `functions/`. To exercise the booking POST end-to-end:
`npm run build` then `npx wrangler pages dev dist`. In plain `astro dev` the form
UI works but the POST 404s — expected.

## Still outstanding (roadmap step 6)

- `public/og-default.png` — 1200×630 share image for pages without a photo.
- Self-hosted brand font (system stack for now).
- Lighthouse pass against the live URL (target ≥ 95).
