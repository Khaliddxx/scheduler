'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The looping clip laid over a capability panel's still.
 *
 * Behaves like the reference: nothing is fetched until the panel scrolls into
 * view (IntersectionObserver, threshold 0), then a muted looping video is
 * mounted over the poster, which stays underneath as the frame until the first
 * frame decodes. The phone cut is used at 640px wide and below, the desktop cut
 * above, re-picked on resize.
 *
 * Under `prefers-reduced-motion` the video is never mounted, so the still is
 * all that shows.
 */
export function CapabilitiesClip({
  desktop,
  mobile,
}: {
  desktop: string | null;
  mobile: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const pick = () =>
      setSrc(window.innerWidth > 640 ? (desktop ?? mobile) : (mobile ?? desktop));
    pick();
    window.addEventListener('resize', pick);
    return () => window.removeEventListener('resize', pick);
  }, [inView, desktop, mobile]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute left-0 top-0 z-[1] h-full w-full overflow-hidden rounded-[16px]"
    >
      {src ? (
        <video
          key={src}
          className="block h-auto w-full max-w-full"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : null}
    </div>
  );
}
