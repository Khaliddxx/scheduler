'use client';

import { useEffect, useState } from 'react';

/**
 * The hero's mascot: a still that is replaced by a looping clip once the page
 * is idle.
 *
 * Timing follows the reference: the clip is chosen when the browser reports
 * idle (requestIdleCallback, 2s timeout; a plain 2s timer where that API is
 * missing), the phone cut is used at 640px and below, and when the clip starts
 * playing it fades in over 300ms while the still fades out. With reduced
 * motion the clip is never loaded and the still stays.
 *
 * A soft black copy of the still sits 30px lower as its shadow.
 */
export function HeroMascot({
  poster,
  clip,
  mobileClip,
  width,
  height,
  className,
}: {
  poster: string;
  clip?: string | null;
  mobileClip?: string | null;
  width: number;
  height: number;
  className?: string;
}) {
  const [src, setSrc] = useState<string>();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!clip) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const pick = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      setSrc(window.innerWidth <= 640 && mobileClip ? mobileClip : clip);
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(pick, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(pick, 2000);
    return () => window.clearTimeout(t);
  }, [clip, mobileClip]);

  return (
    <div
      className={`absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 ${className ?? 'w-[240px] sm:w-[340px] lg:w-[420px]'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        width={width}
        height={height}
        loading="eager"
        className="absolute inset-0 h-auto w-full translate-y-[30px] opacity-[0.45] blur-[25px] brightness-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        width={width}
        height={height}
        fetchPriority="high"
        className={`relative h-auto w-full transition-opacity duration-300 ${playing ? 'opacity-0' : 'opacity-100'}`}
      />
      {src ? (
        <video
          src={src}
          width={width}
          height={height}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
    </div>
  );
}
