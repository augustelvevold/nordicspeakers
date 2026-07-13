import { defineType, defineField } from 'sanity';
import { slugify } from '../lib/slugify';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Kundesuksess',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', slugify, maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Kunde',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Foredragsholder',
      type: 'reference',
      to: [{ type: 'speaker' }],
    }),
    defineField({
      name: 'challenge',
      title: 'Utfordring',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'solution',
      title: 'Løsning',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'result',
      title: 'Resultat',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'quote',
      title: 'Sitat fra kunden',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'client' } },
});
