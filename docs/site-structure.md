# Site structure & conversion

URL scheme, internal-linking rules, and the conversion surfaces. Read before adding routes/pages, touching navigation/breadcrumbs, or working on CTAs and the booking form. When a page type is added, update this doc in the same change (plus sitemap config, breadcrumbs, and internal-link components — see *Conventions* in [CLAUDE.md](../CLAUDE.md)).

## URL structure

```
/                               Forside
/om-oss/                        About
/foredragsholdere/              Speaker index
/foredragsholdere/stig-bareksten/
/foredragsholdere/arman-vestad/
/tema/                          Topic index
/tema/entreprenorskap/
/tema/ledelse/
/tema/innovasjon/
/tema/salg/
/tema/motivasjon/
/tema/merkevarebygging/
/tema/kommunikasjon/
/konferansier/                  MC / host services
/book-foredrag/                 Booking page (primary conversion page)
/blogg/                         Article index (paginated)
/blogg/[slug]/
/kundesuksesser/                Case studies index
/kundesuksesser/[slug]/
/referanser/                    Testimonials
/faq/
/kontakt/
/takk/                          Post-submit confirmation (noindex)
```

Rules:

- Trailing slashes, lowercase, no æ/ø/å in slugs (entreprenørskap → `entreprenorskap`).
- Every page sets a self-referencing canonical (via the `<SEO />` component — [seo.md](seo.md)).
- Breadcrumbs on all pages below the front page, mirrored in BreadcrumbList JSON-LD.

## Internal linking — deliberate, not decorative

- Topic pages link to relevant speakers and relevant blog articles.
- Speaker pages link to their topics.
- Articles link to relevant topic + speaker pages.

## Conversion

- Primary CTA everywhere: "Book foredrag" → `/book-foredrag/`. Secondary: "Kontakt oss".
- Booking page: short form (name, company, email, phone, topic/speaker select, date?, message). **Decided:** posts to a Cloudflare Pages Function ([functions/api/book.ts](../functions/api/book.ts)) — progressive enhancement (works as a plain POST → 303 `/takk/`; a small island upgrades to inline async submit). Honeypot spam field. Delivery is env-configured (Resend: `RESEND_API_KEY`, `BOOKING_TO_EMAIL`) — set in Cloudflare Pages before go-live. Reused on `/kontakt/`.
- Trust elements near every CTA: testimonials, client logos, response-time promise.
- Sticky/bottom CTA on mobile speaker pages.
