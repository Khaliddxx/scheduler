'use client';

import { useRef, useState, type ReactNode } from 'react';

/**
 * The reference's red play badge: 68x48, 12px radius, lighter red on hover.
 * Shared by the live player below and the empty frame in ./in-action.tsx.
 */
export function InActionPlayBadge() {
  return (
    <span
      aria-hidden
      className="relative flex h-[48px] w-[68px] items-center justify-center rounded-[12px] bg-[#ff0033] transition-all group-hover:bg-[#ff1a49]"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5v14l11-7L8 5z" fill="#fff" />
      </svg>
    </span>
  );
}

/**
 * Wraps the demo clip (a server-rendered VideoFrame, passed as children) with
 * the play button. Until it is pressed the clip loops silently behind the
 * badge; pressing it restarts the clip with sound and the browser's controls,
 * the way the reference swaps its thumbnail for the player.
 */
export function InActionPlayer({ label, children }: { label: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = box.current?.querySelector('video');
    if (!video) return;
    video.removeAttribute('aria-hidden');
    video.loop = false;
    video.muted = false;
    video.controls = true;
    video.currentTime = 0;
    void video.play().catch(() => {
      // Autoplay with sound refused: leave the controls up so the visitor can start it.
    });
    video.focus();
    setPlaying(true);
  };

  return (
    <div ref={box} className="absolute inset-0">
      {children}
      {playing ? null : (
        <button
          type="button"
          aria-label={`Play video: ${label}`}
          onClick={play}
          className="group absolute inset-0 z-[2] flex h-full w-full cursor-pointer items-center justify-center"
        >
          <InActionPlayBadge />
        </button>
      )}
    </div>
  );
}
