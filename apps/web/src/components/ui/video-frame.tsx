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
 * recordings under the same filenames; lib/guards.ts warns at build time while
 * any of it remains.
 *
 * `fit="cover"` fills whatever box the parent gives it instead of sizing itself
 * from `ratio`: the poster sits underneath as an image and the video covers it,
 * both object-cover, the way the reference design frames its clips.
 */
export function VideoFrame({
  name,
  fallback,
  className,
  /** Matches the source footage so the card does not jump when it loads. */
  ratio = '16 / 10',
  label,
  fit = 'ratio',
}: {
  name: string;
  fallback?: ReactNode;
  className?: string;
  ratio?: string;
  label?: string;
  /** `ratio` sizes the frame from `ratio`; `cover` fills the parent box. */
  fit?: 'ratio' | 'cover';
}) {
  const src = previewClip(name);
  const poster = previewPoster(name);

  if (fit === 'cover') {
    return (
      <div className={cn('absolute inset-0', className)}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {src ? (
          <video
            className="absolute inset-0 z-[1] h-full w-full object-cover"
            src={src}
            poster={poster ?? undefined}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            preload="metadata"
          />
        ) : poster ? null : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="px-6 text-center text-body-xs leading-relaxed text-white/40">
              {label ?? 'Media slot'}
              <br />
              <span className="text-white/25">drop {name}.webm into public/preview/</span>
            </span>
          </div>
        )}
      </div>
    );
  }

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
      poster={poster ?? undefined}
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
