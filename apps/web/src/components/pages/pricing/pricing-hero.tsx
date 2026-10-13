import { brand } from '@scheduler/brand';
import { PAGE } from '@/components/pricing/copy';
import { previewImage } from '@/lib/preview-media';

/**
 * The /pricing hero, as the reference draws it: a 700px column with the h1 (the
 * word "Pricing" ringed by a hand-drawn blue loop) over the 18/22px intro, 32px
 * apart (40px from 640px), and hand-drawn doodles pinned to the page edges: a
 * clover top-left and a star lower-right from 1024px; smaller versions of both
 * below 640px; none in between.
 *
 * Spacing: the reference's header is fixed and its hero starts 120.36px (200px
 * from 640px) below the top of the page. Ours sits under the shared header's
 * 60px (81px from 640px) spacer, so the top padding here is the difference.
 *
 * The doodles are absolutely positioned against the page wrapper in
 * app/pricing/page.tsx (the reference positions them against the page body),
 * with the same spacer subtracted from their offsets.
 */

/** The reference's ring around one word. Stretches to the word's box. */
function Ring() {
  return (
    <svg
      viewBox="0 0 238 93"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute -bottom-[10%] -left-[6%] -right-[6%] -top-[6%] h-[116%] w-[112%]"
    >
      <path
        d="M197.538 7.08212C153.457 -0.372399 54.8039 -4.3792 12.8448 39.2297C-39.6041 93.7409 117.521 95.1839 177.334 86.7522C213.123 81.7073 236.5 69.3637 236.5 51.5051C236.5 36.1302 195.906 13.0224 122.436 17.3903"
        stroke="#5383FF"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const DOODLES = [
  // file, width, height, classes
  ['pricing/clover.svg', 88, 170, 'left-0 top-[49.64px] hidden lg:block'],
  ['pricing/star.svg', 97, 138, 'right-0 top-[260.58px] hidden lg:block'],
  ['pricing/clover-mob.svg', 41, 83, 'left-0 top-[294.93px] block sm:hidden'],
  ['pricing/star-mob.svg', 45, 67, 'right-0 top-[-2.16px] block sm:hidden'],
] as const;

export function PricingHero() {
  return (
    <section className="section-pz pt-[60.36px] sm:pt-[119px]">
      <div className="max-w-[700px] space-y-8 sm:space-y-10">
        <h1 className="h1-pz">
          {brand.name}{' '}
          <span className="relative inline-block">
            {PAGE.ringed}
            <Ring />
          </span>
          : {PAGE.headline}
        </h1>
        <p className="text-center text-[18px] font-normal leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]">
          {PAGE.body}
        </p>
      </div>

      {DOODLES.map(([file, width, height, position]) => {
        const src = previewImage(file);
        return src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={file}
            src={src}
            alt=""
            aria-hidden
            width={width}
            height={height}
            loading="lazy"
            className={`pointer-events-none absolute ${position}`}
          />
        ) : null;
      })}
    </section>
  );
}
