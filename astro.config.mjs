// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site-wide build config. `site` is required so canonical/OG URLs and the
// sitemap resolve to absolute https URLs. Trailing slashes + static output
// match the URL scheme in docs/site-structure.md and the stack in CLAUDE.md.
export default defineConfig({
  site: 'https://nordicspeakers.no',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Keep noindex utility routes and the llms.txt endpoint out of the sitemap.
      filter: (page) => !page.includes('/takk/') && !page.includes('/llms.txt'),
    }),
  ],
});
