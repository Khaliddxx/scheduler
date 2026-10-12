import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { previewClip, previewPoster } from '@/lib/preview-media';

export { previewMediaPresent } from '@/lib/preview-media';

/**
 * A framed media slot that falls back cleanly when the file is absent.
 *
 * This is a Server Component, so it can look at the filesystem at build time.
 * If `public/preview/<name>.webm` exists, it renders a real looping video, with
 * `<name>.webp|jpg` as its poster when one is there. If it does not, it renders
 * whatever `fallback` you passed — no broken player, no 404 in the console, no
 * layout shift.
 *
 * What is in `public/preview/` right now, and the rules around it, are in that
 * folder's README. In short: reference footage, to be replaced with your own
 * recordings under the same filenames; the build guard in lib/guards.ts refuses
 * a launch build while any of it remains.
 */
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
  const src = previewClip(name);

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
      poster={previewPoster(name) ?? undefined}
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
