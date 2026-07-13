// Registry of every schema type. Objects first, then documents.
import { blockContent } from './objects/blockContent';
import { imageWithAlt } from './objects/imageWithAlt';
import { faqItem } from './objects/faqItem';

import { siteSettings } from './documents/siteSettings';
import { speaker } from './documents/speaker';
import { topic } from './documents/topic';
import { event } from './documents/event';
import { article } from './documents/article';
import { caseStudy } from './documents/caseStudy';
import { testimonial } from './documents/testimonial';
import { teamAuthor } from './documents/teamAuthor';

export const schemaTypes = [
  // Reusable objects
  blockContent,
  imageWithAlt,
  faqItem,
  // Documents
  siteSettings,
  speaker,
  topic,
  event,
  article,
  caseStudy,
  testimonial,
  teamAuthor,
];
