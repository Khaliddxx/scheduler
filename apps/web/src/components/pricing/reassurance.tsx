import { REASSURANCE } from '@/components/pricing/copy';
import { Tick } from '@/components/pricing/glyphs';

/**
 * The quiet strip under the comparison table: four plain facts about paying.
 *
 * Nothing here is a claim that needs hedging — the trial length is computed from
 * `TRIAL_DAYS`, and the other three restate what the pricing FAQ below already
 * answers in full. No payment provider is named, because the checkout is built
 * outside this site and the provider is free to change.
 */

export function Reassurance() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {REASSURANCE.map((item) => (
        <li
          key={item}
          className="card flex items-start gap-2.5 px-4 py-3.5 text-body-xs leading-[1.45] text-muted"
        >
          <Tick className="mt-[2px] text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
