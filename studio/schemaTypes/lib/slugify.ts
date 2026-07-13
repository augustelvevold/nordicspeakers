// Norwegian-safe slugs — no æ/ø/å (docs/site-structure.md).
// Example from that doc: "entreprenørskap" -> "entreprenorskap".
const NORDIC: Record<string, string> = {
  æ: 'ae',
  ø: 'o',
  å: 'a',
  Æ: 'ae',
  Ø: 'o',
  Å: 'a',
};

// Combining diacritical marks (U+0300–U+036F), left over after NFKD splits a
// char like "é" into "e" + accent. Built from an escaped string so no literal
// combining glyphs live in this source file.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/** Slugify used by every `slug` field's options so URLs stay ASCII + lowercase. */
export function slugify(input: string): string {
  return input
    .split('')
    .map((ch) => NORDIC[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}
