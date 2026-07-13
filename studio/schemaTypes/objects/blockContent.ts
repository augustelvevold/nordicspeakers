import { defineType, defineArrayMember } from 'sanity';

// Restricted portable text — only what the templates render (docs/content-model.md).
// No H1 (the page owns its single H1), no freeform HTML. h2/h3, lists, blockquote,
// bold/italic, links, and images with required alt.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Innhold',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Avsnitt', value: 'normal' },
        { title: 'Overskrift 2', value: 'h2' },
        { title: 'Overskrift 3', value: 'h3' },
        { title: 'Sitat', value: 'blockquote' },
      ],
      lists: [
        { title: 'Punktliste', value: 'bullet' },
        { title: 'Nummerert liste', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Fet', value: 'strong' },
          { title: 'Kursiv', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Lenke',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Åpne i ny fane',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
});
