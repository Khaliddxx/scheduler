import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Standard vertical rhythm for a page section, plus the centred heading block
 * that most sections open with. Keeping both here is what stops each section
 * inventing its own spacing and type sizes.
 */

export function Section({
  id,
  children,
  className,
  tight,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Halves the vertical padding, for sections that sit close together. */
  tight?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(tight ? 'py-14 sm:py-16' : 'py-20 sm:py-28', className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2
        className={cn(
          'font-display text-[32px] font-bold leading-[1.12] tracking-[-0.015em] text-white',
          'sm:text-[40px] lg:text-display-md',
          align === 'center' ? 'max-w-[18ch]' : 'max-w-[20ch]',
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            'text-body-md text-muted',
            align === 'center' ? 'max-w-[58ch]' : 'max-w-[54ch]',
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
