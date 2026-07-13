import { sanityClient } from './sanity';
import type { SanityImageValue } from './image';

// ---- Shapes (loose — GROQ projections below define the actual fields) --------

export interface TopicRef {
  title: string;
  slug: string;
}
export interface Testimonial {
  quote: string;
  personName: string;
  personRole?: string;
  company?: string;
}
export interface SpeakerCardData {
  _id: string;
  name: string;
  slug: string;
  shortBio: string;
  featured?: boolean;
  image?: SanityImageValue;
  topics?: TopicRef[];
}
export interface SpeakerDetail extends SpeakerCardData {
  externalUrl?: string;
  sameAs?: string[];
  fullBio?: unknown;
  testimonials?: Testimonial[];
}
export interface TopicCardData {
  title: string;
  slug: string;
  intro: string;
  speakerCount?: number;
}
export interface FaqItem {
  question: string;
  answer: string;
}
export interface TopicDetail {
  title: string;
  slug: string;
  intro: string;
  body?: unknown;
  faq?: FaqItem[];
  speakers?: SpeakerCardData[];
}

// ---- Projections -------------------------------------------------------------

const SPEAKER_CARD = `{
  _id, name, "slug": slug.current, shortBio, featured,
  image{alt, asset},
  "topics": topics[]->{ "title": title, "slug": slug.current }
}`;

const SPEAKER_DETAIL = `{
  _id, name, "slug": slug.current, shortBio, featured, externalUrl, sameAs,
  image{alt, asset},
  fullBio,
  "topics": topics[]->{ "title": title, "slug": slug.current },
  "testimonials": testimonials[]->{ quote, personName, personRole, company }
}`;

const TOPIC_CARD = `{
  "title": title, "slug": slug.current, intro,
  "speakerCount": count(*[_type=="speaker" && references(^._id)])
}`;

const TOPIC_DETAIL = `{
  "title": title, "slug": slug.current, intro, body, faq,
  "speakers": *[_type=="speaker" && references(^._id)]|order(name)${SPEAKER_CARD}
}`;

// ---- Fetchers ----------------------------------------------------------------

export function getFeaturedSpeakers() {
  return sanityClient.fetch<SpeakerCardData[]>(
    `*[_type=="speaker" && featured==true]|order(name)${SPEAKER_CARD}`,
  );
}

export function getAllSpeakers() {
  return sanityClient.fetch<SpeakerCardData[]>(
    `*[_type=="speaker"]|order(name)${SPEAKER_CARD}`,
  );
}

export function getAllSpeakersDetail() {
  return sanityClient.fetch<SpeakerDetail[]>(
    `*[_type=="speaker" && defined(slug.current)]|order(name)${SPEAKER_DETAIL}`,
  );
}

export function getAllTopics() {
  return sanityClient.fetch<TopicCardData[]>(
    `*[_type=="topic"]|order(title)${TOPIC_CARD}`,
  );
}

export function getAllTopicsDetail() {
  return sanityClient.fetch<TopicDetail[]>(
    `*[_type=="topic" && defined(slug.current)]|order(title)${TOPIC_DETAIL}`,
  );
}
