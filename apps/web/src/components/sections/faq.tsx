import { previewImage } from '@/lib/preview-media';

/**
 * The FAQ accordion, shared by the home page (`homeFaqs`), the pricing page
 * (`pricingFaqs`) and the agencies page, hence items arrive as a prop.
 *
 * Layout follows the reference design: the heading (with a hand-drawn
 * underline) sits in a 344px column on the left from 1024px, the questions fill
 * the rest; below that both stack and the heading centres. Every item starts
 * closed, and the chevron turns from down to up as it opens.
 *
 * Built on native <details>/<summary>, which keeps this a Server Component and
 * gives the browser's own keyboard and screen-reader behaviour. The default
 * disclosure marker is styled away (`list-none` plus `::-webkit-details-marker`).
 * The summary carries the card's padding, so the whole top of the card toggles,
 * while clicks in the open answer do not.
 */

export interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_TITLE = 'Frequently asked questions';

/** Down when closed, up when open; centred against a multi-line question. */
function Chevron() {
  return (
    <span aria-hidden className="flex shrink-0 items-center">
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        className="min-h-6 min-w-6 shrink-0 rotate-180 transition-all group-open:rotate-0"
      >
        <path
          d="M18.87 15l-6-6-6 6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Faq({
  items,
  title = DEFAULT_TITLE,
  id = 'faq',
}: {
  items: FaqItem[];
  title?: string;
  id?: string;
}) {
  if (items.length === 0) return null;

  const underline = previewImage('faq/questions-underline.svg');

  return (
    <section
      id={id}
      className="section-pz gap-5 lg:flex-row lg:items-start lg:gap-[60px]"
    >
      <div className="flex flex-col items-center space-y-[13px] lg:items-start">
        <h2 className="h2-pz max-w-[344px] lg:text-left">{title}</h2>
        {underline ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={underline}
            alt=""
            aria-hidden
            width={228}
            height={62}
            loading="lazy"
            className="translate-y-[-14px] scale-[0.6] md:translate-y-0 md:scale-100"
          />
        ) : null}
      </div>

      <div className="w-full flex-1 space-y-[12px]">
        {items.map((item) => (
          <details
            key={item.q}
            className="group block cursor-pointer rounded-[20px] border border-white/10 bg-[#1A1919]/60"
          >
            <summary className="flex cursor-pointer list-none justify-between rounded-[20px] p-[30px] group-open:pb-0 [&::-webkit-details-marker]:hidden">
              <h3 className="select-none pr-2 text-left font-jakarta text-[20px] font-bold leading-[22px] sm:text-[24px] sm:leading-[26.4px]">
                {item.q}
              </h3>
              <Chevron />
            </summary>

            <div className="mx-[30px] mt-[20px] max-w-[780px] cursor-auto pb-[30px] text-left text-[17px] leading-[1.65] tracking-[-0.005em] text-[#d1d1d1] md:text-[18px] md:leading-[1.7]">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
