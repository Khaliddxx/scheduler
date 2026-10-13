import type { ReactNode } from 'react';
import Link from 'next/link';
import { DoubleChevron } from '@/components/layout/header-icons';
import { cn } from '@/lib/cn';

/**
 * The two pill buttons of the hero and closing bands: solid white, and white
 * outline (with the double chevron when it leads to sign-up). 45/47px tall on
 * phones, 57/59px from 640px, full width below 640px.
 */

const base =
  'flex w-fit items-center justify-center gap-[6px] whitespace-nowrap rounded-full font-medium transition-all text-[16px] leading-[20.83px] sm:text-[19px] sm:leading-[25px] max-sm:!w-full';

const isExternal = (href: string) => /^https?:\/\//.test(href);

function PillLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (isExternal(href) || href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function PrimaryPill({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <PillLink
      href={href}
      className={cn(
        base,
        'bg-white stroke-[#0e0e0e] px-4 py-3 text-[#0e0e0e] hover:bg-pink hover:stroke-white hover:text-white sm:px-8 sm:py-4',
        className,
      )}
    >
      {children}
    </PillLink>
  );
}

export function OutlinePill({
  href,
  children,
  chevron = false,
  className,
}: {
  href: string;
  children: ReactNode;
  chevron?: boolean;
  className?: string;
}) {
  return (
    <PillLink
      href={href}
      className={cn(
        base,
        'border border-white stroke-white text-white hover:border-pink',
        chevron
          ? 'py-[12px] pl-[24px] pr-[16px] sm:py-4 sm:pl-8 sm:pr-6 lg:leading-[24.74px]'
          : 'px-4 py-3 sm:px-8 sm:py-4',
        className,
      )}
    >
      {children}
      {chevron ? <DoubleChevron className="h-5 w-5 md:h-6 md:w-6" /> : null}
    </PillLink>
  );
}
