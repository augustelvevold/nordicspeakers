import { defineType, defineField } from 'sanity';

// Non-speaker article authors (the agency team). Articles reference either a
// speaker or a teamAuthor (docs/content-model.md).
export const teamAuthor = defineType({
  name: 'teamAuthor',
  title: 'Forfatter (team)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rolle',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'bio',
      title: 'Kort bio',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
});
