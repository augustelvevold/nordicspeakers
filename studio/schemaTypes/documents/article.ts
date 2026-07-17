import { defineType, defineField } from 'sanity';
import { slugify } from '../lib/slugify';

export const article = defineType({
  name: 'article',
  title: 'Artikkel',
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
      name: 'author',
      title: 'Forfatter',
      type: 'reference',
      to: [{ type: 'speaker' }, { type: 'teamAuthor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publisert',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Sist oppdatert',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ingress',
      type: 'text',
      rows: 3,
      description: 'Maks 155 tegn. Doubler som meta-beskrivelse.',
      validation: (rule) => rule.required().max(155),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'topics',
      title: 'Temaer',
      type: 'array',
      // disableNew: see speaker.ts — pick existing topics only, no inline creation.
      of: [{ type: 'reference', to: [{ type: 'topic' }], options: { disableNew: true } }],
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    }),
    defineField({
      name: 'faq',
      title: 'Ofte stilte spørsmål',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', date: 'publishedAt' },
    prepare: ({ title, media, date }) => ({
      title,
      media,
      subtitle: date ? new Date(date).toLocaleDateString('nb-NO') : 'Ikke publisert',
    }),
  },
});
