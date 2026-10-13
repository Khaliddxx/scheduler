'use client';

import { useState } from 'react';
import { registerUrl } from '@scheduler/brand';
import { cn } from '@/lib/cn';
import { BillingToggle } from '@/components/pricing/billing-toggle';
import { TickSquare } from '@/components/pricing/glyphs';
import { PillLink } from '@/components/pricing/pill-link';
import { CONTACT_HREF, PER_MONTH_SUFFIX, QUOTED_PRICE, RIBBON } from '@/components/pricing/copy';
import { isQuoted, money } from '@/components/pricing/price';
import { plans, priceFor, type BillingPeriod, type Plan } from '@/content/pricing';

/**
 * The billing switch and the plan cards, laid out as the reference's pricing
 * block: a 184px switch (full width below 1024px), then one column of cards that
 * becomes four equal columns at 1024px (min 237px each, 12px gap). The popular
 * plan's card is the purple gradient with a "Popular" pill and a flourish in its
 * top-right corner, and the only solid white call to action.
 *
 * Card rhythm, top to bottom: name, 20px, price with "/mo", 8px, who it is for,
 * a hairline with 24px (30px from 640px) above and below, the bullet list, 44px,
 * the call to action. Padding 30/20 on phones, 16 at 1024px, 30 at 1440px.
 *
 * Bullets are each plan's own `highlights` from src/content/pricing.ts. The full
 * per-feature matrix is the comparison further down.
 */

function PlanCard({
  plan,
  period,
  decoration,
}: {
  plan: Plan;
  period: BillingPeriod;
  decoration: string | null;
}) {
  const quoted = isQuoted(plan);
  const popular = plan.popular === true;

  return (
    <li
      className={cn(
        'relative flex w-full flex-1 flex-col rounded-[20px] border border-white/10 px-[20px] py-[30px] min-[1024px]:min-w-[237px] min-[1024px]:p-[16px] min-[1440px]:p-[30px]',
        popular ? 'bg-gradient-to-bl from-[#682EE1] to-[#2A0772]' : 'bg-[#1A1919]',
      )}
    >
      <h3 className="font-jakarta text-[20px] font-medium leading-[22px] min-[1024px]:text-[22px] min-[1024px]:leading-[24.2px] min-[1440px]:text-[24px] min-[1440px]:leading-[26.4px]">
        {plan.name}
      </h3>
      <div className="min-h-[20px]" />
      <p className="font-jakarta text-[40px] font-semibold leading-[44px] min-[1024px]:text-[50px] min-[1024px]:leading-[55px] min-[1440px]:text-[60px] min-[1440px]:leading-[66px]">
        {quoted ? QUOTED_PRICE : money(priceFor(plan, period), plan.currency)}
        {quoted ? null : (
          <span className="ml-2 font-jakarta text-[20px] leading-[22px] min-[1024px]:text-[20px] min-[1024px]:leading-[22px] min-[1440px]:text-[24px] min-[1440px]:leading-[26.4px]">
            {PER_MONTH_SUFFIX}
          </span>
        )}
      </p>
      <div className="min-h-[8px]" />
      <p className="text-[16px] leading-[20.83px] text-[#D1D1D1] min-[1024px]:text-[16px] min-[1024px]:leading-[20.83px] min-[1440px]:text-[18px] min-[1440px]:leading-[23.44px]">
        {plan.audience}
      </p>
      <div aria-hidden className="my-6 min-h-[1px] bg-white/10 sm:my-[30px]" />

      <ul className="flex-1 space-y-2.5 sm:space-y-3">
        {plan.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <TickSquare className="mb-auto mt-[0.5px]" />
            <p className="text-[14px] leading-[18.83px] min-[1024px]:text-[14px] min-[1024px]:leading-[18.83px] min-[1440px]:text-[16px] min-[1440px]:leading-[20.83px]">
              {highlight}
            </p>
          </li>
        ))}
      </ul>

      <div className="min-h-[44px]" />
      <div className="flex justify-center">
        <PillLink
          href={quoted ? CONTACT_HREF : registerUrl()}
          variant={popular ? 'primary' : 'secondary'}
        >
          {plan.cta}
          <span className="sr-only">, {plan.name} plan</span>
        </PillLink>
      </div>

      {popular ? (
        <div className="absolute right-4 top-4">
          <div className="w-fit rounded-full bg-white/20 px-4 py-2">
            <p className="text-[14px] leading-[18.23px]">{RIBBON}</p>
          </div>
          {decoration ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={decoration}
              alt=""
              aria-hidden
              width={48}
              height={47}
              className="absolute right-14 top-4"
            />
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function PlanPicker({
  popularDecoration = null,
}: {
  /** The flourish beside the popular badge, resolved on the server (public/preview/pricing). */
  popularDecoration?: string | null;
}) {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  return (
    <>
      <BillingToggle
        period={period}
        onChange={setPeriod}
        className="mb-10 w-full min-[1024px]:w-[184px]"
      />

      <ul className="grid w-full grid-cols-1 gap-3 min-[1024px]:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            period={period}
            decoration={popularDecoration}
          />
        ))}
      </ul>
    </>
  );
}
