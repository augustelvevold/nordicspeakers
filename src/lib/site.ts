// Single source of truth for site-wide constants. Imported by the SEO
// component and the schema builders so meta/JSON-LD never hardcode these in
// page files (see the "Conventions" rule in CLAUDE.md).
//
// TODO(content): replace placeholder assets/contact below with real ones, and
// longer term source org/contact/social from Sanity `siteSettings`
// (docs/content-model.md).

export const SITE = {
  name: 'Nordic Speakers',
  /** Bare origin — used to build absolute canonical, OG and sitemap URLs. */
  url: 'https://nordicspeakers.no',
  /** Norwegian one-liner; feeds default meta + Organization schema. */
  description:
    'Nordic Speakers formidler profesjonelle foredragsholdere til bedrifter, konferanser og organisasjoner i hele Norge.',
  /** Open Graph locale. */
  locale: 'nb_NO',
  /** <html lang> value. */
  lang: 'nb',
  /** TODO(content): real OG image (1200×630). */
  defaultOgImage: '/og-default.png',
  /** TODO(content): real logo asset. */
  logo: '/logo.png',
  /** TODO(content): real social profiles → Organization.sameAs. */
  sameAs: [] as string[],
} as const;
