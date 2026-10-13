import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { DoubleChevron } from '@/components/pricing/glyphs';

/**
 * The reference design's pill call to action, as used on the pricing page.
 *
 * `primary` is the solid white pill that turns pink on hover; `secondary` is the
 * white outline whose border turns pink. Both end in a double chevron drawn with
 * the current `stroke` colour, which the hover state swaps with the text colour.
 *
 * Sizes, measured from the reference at each breakpoint:
 * - `card`:    16px/20.83 with 12/16/12/24 padding on phones; 19px/25 with
 *              16/24/16/32 from 640px; leading 24.74 from 1024px. Chevron 20px,
 *              24px from 768px. Natural height (56.7px + border at desktop).
 * - `compact`: 14px/20.83 full-width pill in the comparison's column headers.
 *              12/32 padding, 12/16/12/24 from 1440px, where its chevron appears.
 *
 * Internal routes go through next/link; sign-up and other origins are plain
 * anchors in the same tab, like the rest of the site's sign-up buttons.
 */

type Variant = 'primary' | 'secondary';
type Size = 'card' | 'compact';

const base =
  'flex items-center justify-center gap-[6px] whitespace-nowrap rounded-full font-medium transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const variants: Record<Variant, string> = {
  primary: 'bg-white text-[#0e0e0e] stroke-[#0e0e0e] hover:bg-pink hover:text-white hover:stroke-white',
  secondary: 'border border-white text-white stroke-white hover:border-pink',
};

const sizes: Record<Size, string> = {
  card: 'w-fit py-[12px] pl-[24px] pr-[16px] text-[16px] leading-[20.83px] sm:py-4 sm:pl-8 sm:pr-6 sm:text-[19px] sm:leading-[25px] min-[1024px]:leading-[24.74px]',
  compact:
    'w-full px-8 py-[12px] text-[14px] leading-[20.83px] min-[1440px]:pl-[24px] min-[1440px]:pr-[16px]',
};

const chevrons: Record<Size, string> = {
  card: 'h-5 w-5 md:h-6 md:w-6',
  compact: 'hidden h-6 w-6 min-[1440px]:block',
};

export function PillLink({
  href,
  variant,
  size = 'card',
  className,
  children,
}: {
  href: string;
  variant: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {children}
      <DoubleChevron className={chevrons[size]} />
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}
