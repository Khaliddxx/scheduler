import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time lookups for `public/preview/`, the slot for reference footage.
 *
 * Everything here runs on the server during static generation, so a page can
 * decide whether to render a real `<video>` or a quiet empty frame without the
 * browser ever requesting a file that does not exist. See public/preview/README.md
 * for what the folder holds today and the rules around it.
 */

export const PREVIEW_DIR = path.join(process.cwd(), 'public', 'preview');

const exists = (file: string): boolean => {
  try {
    return fs.existsSync(path.join(PREVIEW_DIR, file));
  } catch {
    return false;
  }
};

/** `/preview/<name>.webm` (or .mp4) when the clip is present, else null. */
export const previewClip = (name: string): string | null => {
  for (const ext of ['webm', 'mp4']) {
    if (exists(`${name}.${ext}`)) return `/preview/${name}.${ext}`;
  }
  return null;
};

/** A still captured alongside the clip, used as the video's poster. */
export const previewPoster = (name: string): string | null => {
  for (const ext of ['webp', 'jpg', 'png']) {
    if (exists(`${name}.${ext}`)) return `/preview/${name}.${ext}`;
  }
  return null;
};

/** Any other file in the slot, by path relative to `public/preview/`. */
export const previewImage = (rel: string): string | null =>
  exists(rel) ? `/preview/${rel}` : null;

/** True when any clip is present. Drives the build guard in lib/guards.ts. */
export const previewMediaPresent = (): boolean => {
  try {
    return (
      fs.existsSync(PREVIEW_DIR) &&
      fs.readdirSync(PREVIEW_DIR).some((f) => /\.(webm|mp4)$/.test(f))
    );
  } catch {
    return false;
  }
};
