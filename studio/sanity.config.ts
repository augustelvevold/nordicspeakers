import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

// projectId is not secret, but it doesn't exist until the client creates the
// Sanity project — supply it via SANITY_STUDIO_PROJECT_ID (studio/.env).
// See studio/seed/README.md for the one-time setup + import steps.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'REPLACE_ME';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'default',
  title: 'Nordic Speakers',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Keep the singleton unique: hide siteSettings from the global "create" menu
    // so a non-technical editor can't spawn a second copy.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => t.templateId !== 'siteSettings')
        : prev,
  },
});
