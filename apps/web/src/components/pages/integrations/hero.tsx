import type { ReactNode } from 'react';
import { getChannel } from '@/content/channels';
import { SocialIcon } from '@/components/ui/social-icon';
import { cn } from '@/lib/cn';
import { accents, type Accent } from './accents';
import { HeroMascot } from './hero-mascot';

/**
 * The full-bleed gradient hero shared by every integration page, the
 * integrations index and /developers.
 *
 * Copy column on the left (badge, h1, a lead paragraph and/or square-bulleted
 * points, two pills, a small footnote); on the right a 300/420/540px stage with
 * either the mascot (still, then clip) or a `visual`, ringed by floating app
 * tiles that bob on the shared `muse-float` keyframes. Below 1024px the stage
 * drops under the copy and only six of the ten tiles stay.
 *
 * The band starts under the fixed header (the negative margin cancels the
 * header's spacer), so its top padding is the reference's 110/160px.
 */

interface Tile {
  slug: string;
  left: number;
  top: number;
  tilt: number;
  delay: number;
  dur: number;
  mobile?: boolean;
}

/** Positions, tilts and float timings of the reference's ten hero tiles. */
const defaultTiles: Tile[] = [
  { slug: 'telegram', left: 4, top: 6, tilt: -8, delay: 0, dur: 6.5, mobile: true },
  { slug: 'bluesky', left: 34, top: 0, tilt: 6, delay: 1.2, dur: 7 },
  { slug: 'facebook', left: 62, top: 2, tilt: 6, delay: 0.2, dur: 7.3 },
  { slug: 'linkedin', left: 84, top: 10, tilt: 8, delay: 2.1, dur: 6.8, mobile: true },
  { slug: 'x', left: 16, top: 32, tilt: -4, delay: 0.6, dur: 6, mobile: true },
  { slug: 'tiktok', left: 88, top: 38, tilt: -6, delay: 0.3, dur: 7.4 },
  { slug: 'youtube', left: 2, top: 60, tilt: 5, delay: 1.7, dur: 6.2, mobile: true },
  { slug: 'threads', left: 90, top: 66, tilt: -7, delay: 0.9, dur: 7.1 },
  { slug: 'pinterest', left: 12, top: 86, tilt: 7, delay: 2.5, dur: 6.6, mobile: true },
  { slug: 'instagram', left: 78, top: 88, tilt: -5, delay: 1.4, dur: 6.9, mobile: true },
];

export interface HeroMedia {
  poster: string;
  clip?: string | null;
  mobileClip?: string | null;
  width: number;
  height: number;
  /** Width classes for the mascot at each breakpoint. */
  className?: string;
}

export function PageHero({
  accent,
  badge,
  title,
  lead,
  bullets = [],
  actions,
  footnote,
  media,
  visual,
  tiles,
}: {
  accent: Accent;
  badge: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  bullets?: ReactNode[];
  actions: ReactNode;
  footnote?: ReactNode;
  media?: HeroMedia | null;
  visual?: ReactNode;
  /** Replaces the floating channel tiles (e.g. with agent logos on the index). */
  tiles?: Array<{ node: ReactNode; key: string; left: number; top: number; tilt: number; delay: number; dur: number; mobile?: boolean }>;
}) {
  const floating =
    tiles ??
    defaultTiles.map((t) => ({
      ...t,
      key: t.slug,
      node: <AppTile slug={t.slug} />,
    }));

  return (
    <div
      className="relative -mt-[60px] w-full overflow-hidden sm:-mt-[81px]"
      style={{ background: accents[accent].hero }}
    >
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-center gap-12 px-5 pb-[50px] pt-[110px] sm:pb-[80px] sm:pt-[160px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3">{badge}</div>
          <div className="min-h-[24px] sm:min-h-[28px]" />
          <h1 className="text-left font-jakarta text-[42px] font-extrabold leading-[46px] text-white sm:text-[64px] sm:leading-[68px]">
            {title}
          </h1>
          {lead ? (
            <>
              <div className="min-h-[24px] sm:min-h-[28px]" />
              <p className="max-w-[620px] text-[17px] leading-[26px] text-white text-opacity-90 sm:text-[19px] sm:leading-[29px]">
                {lead}
              </p>
            </>
          ) : null}
          {bullets.length > 0 ? (
            <>
              <div className="min-h-[24px] sm:min-h-[28px]" />
              <ul className="space-y-3 text-[17px] leading-[24px] text-white text-opacity-90 sm:text-[19px] sm:leading-[27px]">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-[2px] bg-pink" />
                    {b}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="min-h-[32px] sm:min-h-[40px]" />
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row max-sm:[&>*]:!w-full">{actions}</div>
          {footnote ? (
            <>
              <div className="min-h-[20px] sm:min-h-[28px]" />
              <div className="text-[13px] leading-[18px] text-white text-opacity-70">{footnote}</div>
            </>
          ) : null}
        </div>

        <div className="relative h-[300px] w-full sm:h-[420px] lg:h-[540px]" aria-hidden="true">
          {visual ? (
            <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">{visual}</div>
          ) : media ? (
            <HeroMascot {...media} />
          ) : null}
          {floating.map((t) => (
            <span
              key={t.key}
              className={cn('muse-tile absolute', t.mobile ? 'block' : 'hidden sm:block')}
              style={
                {
                  left: `${t.left}%`,
                  top: `${t.top}%`,
                  '--tilt': `${t.tilt}deg`,
                  '--delay': `${t.delay}s`,
                  '--dur': `${t.dur}s`,
                } as React.CSSProperties
              }
            >
              {t.node}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * White rounded tile holding a channel's app icon. Defaults to the hero size:
 * 64px (72px from 640px) around a 44px icon.
 */
export function AppTile({
  slug,
  box = 'h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-[22%]',
  icon = 'h-[44px] w-[44px]',
}: {
  slug: string;
  box?: string;
  icon?: string;
}) {
  const channel = getChannel(slug);
  if (!channel) return null;
  return (
    <span className={cn('flex items-center justify-center bg-white shadow-[0_14px_30px_rgba(10,0,40,0.35)]', box)}>
      <SocialIcon channel={channel} className={cn('rounded-[20%]', icon)} />
    </span>
  );
}
