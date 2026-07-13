import { defineType, defineField } from 'sanity';

// Singleton — one document, edited via the pinned "Innstillinger" item in the
// desk (see studio/structure). Feeds Organization JSON-LD, contact details and
// the default OG image (docs/content-model.md, docs/seo.md).
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Innstillinger',
  type: 'document',
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organisasjonsnavn',
      type: 'string',
      initialValue: 'Nordic Speakers',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Kort beskrivelse av Nordic Speakers — brukes i Organization-schema.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Standard delebilde (OG)',
      description: '1200×630. Brukes når en side ikke har eget bilde.',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'email',
      title: 'E-post',
      type: 'string',
      validation: (rule) =>
        rule.email().error('Skriv inn en gyldig e-postadresse.'),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Sosiale profiler',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Feeds Organization.sameAs (JSON-LD).',
    }),
  ],
  preview: {
    select: { title: 'orgName' },
    prepare: ({ title }) => ({ title: title ?? 'Innstillinger' }),
  },
});
