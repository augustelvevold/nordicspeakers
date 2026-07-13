/** Clamp a longer answer-block/bio to a meta-description-safe length (≤155),
 *  cutting on a word boundary and adding an ellipsis (docs/seo.md). */
export function truncate(text: string, max = 155): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
