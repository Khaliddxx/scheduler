import type { CSSProperties } from 'react';
import { brand, registerUrl } from '@scheduler/brand';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { channelCount, integrationCount } from '@/content/channels';
import { popularPlan, TRIAL_DAYS } from '@/content/pricing';

/**
 * The closing conversion blocks.
 *
 * `CtaBand` is the full gradient panel for the bottom of a long page;
 * `CtaBandSlim` is the quiet one-row version for the bottom of a secondary page.
 *
 * Neither invents copy. The heading defaults to `brand.tagline`, the sub-copy is
 * assembled from the channel list and the trial length, and the button carries the
 * label the popular plan already uses on the pricing page — so a re-pitch or a
 * change of trial length is a content edit, not a trip through these components.
 *
 * Pass `title` when the page's own <h1> is already the tagline (the home page
 * hero is), so the same sentence does not appear twice.
 *
 * The call to action points at the application's own sign-up (`registerUrl()`),
 * never at a payment URL: checkout is handled outside this site, so nothing here
 * has to change when the payment provider does.
 */

const subCopy = `${channelCount} networks, ${integrationCount} connectable accounts, and a ${TRIAL_DAYS}-day trial on every plan.`;

/**
 * The one decorative layer: a faint dot lattice, masked so it fades out before it
 * reaches the buttons. Built from a CSS gradient, so it costs no request and no
 * dependency.
 */
const dotLayer: CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1.3px)',
  backgroundSize: '20px 20px',
  maskImage: 'radial-gradient(125% 95% at 50% 0%, black, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(125% 95% at 50% 0%, black, transparent 70%)',
};

export function CtaBand({
  title,
  body,
  className,
}: {
  title?: string;
  body?: string;
  className?: string;
}) {
  return (
    <Section className={className}>
      <div className="shell">
        <div className="panel-brand relative isolate overflow-hidden px-5 py-16 text-center sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.17]"
            style={dotLayer}
          />

          <div className="relative flex flex-col items-center">
            <h2 className="mx-auto max-w-[24ch] font-display text-[31px] font-bold leading-[1.08] tracking-[-0.015em] text-white sm:text-[40px] lg:text-display-md">
              {title ?? brand.tagline}
            </h2>

            <p className="mx-auto mt-5 max-w-[52ch] text-body-md text-white/75">
              {body ?? subCopy}
            </p>

            <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Button
                href={registerUrl()}
                external
                size="lg"
                withChevron
                className="w-full sm:w-auto"
              >
                {popularPlan.cta}
              </Button>
              <Button
                href="/pricing"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                See pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CtaBandSlim({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <Section tight className={className}>
      <div className="shell">
        <div className="card flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <h2 className="max-w-[32ch] font-display text-heading-sm text-white">
            {title ?? brand.tagline}
          </h2>
          <Button
            href={registerUrl()}
            external
            withChevron
            className="w-full shrink-0 sm:w-auto"
          >
            {popularPlan.cta}
          </Button>
        </div>
      </div>
    </Section>
  );
}
