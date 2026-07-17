import { defineType, defineField } from 'sanity';
import { slugify } from '../lib/slugify';

export const topic = defineType({
  name: 'topic',
  title: 'Tema',
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
      name: 'intro',
      title: 'Introduksjon',
      type: 'text',
      rows: 3,
      description: '2–3 setninger. Svarblokk øverst + meta-beskrivelse.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'body',
      title: 'Innhold',
      type: 'blockContent',
    }),
    defineField({
      name: 'faq',
      title: 'Ofte stilte spørsmål – om temaet',
      description:
        'Kun generelle spørsmål om selve temaet, som gjelder uansett hvem som holder foredraget. ' +
        '✅ «Hvem passer et foredrag om entreprenørskap for?»  ' +
        '❌ «Deler Thomas egne erfaringer?» — personlige spørsmål hører hjemme på foredragsholderen.',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
    // relatedSpeakers is intentionally NOT stored — it is derived at query time
    // from speakers that reference this topic (docs/content-model.md). Keeping
    // it computed avoids two sources of truth the editor could desync.
  ],
  preview: { select: { title: 'title', subtitle: 'intro' } },
});
