'use client';

import { cn } from '@/lib/cn';
import { TOGGLE } from '@/components/pricing/copy';
import type { BillingPeriod } from '@/content/pricing';

/**
 * Monthly / Yearly switch, as the reference draws it: a hairline-bordered frame
 * with two half-width buttons; the selected one is a white tile with dark text,
 * the other sits on black with grey text.
 *
 * The reference swaps the two states instantly (no transition, no animated
 * price), so this does too. Each instance keeps its own state in its parent,
 * again as the reference does: the switch above the plan cards and the one in
 * the comparison are independent.
 *
 * Two buttons with `aria-pressed` in a labelled group: each is announced as
 * a toggle and reachable with Tab, and the focus ring is drawn on the button.
 */

const PERIODS: ReadonlyArray<{ id: BillingPeriod; label: string }> = [
  { id: 'monthly', label: TOGGLE.monthly },
  { id: 'yearly', label: TOGGLE.yearly },
];

export function BillingToggle({
  period,
  onChange,
  className,
}: {
  period: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
  /** Frame classes: width, margin and gap differ between the two placements. */
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={TOGGLE.legend}
      className={cn(
        'flex rounded-[10px] border border-white/10 p-[6px] sm:rounded-xl',
        className,
      )}
    >
      {PERIODS.map(({ id, label }) => {
        const active = period === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={cn(
              'w-1/2 rounded-lg px-3 py-2.5 focus-visible:outline-offset-[-2px]',
              active ? 'bg-white' : 'bg-[#0e0e0e]',
            )}
          >
            <span
              className={cn(
                'block text-sm font-medium leading-[18.23px] sm:text-base sm:leading-[20.83px]',
                active ? 'text-[#0e0e0e]' : 'text-[#D1D1D1]',
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
