'use client';

import { useState } from 'react';
import { registerUrl } from '@scheduler/brand';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Tick } from '@/components/pricing/glyphs';
import {
  CONTACT_HREF,
  PERIOD_NOTE,
  QUOTED_NOTE,
  QUOTED_PRICE,
  RIBBON,
  TOGGLE,
} from '@/components/pricing/copy';
import {
  plans,
  priceFor,
  yearlySavingPct,
  type BillingPeriod,
  type Plan,
} from '@/content/pricing';

/**
 * The interactive part of the pricing page: the billing toggle and the plan cards.
 *
 * This is the only client component on the route. The page itself, the comparison
 * table, the reassurance strip and the FAQ all render on the server; the cards live
 * here because every price on them changes with the toggle.
 *
 * The toggle is two real radio inputs in a fieldset rather than two buttons, so it
 * gets arrow-key behaviour, a group label and a checked state for free. The inputs
 * are visually hidden and the pill next to each one is what you see, which is why
 * the focus ring is drawn with `peer-focus-visible` — the focused element itself
 * has no pixels.
 */

const PERIODS: ReadonlyArray<{ id: BillingPeriod; label: string }> = [
  { id: 'monthly', label: TOGGLE.monthly },
  { id: 'yearly', label: TOGGLE.yearly },
];

/**
 * Prices are whole units in the plan's own currency, so the symbol comes from the
 * currency code rather than being hardcoded to a dollar sign. The locale is fixed
 * so the server and the client format identically and hydration stays quiet.
 */
const money = (amount: number, currency: string): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * A plan with no published price on either period is quoted, not free. The
 * Dedicated tier carries `monthly: 0` precisely because its price depends on the
 * instance, so it must never render as "$0" — it shows "Custom" and its call to
 * action goes to contact rather than to sign-up. Deriving this from the price (and
 * from both periods, so the toggle cannot change where the button points) keeps it
 * true for any future plan that is quoted the same way.
 */
const isQuoted = (plan: Plan): boolean =>
  priceFor(plan, 'monthly') === 0 && priceFor(plan, 'yearly') === 0;

function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
}) {
  return (
    <fieldset className="inline-flex items-center gap-1 rounded-control bg-white/[0.06] p-1 shadow-hairline">
      <legend className="sr-only">{TOGGLE.legend}</legend>

      {PERIODS.map(({ id, label }) => {
        const active = period === id;
        return (
          <label key={id} className="cursor-pointer">
            <input
              type="radio"
              name="billing-period"
              value={id}
              checked={active}
              onChange={() => onChange(id)}
              className="peer sr-only"
            />
            <span
              className={cn(
                'flex items-center gap-2 rounded-control px-4 py-2 text-body-sm font-medium transition-colors duration-200',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
                active ? 'bg-white text-[#0e0e0e]' : 'text-muted hover:text-white',
              )}
            >
              {label}
              {id === 'yearly' && yearlySavingPct > 0 ? (
                <span
                  className={cn(
                    'rounded-control px-2 py-0.5 text-eyebrow uppercase',
                    active ? 'bg-[#0e0e0e]/10 text-[#0e0e0e]' : 'bg-white/10 text-accent',
                  )}
                >
                  {TOGGLE.savePrefix} {yearlySavingPct}%
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

function PlanCard({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const quoted = isQuoted(plan);
  const popular = plan.popular === true;

  const body = (
    <div
      className={cn(
        'flex h-full flex-col p-6 sm:p-7',
        // On the popular card the gradient lives on the wrapper below, so the inner
        // surface is drawn here at one pixel inside the 20px radius.
        popular ? 'rounded-[19px] bg-bgInner' : 'card',
      )}
    >
      <h3 className="font-display text-heading-sm text-white">{plan.name}</h3>
      <p className="mt-2 text-body-xs leading-[1.5] text-dim">{plan.audience}</p>

      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-display-sm text-white">
          {quoted ? QUOTED_PRICE : money(priceFor(plan, period), plan.currency)}
        </span>
        {quoted ? null : <span className="text-body-sm text-dim">/mo</span>}
      </p>
      <p className="mt-1.5 text-body-xs text-dim">
        {quoted ? QUOTED_NOTE : PERIOD_NOTE[period]}
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-line pt-6">
        {plan.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2.5 text-body-sm leading-[1.45] text-muted"
          >
            <Tick className="mt-[3px] text-accent" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {quoted ? (
          <Button href={CONTACT_HREF} variant="secondary" withChevron className="w-full">
            {plan.cta}
            <span className="sr-only">, {plan.name} plan</span>
          </Button>
        ) : (
          <Button
            href={registerUrl()}
            external
            variant={popular ? 'primary' : 'secondary'}
            withChevron
            className="w-full"
          >
            {plan.cta}
            <span className="sr-only">, {plan.name} plan</span>
          </Button>
        )}
      </div>
    </div>
  );

  if (!popular) return <li>{body}</li>;

  return (
    <li className="relative rounded-card bg-brand p-px shadow-lift">
      <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-control bg-white px-3 py-1 text-eyebrow uppercase text-[#0e0e0e]">
        {RIBBON}
      </span>
      {body}
    </li>
  );
}

export function PlanPicker() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  return (
    <div>
      <div className="flex justify-center">
        <BillingToggle period={period} onChange={setPeriod} />
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} period={period} />
        ))}
      </ul>
    </div>
  );
}
