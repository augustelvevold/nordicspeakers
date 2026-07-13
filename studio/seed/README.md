# Seed content

`seed.ndjson` — the two initial speakers and four topics, ready to import into a
fresh dataset. References resolve within the file (speakers → topics), so a plain
`sanity dataset import` works with no extra steps.

## What's inside

- **Topics** (4): Ledelse, Entreprenørskap, Salg, Motivasjon — with real
  Norwegian intro copy.
- **Speakers** (2): Stig Bareksten, Arman Vestad — with `externalUrl`, `sameAs`,
  `featured: true`, and topic references.

## Provisional copy

All seed copy is a starting point the client will replace in Studio:

- Speaker `shortBio` fields contain a literal `TODO(content)` marker (they're the
  meta-description/answer source, and inventing a real person's bio would be
  fabrication — the client writes these).
- Topic intros are usable but should be reviewed for tone.
- No images: `image`/`mainImage` are left empty so no fake assets ship. Editors
  add them (alt text is required by the schema).

## Import (after the project exists — see ../../README-studio-setup below)

```bash
# from studio/, with SANITY_STUDIO_PROJECT_ID set and logged in:
npx sanity dataset import seed/seed.ndjson production
```

Re-running is safe: import replaces documents with matching `_id`. To wipe and
redo, delete the docs first (`npx sanity documents delete <id>`) or use a fresh
dataset.
