import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './sanity';

// A Sanity image field as projected by the queries: the asset reference + the
// required alt text (docs/content-model.md).
export interface SanityImageValue {
  alt?: string;
  asset?: { _ref?: string };
}

const builder = createImageUrlBuilder(sanityClient);

/** Build a Sanity CDN image URL (chain .width().auto('format') etc.). */
export function urlFor(source: SanityImageValue) {
  return builder.image(source as Parameters<typeof builder.image>[0]);
}

/** Intrinsic dimensions parsed from the asset _ref (image-<id>-<w>x<h>-<ext>),
 *  so <img> can carry width/height and avoid layout shift without an extra query. */
export function refDimensions(ref?: string): { width: number; height: number } | null {
  if (!ref) return null;
  const m = ref.match(/-(\d+)x(\d+)-/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}
