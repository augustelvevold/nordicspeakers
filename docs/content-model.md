# Sanity content model & content

Schemas, portable text restrictions, initial speaker content, and copy tone. Read before touching Sanity schemas, content fields, or seed content. Schemas are defined in code in this repo (`/sanity` or a `studio/` workspace); the client edits speakers, events, articles, testimonials — nothing else. The model should make it hard for a non-technical editor to break anything: **structured fields over rich freeform wherever possible**.

## Documents

- `speaker`: name, slug, image (+alt), shortBio (plain text, 2–3 sentences — used for meta description and answer block), fullBio (portable text), topics (refs), externalUrl, sameAs[], featured (bool), testimonials (refs), faq[] ({question, answer} — speaker-specific Q&A, rendered with FAQPage schema on the speaker page).
- `topic`: title, slug, intro (2–3 sentences), body (portable text), relatedSpeakers auto via reference lookup, faq[] ({question, answer}).
- `event`: title, slug, speaker (ref), startDate, endDate?, locationName, locationAddress?, online (bool), description, bookingUrl?.
- `article`: title, slug, author (ref → speaker or a `teamAuthor`), publishedAt, updatedAt, excerpt (≤155 chars, required — doubles as meta description), mainImage (+alt), body (portable text), topics (refs), faq[]?.
- `caseStudy`: title, slug, client, challenge, solution, result, quote?, speaker (ref).
- `testimonial`: quote, personName, personRole, company, speaker (ref).
- `siteSettings` (singleton): org info, social links, contact details, default OG image.

**Topics are a controlled vocabulary.** `speaker.topics` and `article.topics` use `disableNew` on the reference — editors select existing topics only; new topics are created deliberately in the Temaer section. This prevents duplicate topic documents (e.g. two "Entreprenørskap" with different slugs, one referenced per speaker).

**Topic content is speaker-agnostic.** A topic page lists many speakers (the list is derived from references), so its `intro`/`body`/`faq` must describe the *subject*, never one speaker. Anything specific to a person — their angle, "does X share their own story?" — belongs in `speaker.faq` (or `fullBio`), not the topic.

Alt text is a **required field on all image fields** (descriptive Norwegian — it feeds the `<Image />` alt in [seo.md](seo.md)).

## Portable text config

Restrict marks/blocks to what the design supports: h2, h3, lists, links, blockquote, image-with-required-alt. **No freeform HTML.**

## Initial content — speakers

**Stig Bareksten** — https://www.stigbareksten.com
Topics: entreprenørskap, ledelse, merkevarebygging, innovasjon, gin/destillering, historiefortelling, eksport, premium branding.

**Arman Vestad** — https://www.armanv.no
Topics: salg, motivasjon, ledelse, mental trening, prestasjon, teamutvikling, kommunikasjon.

## Copy tone

Target audiences: bedrifter, HR, konferanser, eventbyråer, kommuner/fylkeskommuner, organisasjoner, skoler/universiteter, næringsforeninger. Professional but warm bokmål; no anglicisms where a Norwegian word exists.
