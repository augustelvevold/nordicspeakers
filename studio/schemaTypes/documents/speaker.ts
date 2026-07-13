import { defineType, defineField } from 'sanity';
import { slugify } from '../lib/slugify';

export const speaker = defineType({
  name: 'speaker',
  title: 'Foredragsholder',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'name', slugify, maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Portrett',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'shortBio',
      title: 'Kort presentasjon',
      type: 'text',
      rows: 3,
      description:
        '2–3 setninger. Brukes som meta-beskrivelse og som svarblokk øverst på siden.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'fullBio',
      title: 'Full biografi',
      type: 'blockContent',
    }),
    defineField({
      name: 'topics',
      title: 'Temaer',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
    }),
    defineField({
      name: 'externalUrl',
      title: 'Egen nettside',
      type: 'url',
    }),
    defineField({
      name: 'sameAs',
      title: 'Profiler (sameAs)',
      description: 'Egen nettside og sosiale profiler — brukes i Person-schema (JSON-LD).',
      type: 'array',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'featured',
      title: 'Fremhevet på forsiden',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'testimonials',
      title: 'Referanser',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'shortBio', media: 'image' },
  },
});
