# SEO & answer-engine machinery

Everything meta: the `<SEO />` component, JSON-LD builders, AI-search content formatting, and the build-time technical checklist. Read before touching meta tags, structured data, sitemap/robots/llms.txt, images, fonts, or performance/a11y work. **Never duplicate meta/schema logic in page files — always go through the SEO component and the `src/lib/schema.ts` builders.**

## The `<SEO />` component (build this first)

A single `<SEO />` component used in the base layout. Props-driven. Emits:

- `<title>` (≤60 chars) and meta description (≤155 chars) — **required props, no defaults silently reused across pages**.
- Canonical URL (every page sets a self-referencing canonical).
- Open Graph (og:title, og:description, og:image, og:type, og:locale=nb_NO) + Twitter Card (summary_large_image).
- JSON-LD via a `schema` prop accepting one or more objects. Common builders live in `src/lib/schema.ts`:
  - `Organization` (site-wide, on front page): Foredragsholdere.no, logo, contactPoint, sameAs.
  - `Person` for each speaker (name, jobTitle, url, image, knowsAbout, sameAs → their own site).
  - `Event` for events (name, startDate, location, performer → Person, offers if applicable).
  - `Article` / `BlogPosting` for blog posts (headline, author, datePublished, dateModified, image).
  - `FAQPage` for the FAQ page and FAQ blocks on other pages.
  - `BreadcrumbList` everywhere below root.
  - `Speakable` on front page and topic pages (cssSelector pointing at the intro/summary block).
- All schema output must validate in Google's Rich Results Test. **Never invent data** (no fake aggregateRating etc.).

## AI search / answer-engine formatting

Applies to all content templates:

- Every page opens with a 2–3 sentence direct-answer summary under the H1 (this is the block Speakable points at).
- One H1 per page. Logical H2/H3 hierarchy phrased as questions where natural ("Hva koster et foredrag?").
- Short paragraphs (2–4 sentences), definition blocks, tables and lists where they genuinely fit.
- FAQ sections (visible content + FAQPage JSON-LD, always matching each other exactly).
- Semantic HTML5: `<article>`, `<section>`, `<nav>`, `<time>`, `<address>` — no div soup.

## Technical checklist (build-time, mostly one-time setup)

- `@astrojs/sitemap` for XML sitemap; hand-written `robots.txt` referencing it.
- Generate `llms.txt` at build time: short site description + links to key pages (supplement, not a ranking factor — keep it simple).
- Astro `<Image />` for all images: WebP/AVIF, explicit width/height, `loading="lazy"` below the fold, descriptive Norwegian alt text (client provides via a required alt field in Sanity — alt is mandatory on all image fields, see [content-model.md](content-model.md)).
- Fonts: self-hosted, `font-display: swap`, preload the primary woff2.
- Preconnect to the Sanity CDN if images are served from it.
- Accessibility: WCAG 2.1 AA. Landmark roles, focus states, contrast, skip link.
- Target Lighthouse ≥95 on all categories for every template. No render-blocking third-party scripts. No cookie-consent-requiring analytics initially (if analytics later: privacy-friendly, e.g. Plausible/Umami).
