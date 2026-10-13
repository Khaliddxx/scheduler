import { cn } from '@/lib/cn';

/**
 * The small marks the pricing page needs, as inline SVG so they render the same
 * in server and client components without a file lookup.
 *
 * All are decorative (`aria-hidden`): wherever a mark carries meaning — a tick or
 * a cross in the comparison — the meaning is in visually hidden text beside it.
 */

/** Filled rounded square with a check: the bullet on the plan cards. 20px. */
export function TickSquare({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 21 21"
      fill="none"
      className={cn('shrink-0', className)}
    >
      <path
        d="M14.359 2.649H7.376c-3.034 0-4.842 1.809-4.842 4.842v6.975c0 3.042 1.808 4.85 4.842 4.85h6.975c3.033 0 4.841-1.808 4.841-4.841V7.491c.009-3.034-1.8-4.842-4.833-4.842Zm.492 6.417-4.725 4.725a.623.623 0 0 1-.442.183.623.623 0 0 1-.442-.183l-2.358-2.358a.629.629 0 0 1 0-.884.629.629 0 0 1 .883 0l1.917 1.917 4.283-4.283a.629.629 0 0 1 .884 0c.242.241.242.633 0 .883Z"
        fill="white"
      />
    </svg>
  );
}

/** Green check in a comparison cell. 24px. */
export function Tick() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 25 24" fill="none">
      <path
        d="M20.5 6 9.5 17l-5-5"
        stroke="#38FF9F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Red cross in a comparison cell. 24px. */
export function Cross() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 25 24" fill="none">
      <path
        d="M17.7 7 7.7 17m0-10 10 10"
        stroke="#FF6565"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "Unlimited" in a comparison cell. 24px. */
export function InfinityMark() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 25 24" fill="none">
      <path
        d="M18.278 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8h-.001Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Question mark in a circle, next to a comparison row that has a hint. 16px. */
export function InfoCircle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn('h-4 w-4 shrink-0 text-gray-400', className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  );
}

/** The double chevron at the end of every pill call to action. Strokes in `stroke` colour. */
export function DoubleChevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 25 25"
      fill="none"
      stroke="inherit"
      className={className}
    >
      <path
        d="M6.368 17.484l5-5-5-5M13.368 17.484l5-5-5-5"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
