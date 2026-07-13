import { defineType, defineField } from 'sanity';
import { slugify } from '../lib/slugify';

export const event = defineType({
  name: 'event',
  title: 'Arrangement',
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
      name: 'speaker',
      title: 'Foredragsholder',
      type: 'reference',
      to: [{ type: 'speaker' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Slutt',
      type: 'datetime',
    }),
    defineField({
      name: 'online',
      title: 'Digitalt arrangement',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'locationName',
      title: 'Sted (navn)',
      type: 'string',
      hidden: ({ parent }) => parent?.online === true,
    }),
    defineField({
      name: 'locationAddress',
      title: 'Adresse',
      type: 'string',
      hidden: ({ parent }) => parent?.online === true,
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Påmelding / billetter (URL)',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'title', date: 'startDate', speaker: 'speaker.name' },
    prepare: ({ title, date, speaker }) => ({
      title,
      subtitle: [speaker, date ? new Date(date).toLocaleDateString('nb-NO') : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
});
