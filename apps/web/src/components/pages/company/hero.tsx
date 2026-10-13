/* eslint-disable @next/next/no-img-element -- static decorative SVGs from /public need no optimisation pass */
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LEAD } from './primitives';

/**
 * The centred page opener of the reference's about, contact and enterprise
 * pages: a pink sparkle, the h1 with a hand-drawn underline, a grey lead and
 * (optionally) a pair of buttons, with loose doodles in the page margins.
 *
 * Spacing is the reference's, less the fixed header's spacer (60px on phones,
 * 81px from 640px) that the root layout already puts above every page: its
 * section opens 73px / 120px below the top of the document, so this one opens
 * 13px / 39px below the spacer.
 *
 * The four margin doodles are deliberately positioned against the page, not
 * the section (nothing above them is positioned), exactly like the reference:
 * desktop ones from the top of the document (plus the section's 30px
 * `space-y` margin), phone ones from the bottom of the first screen.
 */
export function CompanyHero({
  title,
  body,
  bodyClassName = 'max-w-[700px]',
  children,
  titleClassName,
}: {
  title: ReactNode;
  body?: ReactNode;
  bodyClassName?: string;
  /** Buttons under the lead. */
  children?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <section className="section-pz !mt-[13px] w-auto space-y-[30px] !px-5 !pb-0 !pt-0 sm:!mt-[39px]">
      <div className="flex justify-center">
        <img
          alt=""
          aria-hidden="true"
          width={62}
          height={77}
          className="hidden lg:block"
          src="/preview/company/doodle-top.svg"
        />
        <img
          alt=""
          aria-hidden="true"
          width={39}
          height={47}
          className="block lg:hidden"
          src="/preview/company/doodle-top-mobile.svg"
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="min-h-[12px] sm:min-h-[10px]" />
        <div className="relative max-w-[900px]">
          <h1 className={cn('h1-pz [text-wrap:balance]', titleClassName)}>{title}</h1>
          <img
            alt=""
            aria-hidden="true"
            width={316}
            height={22}
            className="absolute left-[50%] hidden -translate-x-[50%] lg:block"
            src="/preview/company/doodle-underline.svg"
          />
        </div>
        {body ? (
          <>
            <div className="min-h-[24px] sm:min-h-[32px]" />
            <p className={cn(LEAD, 'text-center', bodyClassName)}>{body}</p>
          </>
        ) : null}
        {children ? (
          <>
            <div className="min-h-[32px] sm:min-h-[40px]" />
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">{children}</div>
          </>
        ) : null}
      </div>

      <img
        alt=""
        aria-hidden="true"
        width={93}
        height={127}
        className="absolute left-0 top-[320px] hidden lg:block"
        src="/preview/company/doodle-left.svg"
      />
      <img
        alt=""
        aria-hidden="true"
        width={35}
        height={59}
        className="absolute bottom-[73px] left-0 block sm:hidden"
        src="/preview/company/doodle-left-mobile.svg"
      />
      <img
        alt=""
        aria-hidden="true"
        width={119}
        height={135}
        className="absolute right-0 top-[120px] hidden lg:block"
        src="/preview/company/doodle-right.svg"
      />
      <img
        alt=""
        aria-hidden="true"
        width={47}
        height={65}
        className="absolute bottom-[233px] right-0 block sm:hidden"
        src="/preview/company/doodle-right-mobile.svg"
      />
    </section>
  );
}
