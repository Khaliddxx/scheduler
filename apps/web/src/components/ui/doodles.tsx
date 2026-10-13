import { cn } from '@/lib/cn';

/**
 * Hand-drawn decorative marks.
 *
 * All original, drawn on a 24x24 or 100x100 grid with an open stroke and
 * deliberately uneven curves — a line that is slightly wrong in the way a hand
 * is wrong reads as drawn; a perfect bezier reads as clip art. Every one of
 * these is decorative and carries `aria-hidden`.
 *
 * They exist because a dark page built only from rectangles and gradients
 * looks generated. One or two loose marks per viewport is enough to break that
 * up; more and the page starts to look busy.
 */

const stroke = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** A loose looping line. Sits in the dead space beside a hero. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
    >
      <path
        d="M4 74c10-26 34-44 54-36 17 7 14 32-2 39-19 8-33-11-25-29C41 27 68 14 93 20c28 7 36 38 62 44 19 4 35-6 41-22"
        stroke="currentColor"
        strokeWidth="2"
        {...stroke}
      />
    </svg>
  );
}

/** Four-point sparkle, the classic "a bit of magic happens here" mark. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
    >
      <path
        d="M24 2c1.6 11.2 10.2 19.8 21.4 21.4C34.2 25 25.6 33.6 24 44.8 22.4 33.6 13.8 25 2.6 23.4 13.8 21.8 22.4 13.2 24 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A scribbled underline, for emphasising one phrase in a heading. */
export function Underline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 16"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M3 10c36-5 74-7 110-6 34 1 68 4 104 9"
        stroke="currentColor"
        strokeWidth="2.5"
        {...stroke}
      />
      <path
        d="M14 13c40-4 80-5 118-3 28 1 56 3 84 6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
        {...stroke}
      />
    </svg>
  );
}

/** Hand-drawn circle around a word. */
export function Circled({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 60"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M72 4C38 3 7 13 5 29c-2 17 32 28 68 27 33-1 62-12 62-27C135 14 106 5 72 4Z"
        stroke="currentColor"
        strokeWidth="2"
        {...stroke}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hero marks                                                          */
/* ------------------------------------------------------------------ */

/**
 * The hero's two line drawings, drawn for the boxes the reference layout gives
 * its marks: 243x200 hugging the left edge, 136x187 hugging the right, 3px
 * white stroke. Both run off their box on the outer side, so they read as
 * coming in from beyond the viewport. Original artwork.
 */
export function HeroLoop({ className }: { className?: string }) {
  return (
    <svg
      width="243"
      height="200"
      viewBox="0 0 243 200"
      fill="none"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
    >
      <path
        d="M-30 36C20 20 90 18 112 52c18 28-2 66-34 64-32-2-42-34-20-46 26-14 72 8 92 34 22 30 18 72-10 76-28 4-36-30-12-44 28-16 72-8 113 14"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Four-point star with a two-stroke trail, for the right of the hero. */
export function HeroStar({ className }: { className?: string }) {
  return (
    <svg
      width="136"
      height="187"
      viewBox="0 0 136 187"
      fill="none"
      className={cn('pointer-events-none', className)}
      aria-hidden
      focusable="false"
    >
      <g stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 104c2 28 14 38 42 40-28 2-40 12-42 40-2-28-14-38-42-40 28-2 40-12 42-40Z" />
        <path d="M84 70c14-26 32-44 58-54" />
        <path d="M100 86c12-16 26-26 42-30" />
      </g>
    </svg>
  );
}

/**
 * Pink double-stroke underline (263x28), set under the closing words of the
 * hero headline. Sized in `em` by the caller so it scales with the type.
 */
export function ScribbleUnderline({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="263"
      height="28"
      viewBox="0 0 263 28"
      fill="none"
      className={cn('pointer-events-none', className)}
      style={style}
      aria-hidden
      focusable="false"
    >
      <g stroke="#FC69FF" strokeWidth="3" strokeLinecap="round">
        <path d="M3 13c64-7 150-9 256-4" />
        <path d="M44 23c58-6 122-7 190-3" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Audience icons                                                      */
/* ------------------------------------------------------------------ */

/**
 * Line illustrations for the audience cards. Drawn in the same loose hand as
 * the marks above so the page has one drawing style rather than a borrowed
 * icon set sitting next to doodles.
 */

const Icon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    viewBox="0 0 64 64"
    className={cn('h-14 w-14', className)}
    aria-hidden
    focusable="false"
  >
    <g stroke="currentColor" strokeWidth="2.2" {...stroke}>
      {children}
    </g>
  </svg>
);

/** A face, mid-grin. For the creators card. */
export function FaceIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M32 5c15.2 0 27 11.6 27 26.6C59 47 46.8 59 32 59 17.4 59 5 47.2 5 31.6 5 16.4 17 5 32 5Z" />
      <path d="M21 25c.6-2.2 2-3.4 3.6-3.3 1.5.1 2.6 1.4 3 3.4" />
      <path d="M36 25.2c.6-2.3 2-3.5 3.7-3.4 1.6.1 2.7 1.5 3 3.5" />
      <path d="M20 38c3.4 5.2 7.6 7.8 12.6 7.7 4.8-.1 8.7-2.8 11.6-8" />
    </Icon>
  );
}

/** A tote bag. For the agencies card. */
export function BagIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M13 22h38c1 0 1.8.8 1.9 1.8l2.6 30c.1 1.2-.8 2.2-2 2.2H10.5c-1.2 0-2.1-1-2-2.2l2.6-30c.1-1 .9-1.8 1.9-1.8Z" />
      <path d="M23 26V17c0-5 4-9 9-9s9 4 9 9v9" />
    </Icon>
  );
}

/** A terminal window. For the developers card. */
export function TerminalIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 12h48c1.7 0 3 1.4 3 3v34c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3V15c0-1.6 1.3-3 3-3Z" />
      <path d="M5 23h54" />
      <path d="M17 33l7 6.5-7 6.5" />
      <path d="M30 46h14" />
    </Icon>
  );
}

/** A house. Spare icon for a locale or home-base idea. */
export function HouseIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 29 32 8l24 21" />
      <path d="M13 32v22c0 .9.8 1.7 1.8 1.7h34.4c1 0 1.8-.8 1.8-1.7V32" />
      <path d="M26 56V40h12v16" />
    </Icon>
  );
}
