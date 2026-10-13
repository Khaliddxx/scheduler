import { REASSURANCE } from '@/components/pricing/copy';
import { TickSquare } from '@/components/pricing/glyphs';

/**
 * The quiet line under the plan cards: four plain facts about paying.
 *
 * The reference has no block for this, so it borrows the cards' own bullet (the
 * ticked square) and bullet type, centred in a wrapping row, and adds no new
 * surface. Nothing here is a claim that needs hedging — the trial length is
 * computed from `TRIAL_DAYS`, and the other three restate what the pricing FAQ
 * below answers in full. No payment provider is named, because the checkout is
 * built outside this site and the provider is free to change.
 */

export function Reassurance() {
  return (
    <ul className="mt-[30px] flex w-full flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-[30px] sm:gap-y-3">
      {REASSURANCE.map((item) => (
        <li key={item} className="flex gap-2">
          <TickSquare className="mb-auto mt-[0.5px]" />
          <p className="text-[14px] leading-[18.83px] text-[#D1D1D1] min-[1440px]:text-[16px] min-[1440px]:leading-[20.83px]">
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
}
