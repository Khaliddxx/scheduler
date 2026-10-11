import Link from 'next/link';
import { brand } from '@scheduler/brand';
import { cn } from '@/lib/cn';

/**
 * Wordmark.
 *
 * Deliberately typographic rather than a bespoke SVG: the product name is not
 * settled yet (see docs/07-naming.md), and a text mark means renaming is a
 * one-line change in brand.json instead of a trip to a designer. Swap the
 * `<Mark/>` glyph and this component for a real lockup once the name exists.
 */

export const Mark = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand text-[17px] font-extrabold leading-none text-white',
      className,
    )}
  >
    {brand.name.charAt(0).toUpperCase()}
  </span>
);

export function Logo({
  className,
  href = '/',
  showWordmark = true,
}: {
  className?: string;
  href?: string | null;
  showWordmark?: boolean;
}) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Mark />
      {showWordmark ? (
        <span className="font-display text-[22px] font-extrabold tracking-[-0.02em] text-white">
          {brand.name}
        </span>
      ) : null}
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} aria-label={`${brand.name} home`} className="inline-flex">
      {content}
    </Link>
  );
}
