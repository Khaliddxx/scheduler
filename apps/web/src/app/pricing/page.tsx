import type { Metadata } from 'next';
import { Faq } from '@/components/sections/faq';
import { PAGE, TABLE } from '@/components/pricing/copy';
import { PlanPicker } from '@/components/pricing/plan-picker';
import { ComparisonTable } from '@/components/pricing/comparison-table';
import { Reassurance } from '@/components/pricing/reassurance';
import { PricingHero } from '@/components/pages/pricing/pricing-hero';
import { StickyCta } from '@/components/pages/pricing/sticky-cta';
import { previewImage } from '@/lib/preview-media';
import { pricingFaqs } from '@/content/faq';

/**
 * /pricing, in the reference design's order: hero, billing switch and plan
 * cards, the feature comparison, the FAQ, then (below 1024px) a call to action
 * pinned to the bottom of the screen. The site footer carries the closing CTA.
 *
 * A Server Component. The client islands are the plan cards and the comparison,
 * because both re-price with their billing switch (and the comparison also
 * switches plans on a phone). The hero, the FAQ and the sticky CTA render on
 * the server.
 *
 * Plan CTAs point at the application's own sign-up, never at a checkout URL — see
 * the note in components/pricing/copy.ts.
 *
 * The wrapper is the positioning context for the hero's edge doodles.
 */

export const metadata: Metadata = {
  // The root layout's template renders this as "Pricing — <brand>".
  title: PAGE.eyebrow,
  description: PAGE.description,
  openGraph: {
    title: PAGE.title,
    description: PAGE.description,
  },
};

export default function PricingPage() {
  const tomado = previewImage('pricing/tomado.png');

  return (
    <div className="relative">
      <PricingHero />

      <section className="section-pz pt-[30px] min-[1024px]:pt-[10px]">
        <PlanPicker popularDecoration={previewImage('pricing/popular-decoration.svg')} />
        <Reassurance />
      </section>

      <section id="compare" className="section-pz">
        {/* The reference's heading wraps to two lines inside 696px, leaving room
            for the swirl beside its first line. Ours fits on one line and the box
            shrinks to it, so the right padding keeps the swirl off the last letter. */}
        <h2 className="h2-pz relative max-w-[696px] px-5 sm:pr-[52px] min-[1024px]:pr-[45px]">
          {TABLE.title}
          {tomado ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tomado}
              alt=""
              aria-hidden
              width={45}
              height={67}
              loading="lazy"
              className="absolute right-[6px] top-[-47px] min-[1024px]:right-[-10px] min-[1024px]:top-[-20px]"
            />
          ) : null}
        </h2>
        <p className="mt-4 text-center text-[18px] leading-[23.44px] min-[1024px]:hidden">
          {TABLE.intro}
        </p>
        <ComparisonTable />
      </section>

      <Faq items={pricingFaqs} />

      <StickyCta />
    </div>
  );
}
