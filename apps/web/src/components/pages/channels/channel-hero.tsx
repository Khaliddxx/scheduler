import type { ReactNode } from 'react';
import { previewImage } from '@/lib/preview-media';
import { CtaPill } from '@/components/pages/channels/cta-pill';
import { HeroCollageLeft, HeroCollageRight } from '@/components/pages/channels/hero-collage';

/**
 * The centred hero of the channel pages, on the reference design's
 * measurements: an icon + uppercase label with a hand-drawn pink underline,
 * a very large headline (40/44 → 70/77 from 640px, 920px wide at most), the
 * sub-copy (18 → 22px, 770px wide), one call to action, 32px apart, the whole
 * block at least 800px tall from the top of the page.
 *
 * The reference sits under a fixed header with 160px of top padding. Our
 * header leaves a 60 / 81px spacer in the flow (layout/header-bar.tsx), so the
 * padding and minimum height here are the reference's less that spacer; the
 * collages hang 297.6px below the top of the page either side, from 1360px.
 */
export function ChannelHero({
  icon,
  label,
  title,
  sub,
  badges,
}: {
  /** The channel's app icon (or a cluster of them on the directory). */
  icon?: ReactNode;
  label: string;
  title: ReactNode;
  sub: ReactNode;
  badges: [string | null, string | null];
}) {
  const doodle = previewImage('channels/hero-doodle.svg');

  return (
    <section className="relative flex min-h-[740px] w-full flex-col items-center gap-8 pt-[100px] sm:min-h-[719px] sm:pt-[79px]">
      <div className="relative flex items-center gap-2.5">
        {icon}
        <p className="font-jakarta text-base font-semibold uppercase leading-[17.6px] sm:text-2xl sm:leading-[26.4px]">
          {label}
        </p>
        {doodle ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doodle}
            alt=""
            aria-hidden
            width={156}
            height={15}
            loading="eager"
            className="pointer-events-none absolute left-[15.43px] top-[42.52px] max-w-none select-none"
          />
        ) : null}
      </div>

      <h1 className="h1-pz max-w-[920px] text-white">{title}</h1>

      <div className="max-w-[770px] text-center text-[18px] font-normal leading-[23.44px] text-[#d1d1d1] max-2xl:px-[10px] sm:text-[22px] sm:leading-[28.64px]">
        {sub}
      </div>

      <div>
        <CtaPill />
      </div>

      <HeroCollageLeft className="pointer-events-none absolute left-0 top-[216.57px] max-2xl:hidden" />
      <HeroCollageRight
        badges={badges}
        className="pointer-events-none absolute right-0 top-[216.64px] max-2xl:hidden"
      />
    </section>
  );
}

/** The 24 / 32px app icon beside the hero label. Decorative: the label names it. */
export function HeroIcon({ src }: { src: string | null }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={70} height={70} className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" />
  );
}
