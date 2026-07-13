import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Referanse',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Sitat',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'personName',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'personRole',
      title: 'Rolle / tittel',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Selskap / organisasjon',
      type: 'string',
    }),
    defineField({
      name: 'speaker',
      title: 'Gjelder foredragsholder',
      type: 'reference',
      to: [{ type: 'speaker' }],
    }),
  ],
  preview: {
    select: { quote: 'quote', name: 'personName', company: 'company' },
    prepare: ({ quote, name, company }) => ({
      title: name,
      subtitle: [company, quote].filter(Boolean).join(' — '),
    }),
  },
});
