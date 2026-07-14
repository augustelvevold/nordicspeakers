import { defineCliConfig } from 'sanity/cli';

// Used by the `sanity` CLI (dev/build/deploy/dataset import). Reads the same
// env as the studio config.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Hosted Studio at https://nordicspeakers.sanity.studio (non-interactive deploy).
  studioHost: 'nordicspeakers',
});
