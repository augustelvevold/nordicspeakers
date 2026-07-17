import { defineType, defineField } from 'sanity';

// A topic a speaker covers, plus this speaker's own angle on it ("vinkling").
// The angle is optional — blank renders as a plain topic tag; when filled it is
// unique speaker×topic content shown on both the speaker and the topic page
// (docs/content-model.md). The topic reference uses disableNew so editors pick
// existing topics only — new topics are created deliberately in the Temaer
// section, never inline, which is what prevents duplicate topic docs.
export const speakerTopic = defineType({
  name: 'speakerTopic',
  title: 'Tema',
  type: 'object',
  fields: [
    defineField({
      name: 'topic',
      title: 'Tema',
      type: 'reference',
      to: [{ type: 'topic' }],
      options: { disableNew: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vinkling',
      title: 'Vinkling (valgfri)',
      description:
        'Denne foredragsholderens perspektiv på temaet — 1–2 setninger. Vises på temasiden og på foredragsholderens side. La stå tom for kun å vise temaet som en lenke.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'topic.title', subtitle: 'vinkling' },
    prepare: ({ title, subtitle }) => ({
      title: title ?? '(velg tema)',
      subtitle,
    }),
  },
});
