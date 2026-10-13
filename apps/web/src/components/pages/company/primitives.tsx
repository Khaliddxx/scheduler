import Link from 'next/link';
import type { ReactNode } from 'react';
import { DoubleChevron } from '@/components/layout/header-icons';
import { cn } from '@/lib/cn';

/**
 * Building blocks shared by the company pages (about, contact, compare,
 * agencies, open source, docs, legal). Every class string here is lifted from
 * the reference site's markup for the same element, so these pages share its
 * card, pill and lead-paragraph treatments exactly.
 */

/** The dark card used across the reference's about and contact pages. */
export const CARD = 'rounded-[20px] border border-[#FFFFFF0D] bg-[#1A1919]';

/** The 18/22px grey lead paragraph that sits under a page or section heading. */
export const LEAD =
  'text-[18px] font-[400] leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]';

/** Card heading (22/26 Jakarta bold) and card body (16/22 grey). */
export const CARD_TITLE = 'font-jakarta text-[22px] font-[700] leading-[26px]';
export const CARD_BODY = 'text-[16px] leading-[22px] text-[#d1d1d1]';

/** Pink inline link used inside cards. */
export const CARD_LINK =
  'font-[600] text-pink hover:underline focus-visible:underline';

/** Content section: the global section frame plus the reference's per-section padding. */
export const SECTION = 'section-pz w-full px-5';

const pillBase =
  'flex h-fit w-fit items-center justify-center gap-[6px] whitespace-nowrap rounded-full font-[500] transition-all text-[16px] leading-[20.83px] sm:text-[19px] sm:leading-[25px]';

/** Solid white pill with the double chevron: the reference's primary action. */
export const WHITE_PILL = cn(
  pillBase,
  'cursor-pointer bg-white text-[#0e0e0e] stroke-[#0e0e0e] hover:bg-pink hover:text-white hover:stroke-white',
  'py-[12px] pl-[24px] pr-[16px] sm:!pl-8 sm:!pr-6 sm:py-4 min-[1024px]:py-[16px] min-[1024px]:pl-[32px] min-[1024px]:pr-[24px] min-[1024px]:leading-[24.74px] sm:h-[57px]',
);

/** White pill without the chevron (hero button pair). */
export const WHITE_PILL_PLAIN = cn(
  pillBase,
  'bg-white text-[#0e0e0e] hover:bg-pink hover:text-white px-4 py-3 sm:px-8 sm:py-4',
);

/** Outlined pill (hero secondary action). */
export const OUTLINE_PILL = cn(
  pillBase,
  'border border-white text-white hover:border-pink px-4 py-3 sm:px-8 sm:py-4',
);

export function PillLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  return external || !href.startsWith('/') ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Primary call to action: white pill with the double chevron. */
export function StartPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <PillLink href={href} className={WHITE_PILL}>
      {children}
      <DoubleChevron className="h-5 w-5 md:h-6 md:w-6" />
    </PillLink>
  );
}

/** Row of rounded link chips ("Keep exploring" on the reference's about page). */
export function LinkChips({
  title,
  links,
  className,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  className?: string;
}) {
  return (
    <section className={cn(SECTION, className)}>
      <div className="mx-auto max-w-[820px] space-y-6 text-center">
        <h2 className="h2-pz">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <PillLink
              key={link.href + link.label}
              href={link.href}
              className="rounded-full border border-[#FFFFFF1A] bg-[#1A1919] px-5 py-3 text-[16px] transition-all hover:border-pink"
            >
              {link.label}
            </PillLink>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Emoji used as a decorative card icon, as the reference does. */
export function CardEmoji({ children }: { children: string }) {
  return (
    <div className="text-[32px]" aria-hidden="true">
      {children}
    </div>
  );
}

/** Page wrapper of the reference's inner pages: centred column, 1440px max. */
export function CompanyPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto flex max-w-[1440px] flex-col items-center overflow-hidden', className)}>
      {children}
    </div>
  );
}
