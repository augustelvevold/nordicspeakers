import { defineType, defineField } from 'sanity';

// Reusable image type with a REQUIRED Norwegian alt text. Every image field in
// the model uses this so alt is mandatory everywhere (docs/content-model.md,
// docs/seo.md — it feeds the <Image /> alt).
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Bilde',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternativ tekst',
      type: 'string',
      description:
        'Beskriv bildet på norsk. Kreves for tilgjengelighet (skjermlesere) og SEO.',
      validation: (rule) => rule.required().max(160),
    }),
  ],
});
