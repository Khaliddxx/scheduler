import type { ReactNode } from 'react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/cn';

/**
 * The top treatment every secondary page opens with.
 *
 * The home and pricing pages set their own centred heroes; everything else — about,
 * open source, developers, agencies, compare, contact, legal — uses this, so the
 * supporting pages read as one set rather than eight separate attempts at a header.
 *
 * Left-aligned on purpose. These pages are read, not scanned: a measure that starts
 * at the same gutter as the prose underneath it is easier to come back to than a
 * centred block the eye has to re-find on every scroll.
 *
 * It renders the page's single `<h1>`, so no page using it should write another one.
 * `children` is the slot for whatever follows the intro — buttons, a meta row, a
 * notice — and is deliberately unstyled beyond its top margin, because each page
 * wants a different arrangement there.
 */
export function PageHeader({
  eyebrow,
  title,
  body,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Section tight className={cn('lg:py-20', className)}>
      <div className="shell">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}

        <h1
          className={cn(
            'max-w-[24ch] font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white',
            'sm:text-display-sm lg:text-display-md',
            eyebrow ? 'mt-6' : null,
          )}
        >
          {title}
        </h1>

        {body ? (
          <p className="mt-5 max-w-[62ch] text-body-md text-muted">{body}</p>
        ) : null}

        {children ? <div className="mt-9">{children}</div> : null}
      </div>
    </Section>
  );
}
