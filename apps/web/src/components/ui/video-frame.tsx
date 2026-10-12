import fs from 'node:fs';
import path from 'node:path';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A framed media slot that falls back cleanly when the file is absent.
 *
 * HOW THIS WORKS
 * --------------
 * This is a Server Component, so it can look at the filesystem at build time.
 * If `public/preview/<name>.webm` exists, it renders a real looping video. If
 * it does not, it renders whatever `fallback` you passed — no broken player,
 * no 404 in the console, no layout shift.
 *
 * WHY IT IS BUILT THIS WAY
 * ------------------------
 * `public/preview/` is gitignored. That makes it a scratch area for reference
 * footage while you are deciding what each section should look like: drop
 * files in, run the site, judge it in real layout — and nothing you drop there
 * can be committed or deployed by accident.
 *
 * When you have your own recordings, move them out of `preview/` into
 * `public/media/` and point `src` at that instead. That directory IS tracked,
 * because by then the footage is yours.
 */

const PREVIEW_DIR = path.join(process.cwd(), 'public', 'preview');

const hasPreview = (name: string): string | null => {
  for (const ext of ['webm', 'mp4']) {
    const file = `${name}.${ext}`;
    try {
      if (fs.existsSync(path.join(PREVIEW_DIR, file))) return `/preview/${file}`;
    } catch {
      /* no filesystem access at runtime; fall through to the fallback */
    }
  }
  return null;
};

export function VideoFrame({
  name,
  fallback,
  className,
  /** Matches the source footage so the card does not jump when it loads. */
  ratio = '16 / 10',
  label,
}: {
  name: string;
  fallback?: ReactNode;
  className?: string;
  ratio?: string;
  label?: string;
}) {
  const src = hasPreview(name);

  if (!src) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-[14px] bg-white/[0.03] shadow-hairline',
          className,
        )}
        style={{ aspectRatio: ratio }}
      >
        <span className="px-6 text-center text-body-xs leading-relaxed text-dim">
          {label ?? 'Media slot'}
          <br />
          <span className="text-white/25">
            drop {name}.webm into public/preview/
          </span>
        </span>
      </div>
    );
  }

  return (
    <video
      className={cn('w-full rounded-[14px] shadow-hairline', className)}
      style={{ aspectRatio: ratio }}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      // Decorative: the surrounding copy carries the meaning.
      aria-hidden
      preload="metadata"
    />
  );
}

/** True when any preview footage is present. Used to show the build banner. */
export const previewMediaPresent = (): boolean => {
  try {
    return fs.existsSync(PREVIEW_DIR) && fs.readdirSync(PREVIEW_DIR).some((f) => /\.(webm|mp4)$/.test(f));
  } catch {
    return false;
  }
};
