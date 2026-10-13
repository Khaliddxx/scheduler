/**
 * Line icons shared by the header, the footer call to action and the mobile
 * menu. Strokes use `inherit`, so the colour comes from a `stroke-*` class on
 * the svg or on an ancestor (that is how the pills flip to white on hover).
 */

/** Down chevron; rotated for "open", "back" and the mobile drill-down. */
export const Chevron = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 25 24" fill="none" aria-hidden className={className}>
    <path
      d="M6.87 9l6 6 6-6"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** The double chevron on the "Start for $0" pills. */
export const DoubleChevron = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 25 25"
    fill="none"
    stroke="inherit"
    aria-hidden
    className={className}
  >
    <path
      d="M6.37 17.48l5-5-5-5M13.37 17.48l5-5-5-5"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Hamburger, or a cross while the mobile menu is open. */
export const MenuIcon = ({ open }: { open: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d={open ? 'M17 7L7 17M7 7l10 10' : 'M3 12h18M3 6h18M3 18h18'}
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The white "Start for $0" pill. `size="sm"` is the header version; the
 * default is the larger one used in the footer call to action.
 */
export const startPillClass = (size: 'sm' | 'lg' = 'lg'): string =>
  [
    'flex w-fit items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white font-medium',
    'text-[#0e0e0e] stroke-[#0e0e0e] transition-all hover:bg-pink hover:text-white hover:stroke-white',
    'text-[16px] leading-[20.83px] lg:leading-[24.74px]',
    size === 'sm'
      ? 'py-3 pl-6 pr-4'
      : 'py-[12px] pl-[24px] pr-[16px] sm:py-4 sm:pl-8 sm:pr-6 sm:text-[19px] sm:leading-[25px]',
  ].join(' ');
