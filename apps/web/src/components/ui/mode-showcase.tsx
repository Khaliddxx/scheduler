'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useMode, type Mode } from '@/lib/mode';

export interface ShowcaseClip {
  src: string;
  poster?: string;
}

/**
 * The showcase panel's media, swapped by the agentic / classic switch.
 *
 * Behaves like the reference's hero video:
 * - the poster is always in the flow and sizes the panel (1920x1018 from 641px,
 *   a taller 1062x1080 crop on phones), so the frame never jumps;
 * - the video is not mounted until the browser is idle (requestIdleCallback,
 *   2s timeout), starts muted and looping, and only plays once at least half
 *   of it is on screen;
 * - flipping the mode swaps poster and video outright (no cross-fade): the new
 *   poster shows at once and the new clip mounts over it.
 *
 * Agentic shows the agentic clip full-bleed; on phones the taller frame crops
 * it from the centre, which keeps each scene's title in view. Classic has no full-frame clip,
 * so it frames the calendar clip on a gradient ground in the same proportions.
 */
export function ModeShowcase({ clips }: { clips: Partial<Record<Mode, ShowcaseClip>> }) {
  const mode = useMode();
  const idle = useIdle();
  const clip = clips[mode];

  return (
    <div className="relative aspect-[1062/1080] w-full min-[641px]:aspect-[1920/1018]">
      {mode === 'classic' ? (
        <ClassicFrame clip={clip} idle={idle} />
      ) : clip ? (
        <>
          {clip.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clip.poster}
              alt=""
              aria-hidden
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 block h-full w-full object-cover object-top"
            />
          ) : null}
          {idle ? (
            <InViewVideo
              key={clip.src}
              src={clip.src}
              poster={clip.poster}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/** Gradient ground with an app window inset 7% from the sides, bleeding off the bottom. */
function ClassicFrame({ clip, idle }: { clip?: ShowcaseClip; idle: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: [
          'radial-gradient(55% 70% at 50% 0%, rgba(110, 150, 245, 0.95) 0%, rgba(110, 150, 245, 0) 70%)',
          'radial-gradient(45% 60% at 100% 100%, rgba(214, 48, 160, 0.9) 0%, rgba(214, 48, 160, 0) 70%)',
          'linear-gradient(100deg, #5a2ed6 0%, #6656e4 35%, #7d48e2 65%, #9a28c8 100%)',
        ].join(', '),
      }}
    >
      {/* Two quick strokes in the top-left corner. */}
      <svg
        viewBox="0 0 80 50"
        fill="none"
        aria-hidden
        className="absolute left-[5%] top-[9%] w-[4.2%]"
      >
        <g stroke="white" strokeWidth="5" strokeLinecap="round">
          <path d="M4 46C22 30 44 20 76 12" />
          <path d="M24 26C38 16 52 10 70 6" />
        </g>
      </svg>

      <div className="absolute inset-x-[7%] bottom-[-3%] top-[15.5%] rounded-t-[min(3.2vw,44px)] bg-[#a58cff]/55 p-[1.25%] pb-0 max-[640px]:inset-x-[6%] max-[640px]:top-[22%]">
        <div className="relative h-full w-full overflow-hidden rounded-t-[min(2.4vw,34px)] bg-[#141414]">
          {clip?.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clip.poster}
              alt=""
              aria-hidden
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-left-top"
            />
          ) : null}
          {clip && idle ? (
            <InViewVideo
              key={clip.src}
              src={clip.src}
              poster={clip.poster}
              className={cn('absolute inset-0 h-full w-full object-cover object-left-top')}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** True once the browser has been idle (or after 2s), like the reference's deferUntilIdle. */
function useIdle(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const done = () => setIdle(true);
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(done, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(done, 2000);
    return () => clearTimeout(t);
  }, []);
  return idle;
}

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/** Muted looping clip that starts the first time at least half of it is visible. */
function InViewVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const visibleNeeded =
          0.5 * Math.min(entry.boundingClientRect.height, entry.rootBounds?.height ?? window.innerHeight);
        if (entry.isIntersecting && entry.intersectionRect.height >= visibleNeeded) {
          observer.disconnect();
          video.play().catch(() => {});
        }
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );
}
