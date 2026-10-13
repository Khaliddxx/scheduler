'use client';

import { useEffect, useRef, useState } from 'react';
import { useMode, type Mode } from '@/lib/mode';

export interface ShowcaseClip {
  src: string;
  poster?: string;
  /** Portrait cut for screens 640px wide and narrower. */
  mobileSrc?: string;
  mobilePoster?: string;
}

const PHONE = '(max-width: 640px)';

/**
 * The showcase panel's media, swapped by the agentic / classic switch.
 *
 * Behaves like the reference's hero video:
 * - the poster is always in the flow and sizes the panel (1920x1018 from 641px,
 *   the portrait 1062x1080 cut on phones), so the frame never jumps;
 * - each mode has a landscape clip and a portrait phone cut, picked by a
 *   640px media query and re-picked on resize;
 * - the video is not mounted until the browser is idle (requestIdleCallback,
 *   2s timeout), starts muted and looping, and only plays once at least half
 *   of it is on screen;
 * - flipping the mode swaps poster and video outright (no cross-fade): the new
 *   poster shows at once and the new clip mounts over it.
 */
export function ModeShowcase({ clips }: { clips: Partial<Record<Mode, ShowcaseClip>> }) {
  const mode = useMode();
  const idle = useIdle();
  const phone = usePhone();
  const clip = clips[mode];
  const src = clip ? (phone && clip.mobileSrc ? clip.mobileSrc : clip.src) : undefined;
  const poster = clip ? (phone && clip.mobilePoster ? clip.mobilePoster : clip.poster) : undefined;

  return (
    <div className="relative aspect-[1062/1080] w-full min-[641px]:aspect-[1920/1018]">
      {clip?.poster ? (
        <picture>
          {clip.mobilePoster ? <source media={PHONE} srcSet={clip.mobilePoster} /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clip.poster}
            alt=""
            aria-hidden
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 block h-full w-full object-cover object-top"
          />
        </picture>
      ) : null}
      {idle && src ? (
        <InViewVideo
          key={src}
          src={src}
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : null}
    </div>
  );
}

/** True while the viewport is 640px wide or narrower. */
function usePhone(): boolean {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return phone;
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
