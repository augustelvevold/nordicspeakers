import { createClient } from '@sanity/client';
import { deepTrim } from './normalize';

// Read-only client for build-time content fetching (static output). PUBLIC_ vars
// come from .env (see .env.example); the projectId is not secret.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION ?? '2024-01-01';
// Optional read token — only needed when the dataset is PRIVATE. Leave unset for
// a public dataset (tokenless CDN reads). Never commit it: it lives in .env and,
// for deploys, in the host's environment variables.
const token = import.meta.env.SANITY_API_TOKEN || undefined;

if (!projectId) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env and fill it in.',
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: !token, // CDN for public/tokenless reads; live API when a token is set
  // Published content only — never build drafts. A token (needed for a private
  // dataset) otherwise makes drafts.** visible, which leaks unpublished docs into
  // production, collides draft+published on the same slug, and — because drafts
  // routinely reference not-yet-published docs — resolves those refs to null and
  // crashes the static build. This mirrors the Sanity rebuild webhook's own
  // `!(_id in path("drafts.**"))` filter (docs/deploy.md), so the build reads
  // exactly what triggers it.
  perspective: 'published',
});

// Trim every string in every query result at the boundary (see normalize.ts).
// With a non-technical editor, stray whitespace is a certainty, and a single
// trailing space silently breaks a mailto:/tel:/URL built from the value.
// Wrapping fetch here covers all current and future queries — no query or page
// ever has to remember to trim, and there's no way to bypass it.
const rawFetch = client.fetch.bind(client) as (...args: unknown[]) => Promise<unknown>;
client.fetch = ((...args: unknown[]) =>
  rawFetch(...args).then(deepTrim)) as typeof client.fetch;

export const sanityClient = client;
