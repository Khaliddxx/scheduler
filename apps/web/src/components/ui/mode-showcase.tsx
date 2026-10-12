'use client';

import { cn } from '@/lib/cn';
import { useMode, type Mode } from '@/lib/mode';

export interface ShowcaseClip {
  src: string;
  poster?: string;
  /** CSS aspect-ratio, e.g. "1920 / 1018". */
  ratio: string;
  title: string;
  caption: string;
}

/**
 * The showcase's copy and footage, swapped by the hero's mode switch.
 *
 * Both clips stay mounted and cross-fade, so flipping the switch never shows a
 * black frame while a video buffers. The sources are resolved on the server
 * (lib/preview-media.ts) and passed in as plain strings; this component only
 * decides which one is in front.
 */
export function ModeShowcase({ clips }: { clips: Partial<Record<Mode, ShowcaseClip>> }) {
  const mode = useMode();
  const active = clips[mode] ?? clips.agentic ?? clips.classic;
  if (!active) return null;

  const entries = (Object.entries(clips) as [Mode, ShowcaseClip][]).filter(([, c]) => c);

  return (
    <>
      <h2
        id="showcase-heading"
        className="max-w-[20ch] font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-display-sm"
      >
        {active.title}
      </h2>

      <p className="mt-auto pt-10 text-body-lg text-white/70 sm:pt-16">{active.caption}</p>

      <div className="-mb-4 mt-4 w-full max-w-[820px] sm:-mb-5 sm:mt-5">
        <div
          className="relative overflow-hidden rounded-[14px] shadow-lift transition-[aspect-ratio] duration-500"
          style={{ aspectRatio: active.ratio }}
        >
          {entries.map(([, clip]) => (
            <video
              key={clip.src}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
                clip === active ? 'opacity-100' : 'opacity-0',
              )}
              src={clip.src}
              poster={clip.poster}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
              preload="metadata"
            />
          ))}
        </div>
      </div>
    </>
  );
}
