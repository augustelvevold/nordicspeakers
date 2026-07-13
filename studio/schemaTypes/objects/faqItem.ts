import { defineType, defineField } from 'sanity';

// A single question/answer pair. Answer is plain text so the visible FAQ and
// the FAQPage JSON-LD stay byte-for-byte identical (docs/seo.md).
export const faqItem = defineType({
  name: 'faqItem',
  title: 'Spørsmål og svar',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Svar',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});
