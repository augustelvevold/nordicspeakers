# Roadmap — build order

The to-do list for what to build next. Tick items as `[x]` when done; add notes inline as the real requirements of a step become clearer. Each step should leave the site buildable (`npx astro build` green).

- [x] 1. Scaffold Astro project, base layout, SEO component + schema builders, global styles. ([seo.md](seo.md))
- [x] 2. Sanity studio + schemas, seed with the two speakers and 3–4 topics. ([content-model.md](content-model.md))
- [x] 3. Templates: front page, speaker index/detail, topic index/detail.
- [x] 4. Booking page + form endpoint, kontakt, om-oss, FAQ. ([site-structure.md](site-structure.md) § Conversion)
- [x] 5. Blog + case studies + testimonials templates. (Case studies + testimonials ship as templates with empty states — no fabricated content; client adds real ones.)
- [ ] 6. sitemap/robots/llms.txt, OG image handling, 404, final Lighthouse pass. ([seo.md](seo.md) § Technical checklist)
  - Done: sitemap (excludes noindex `/takk/` + `/llms.txt`), `robots.txt`, build-time `/llms.txt`, `404`, per-page OG images (speaker photo / article image, 1200×630 crop).
  - Remaining: `og-default.png` (1200×630 design asset for pages without an image), self-hosted brand font (system stack for now — pending a font choice), and running Lighthouse post-deploy (needs a browser).
- [x] 7. Cloudflare Pages deploy + Sanity webhook. (Live at nordicspeakers.pages.dev via GitHub Actions CI — push / repository_dispatch / manual. Sanity webhook config in [deploy.md](deploy.md); needs a GitHub PAT to activate rebuild-on-publish.)
