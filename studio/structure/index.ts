import type { StructureResolver } from 'sanity/structure';

// Custom desk: siteSettings pinned as an editable singleton at the top, then the
// content types the client works with. Keeps the editing surface tidy and makes
// the singleton feel like "settings" rather than a list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Innhold')
    .items([
      S.listItem()
        .title('Innstillinger')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.divider(),
      S.documentTypeListItem('speaker').title('Foredragsholdere'),
      S.documentTypeListItem('topic').title('Temaer'),
      S.documentTypeListItem('event').title('Arrangementer'),
      S.documentTypeListItem('article').title('Artikler'),
      S.documentTypeListItem('caseStudy').title('Kundesuksesser'),
      S.documentTypeListItem('testimonial').title('Referanser'),
      S.documentTypeListItem('teamAuthor').title('Forfattere (team)'),
    ]);
