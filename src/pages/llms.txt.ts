import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';
import { getAllSpeakers, getAllTopics } from '../lib/queries';

// Build-time /llms.txt — a short description + links to key pages for AI crawlers
// (docs/seo.md). Supplement, not a ranking factor; keep it simple.
export const GET: APIRoute = async () => {
  const [speakers, topics] = await Promise.all([getAllSpeakers(), getAllTopics()]);
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## Foredragsholdere',
    ...speakers.map((s) => `- [${s.name}](${SITE.url}/foredragsholdere/${s.slug}/)`),
    '',
    '## Temaer',
    ...topics.map((t) => `- [${t.title}](${SITE.url}/tema/${t.slug}/)`),
    '',
    '## Nøkkelsider',
    `- [Book foredrag](${SITE.url}/book-foredrag/)`,
    `- [Om oss](${SITE.url}/om-oss/)`,
    `- [Ofte stilte spørsmål](${SITE.url}/faq/)`,
    `- [Kontakt](${SITE.url}/kontakt/)`,
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
