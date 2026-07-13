// JSON-LD builders — the ONLY place structured data is constructed. Page files
// and the SEO component consume these; they never hand-roll schema objects
// (CLAUDE.md "Conventions", docs/seo.md). Each builder returns a self-contained
// object with @context so the SEO component can emit each as its own
// <script type="application/ld+json">.
//
// Never invent data: optional fields left undefined are stripped before output
// (see clean()), so a missing image / sameAs / address simply won't appear —
// no empty or fabricated values. All output must validate in Google's Rich
// Results Test.

import { SITE } from './site';

const CONTEXT = 'https://schema.org';

export type JsonLd = Record<string, unknown> & { '@type': string };

/** Recursively drop undefined, null and empty-array values so we never emit
 *  hollow or fabricated fields. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => clean(v)).filter((v) => v !== undefined) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[k] = clean(v);
    }
    return out as unknown as T;
  }
  return value;
}

/** Resolve a path or absolute URL to an absolute URL against the site origin. */
function abs(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE.url).href;
}

// ---------------------------------------------------------------------------
// Site-wide
// ---------------------------------------------------------------------------

/** Organization — site-wide identity, place on the front page. */
export function organization(): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': 'Organization',
    name: SITE.name,
    url: abs('/'),
    logo: abs(SITE.logo),
    description: SITE.description,
    sameAs: SITE.sameAs,
  });
}

/** WebSite — pairs with Organization on the front page. */
export function website(): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': 'WebSite',
    name: SITE.name,
    url: abs('/'),
    inLanguage: SITE.lang,
  });
}

// ---------------------------------------------------------------------------
// Person (speakers)
// ---------------------------------------------------------------------------

export interface PersonInput {
  name: string;
  /** Canonical speaker page on our site (path or absolute URL). */
  url: string;
  jobTitle?: string;
  image?: string;
  description?: string;
  /** Topics the speaker covers. */
  knowsAbout?: string[];
  /** Their own site + social profiles. */
  sameAs?: string[];
}

/** Person node without @context, for nesting (e.g. Event.performer). */
function personNode(input: PersonInput): JsonLd {
  return clean({
    '@type': 'Person',
    name: input.name,
    url: abs(input.url),
    jobTitle: input.jobTitle,
    image: input.image ? abs(input.image) : undefined,
    description: input.description,
    knowsAbout: input.knowsAbout,
    sameAs: input.sameAs,
  });
}

/** Person — one per speaker. */
export function person(input: PersonInput): JsonLd {
  return { '@context': CONTEXT, ...personNode(input) };
}

// ---------------------------------------------------------------------------
// Event
// ---------------------------------------------------------------------------

export interface EventInput {
  name: string;
  /** ISO 8601, e.g. 2026-09-01T18:00:00+02:00. */
  startDate: string;
  endDate?: string;
  url?: string;
  description?: string;
  performer?: PersonInput;
  location?: { name: string; address?: string };
  online?: boolean;
  offers?: {
    url?: string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}

export function event(input: EventInput): JsonLd {
  const location = input.online
    ? { '@type': 'VirtualLocation', url: input.url ? abs(input.url) : undefined }
    : input.location
      ? {
          '@type': 'Place',
          name: input.location.name,
          address: input.location.address,
        }
      : undefined;

  return clean({
    '@context': CONTEXT,
    '@type': 'Event',
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: input.online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    url: input.url ? abs(input.url) : undefined,
    description: input.description,
    location,
    performer: input.performer ? personNode(input.performer) : undefined,
    offers: input.offers ? { '@type': 'Offer', ...input.offers } : undefined,
  });
}

// ---------------------------------------------------------------------------
// Article / BlogPosting
// ---------------------------------------------------------------------------

export interface ArticleInput {
  headline: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  image?: string;
  author?: { name: string; url?: string };
  type?: 'Article' | 'BlogPosting';
}

export function article(input: ArticleInput): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': input.type ?? 'BlogPosting',
    headline: input.headline,
    mainEntityOfPage: abs(input.url),
    url: abs(input.url),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    description: input.description,
    image: input.image ? abs(input.image) : undefined,
    author: input.author
      ? {
          '@type': 'Person',
          name: input.author.name,
          url: input.author.url ? abs(input.author.url) : undefined,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: abs(SITE.logo) },
    },
  });
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage — the visible FAQ content and this JSON-LD must match exactly. */
export function faqPage(items: FaqItem[]): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  });
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

export interface Crumb {
  name: string;
  /** Path or absolute URL. */
  url: string;
}

/** BreadcrumbList — on every page below the front page, mirroring the visible
 *  breadcrumb trail. */
export function breadcrumbList(crumbs: Crumb[]): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  });
}

// ---------------------------------------------------------------------------
// Speakable
// ---------------------------------------------------------------------------

export interface SpeakableInput {
  name: string;
  url: string;
  /** Selectors pointing at the intro/summary block(s). */
  cssSelectors: string[];
}

/** WebPage carrying a SpeakableSpecification — front page and topic pages. */
export function speakableWebPage(input: SpeakableInput): JsonLd {
  return clean({
    '@context': CONTEXT,
    '@type': 'WebPage',
    name: input.name,
    url: abs(input.url),
    inLanguage: SITE.lang,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: input.cssSelectors,
    },
  });
}
