import { cn } from '@/lib/cn';

/**
 * The two marks the pricing page needs, as inline SVG and a typographic dash.
 *
 * Both are decorative: the meaning of a cell is carried by visually hidden text
 * next to the mark (see `MatrixMark`), not by the shape, so a screen reader hears
 * "Included" rather than "image".
 *
 * An absent feature is an em-dash, never a cross. A cross reads as a failure; on a
 * ladder where the cheapest plan is a legitimate choice, the honest rendering of
 * "not on this tier" is a neutral blank.
 */

export function Tick({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <path
        d="M3.25 8.5 6.4 11.6 12.75 4.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A matrix cell's boolean state, with its meaning in text for assistive tech. */
export function MatrixMark({
  present,
  labels,
}: {
  present: boolean;
  labels: { included: string; notIncluded: string };
}) {
  if (present) {
    return (
      <>
        <Tick className="mx-auto block text-accent" />
        <span className="sr-only">{labels.included}</span>
      </>
    );
  }
  return (
    <>
      <span aria-hidden className="text-dim">
        &mdash;
      </span>
      <span className="sr-only">{labels.notIncluded}</span>
    </>
  );
}
