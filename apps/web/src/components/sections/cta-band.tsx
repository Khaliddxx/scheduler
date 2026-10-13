import { brand, registerUrl } from '@scheduler/brand';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { channelCount, integrationCount } from '@/content/channels';
import { popularPlan, TRIAL_DAYS } from '@/content/pricing';
import { previewImage } from '@/lib/preview-media';

/**
 * The closing conversion blocks.
 *
 * `CtaBand` is the solid violet band from the reference design: copy on the
 * left, one white pill on the right with a hand-drawn arrow pointing at it;
 * stacked, left-aligned, below 1024px. `CtaBandSlim` is the quiet one-row
 * version for the bottom of a secondary page.
 *
 * Neither invents claims. The sub-copy is assembled from the channel list and
 * the trial length, and the button carries the label the popular plan already
 * uses on the pricing page, so a change of trial length is a content edit.
 *
 * The call to action points at the application's own sign-up (`registerUrl()`),
 * never at a payment URL: checkout is handled outside this site, so nothing here
 * has to change when the payment provider does.
 */

/** Default heading. The home page's <h1> is already `brand.tagline`, so this band does not repeat it. */
const DEFAULT_TITLE = 'Ready when you are';

const subCopy = `${channelCount} networks, ${integrationCount} connectable accounts, and a ${TRIAL_DAYS}-day trial on every plan.`;

function DoubleChevron() {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 25 25"
      fill="none"
      stroke="inherit"
      className="h-5 w-5 md:h-6 md:w-6"
    >
      <path
        d="M6.4 17.5l5-5-5-5M13.4 17.5l5-5-5-5"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CtaBand({
  title = DEFAULT_TITLE,
  body,
  className,
}: {
  title?: string;
  body?: string;
  className?: string;
}) {
  const doodle = previewImage('cta-band/doodle-cta.svg');
  const doodleMobile = previewImage('cta-band/doodle-cta-mobile.svg');

  return (
    <section className={['section-pz', className].filter(Boolean).join(' ')}>
      <div
        style={{ backgroundColor: '#8217C3' }}
        className="flex w-full flex-col justify-between gap-10 rounded-[20px] px-5 py-10 sm:p-15 lg:flex-row lg:items-center"
      >
        <div className="space-y-5 sm:space-y-4">
          <h2 className="text-left font-jakarta text-[30px] font-bold leading-[33px] text-white sm:text-[48px] sm:leading-[52.8px]">
            {title}
          </h2>
          <p className="max-w-[620px] text-left text-[18px] font-normal leading-[23.44px] text-white sm:text-[22px] sm:leading-[28.64px]">
            {body ?? subCopy}
          </p>
        </div>

        <div className="relative">
          <div className="min-w-[192px]">
            <div className="relative w-fit">
              <a
                href={registerUrl()}
                className="flex w-fit cursor-pointer items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white stroke-[#0e0e0e] py-[12px] pl-[24px] pr-[16px] text-[16px] font-medium leading-[20.83px] text-[#0e0e0e] transition-all hover:bg-pink hover:stroke-white hover:text-white sm:h-[57px] sm:py-[16px] sm:pl-[32px] sm:pr-[24px] sm:text-[19px] sm:leading-[25px] lg:leading-[24.74px]"
              >
                {popularPlan.cta}
                <DoubleChevron />
              </a>
              {doodleMobile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doodleMobile}
                  alt=""
                  aria-hidden
                  width={87}
                  height={93}
                  loading="lazy"
                  className="pointer-events-none absolute left-[calc(100%+3px)] top-[-36px] block max-w-none sm:left-[calc(100%+15px)] sm:top-[-30px] lg:hidden"
                />
              ) : null}
            </div>
          </div>
          {doodle ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doodle}
              alt=""
              aria-hidden
              width={115}
              height={126}
              loading="lazy"
              className="pointer-events-none absolute left-[-130px] top-[-50px] hidden max-w-none lg:block"
            />
          ) : null}
        </div>
      </div>
    </section>
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
