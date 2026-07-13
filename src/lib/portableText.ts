import { toHTML, type PortableTextComponents } from '@portabletext/to-html';
import { urlFor, type SanityImageValue } from './image';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Serializers for the restricted blockContent (docs/content-model.md): the link
// annotation and inline images with required alt. Everything else uses the
// library defaults (h2/h3, lists, blockquote, strong/em).
const components: PortableTextComponents = {
  types: {
    imageWithAlt: ({ value }: { value: SanityImageValue }) => {
      if (!value?.asset?._ref) return '';
      const url = urlFor(value).width(1200).auto('format').url();
      return `<img src="${url}" alt="${escapeHtml(value.alt ?? '')}" loading="lazy" decoding="async" />`;
    },
  },
  marks: {
    link: ({ children, value }: { children: string; value?: { href?: string; blank?: boolean } }) => {
      const href = escapeHtml(value?.href ?? '#');
      const attrs = value?.blank ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${attrs}>${children}</a>`;
    },
  },
};

/** Render restricted portable text to an HTML string (empty string if nothing). */
export function renderPortableText(blocks: unknown): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';
  return toHTML(blocks, { components });
}
