// Read-time content normalization for everything fetched from Sanity.
//
// A non-technical editor will inevitably leave stray whitespace — a trailing
// space on an email, a padded phone number, an accidental double space before a
// URL. Rather than trim field-by-field at every call site (a losing game), this
// runs once at the client boundary (see sanity.ts) so every field — current and
// future — is clean before it reaches a mailto:/tel:/URL href, JSON-LD, or the
// page.
//
// Scope is deliberately narrow: only leading/trailing whitespace is trimmed.
// Internal whitespace is left intact — collapsing it would wreck multi-line
// fields (e.g. a `text` address) and portable text. And portable-text span
// `text` is preserved verbatim: a leading/trailing space in a span is meaningful
// — it separates adjacent, differently-marked words ("hello " + bold "world") —
// so trimming it would glue them together. Link hrefs inside portable text
// (markDefs) are NOT spans and are trimmed, which is what we want.

/** Recursively trim leading/trailing whitespace on every string in a value,
 *  preserving portable-text span text. Returns a new value; input is untouched. */
export function deepTrim<T>(value: T): T {
  return trim(value) as T;
}

function trim(value: unknown): unknown {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(trim);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const isSpan = obj._type === 'span'; // portable-text text span
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(obj)) {
      out[key] = isSpan && key === 'text' ? v : trim(v);
    }
    return out;
  }
  return value; // numbers, booleans, null, undefined
}
