import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/section';
import { Faq } from '@/components/sections/faq';
import { CtaBandSlim } from '@/components/sections/cta-band';
import { PAGE, TABLE } from '@/components/pricing/copy';
import { PlanPicker } from '@/components/pricing/plan-picker';
import { ComparisonTable } from '@/components/pricing/comparison-table';
import { Reassurance } from '@/components/pricing/reassurance';
import { pricingFaqs } from '@/content/faq';

/**
 * /pricing
 *
 * A Server Component. The only client code on the route is `PlanPicker`, which owns
 * the billing toggle and the four plan cards because their prices change with it;
 * the heading, the comparison table, the reassurance strip and the FAQ all render
 * on the server.
 *
 * Plan CTAs point at the application's own sign-up, never at a checkout URL — see
 * the note in components/pricing/copy.ts.
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
  return (
    <>
      {/* `tight` keeps the header close under the sticky nav; the lg step restores the
          site's usual rhythm on a large screen without fighting Section's own py. */}
      <Section tight className="lg:py-20">
        <div className="shell">
          <div className="flex flex-col items-center text-center">
            <span className="eyebrow">{PAGE.eyebrow}</span>
            <h1 className="mx-auto mt-6 max-w-[22ch] font-display text-[38px] font-extrabold leading-[1.07] tracking-[-0.02em] text-white sm:text-display-md lg:text-display-lg">
              {PAGE.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[58ch] text-body-md text-muted">{PAGE.body}</p>
          </div>

          <div className="mt-11 sm:mt-14">
            <PlanPicker />
          </div>
        </div>
      </Section>

      <Section id="compare">
        <div className="shell">
          <SectionHeading eyebrow={TABLE.eyebrow} title={TABLE.title} />

          <div className="mt-12 sm:mt-14">
            <ComparisonTable />
          </div>

          <div className="mt-5">
            <Reassurance />
          </div>
        </div>
      </Section>

      <Faq items={pricingFaqs} />

      <CtaBandSlim />
    </>
  );
}
