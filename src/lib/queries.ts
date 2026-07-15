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

// `refs[defined(@->_id)]->` drops references whose target no longer resolves
// (a topic/testimonial the editor deleted while a speaker still points at it).
// Without the filter, `->` yields a null array element and the templates' .map
// crashes the whole build. perspective:'published' (see sanity.ts) already keeps
// drafts out; this guards dangling refs among published docs too.
const SPEAKER_CARD = `{
  _id, name, "slug": slug.current, shortBio, featured,
  image{alt, asset},
  "topics": topics[defined(@->_id)]->{ "title": title, "slug": slug.current }
}`;

const SPEAKER_DETAIL = `{
  _id, name, "slug": slug.current, shortBio, featured, externalUrl, sameAs,
  image{alt, asset},
  fullBio,
  "topics": topics[defined(@->_id)]->{ "title": title, "slug": slug.current },
  "testimonials": testimonials[defined(@->_id)]->{ quote, personName, personRole, company }
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

// ---- Articles / case studies / testimonials (step 5) -------------------------

export interface ArticleCardData {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  image?: SanityImageValue;
  authorName?: string;
}
export interface ArticleDetail extends ArticleCardData {
  updatedAt?: string;
  body?: unknown;
  topics?: TopicRef[];
}
export interface CaseStudyCardData {
  title: string;
  slug: string;
  client: string;
}
export interface CaseStudyDetail extends CaseStudyCardData {
  challenge?: string;
  solution?: string;
  result?: string;
  quote?: string;
  speaker?: { name: string; slug: string };
}
export interface TestimonialFull {
  quote: string;
  personName: string;
  personRole?: string;
  company?: string;
  speaker?: { name: string; slug: string };
}

const ARTICLE_CARD = `{
  title, "slug": slug.current, excerpt, publishedAt,
  "image": mainImage{alt, asset},
  "authorName": author->name
}`;

const ARTICLE_DETAIL = `{
  title, "slug": slug.current, excerpt, publishedAt, updatedAt,
  "image": mainImage{alt, asset},
  body,
  "topics": topics[defined(@->_id)]->{ "title": title, "slug": slug.current },
  "authorName": author->name
}`;

const CASE_CARD = `{ title, "slug": slug.current, client }`;

const CASE_DETAIL = `{
  title, "slug": slug.current, client, challenge, solution, result, quote,
  "speaker": speaker->{ name, "slug": slug.current }
}`;

const TESTIMONIAL = `{
  quote, personName, personRole, company,
  "speaker": speaker->{ name, "slug": slug.current }
}`;

export function getAllArticles() {
  return sanityClient.fetch<ArticleCardData[]>(
    `*[_type=="article" && defined(slug.current)]|order(publishedAt desc)${ARTICLE_CARD}`,
  );
}

export function getAllArticlesDetail() {
  return sanityClient.fetch<ArticleDetail[]>(
    `*[_type=="article" && defined(slug.current)]|order(publishedAt desc)${ARTICLE_DETAIL}`,
  );
}

export function getAllCaseStudies() {
  return sanityClient.fetch<CaseStudyCardData[]>(
    `*[_type=="caseStudy" && defined(slug.current)]|order(title)${CASE_CARD}`,
  );
}

export function getAllCaseStudiesDetail() {
  return sanityClient.fetch<CaseStudyDetail[]>(
    `*[_type=="caseStudy" && defined(slug.current)]|order(title)${CASE_DETAIL}`,
  );
}

export function getAllTestimonials() {
  return sanityClient.fetch<TestimonialFull[]>(
    `*[_type=="testimonial"]|order(_createdAt desc)${TESTIMONIAL}`,
  );
}
