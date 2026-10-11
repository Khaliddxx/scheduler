import { Section, SectionHeading } from '@/components/ui/section';

/**
 * The FAQ accordion, shared by the home page (`homeFaqs`) and the pricing page
 * (`pricingFaqs`) — hence items arrive as a prop rather than being imported here.
 *
 * Built on native <details>/<summary>, which buys three things at once: it opens
 * and closes with no JavaScript, it stays a Server Component, and the keyboard
 * and screen-reader behaviour is the browser's own rather than a hand-rolled
 * aria-expanded dance. The cost is that the default disclosure marker has to be
 * styled away in two places (`list-none` for Firefox and the standards marker,
 * `::-webkit-details-marker` for older WebKit); the chevron below replaces it and
 * is rotated by `group-open:`.
 *
 * Focus comes from the global :focus-visible rule in globals.css, and the
 * chevron's transition is already neutralised under prefers-reduced-motion there,
 * so neither is re-implemented.
 */

export interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_TITLE = 'Frequently asked questions';

function Chevron() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 shadow-hairline transition-transform duration-200 group-hover:text-white group-open:rotate-180"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3.5 5.25 7 8.75l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.7"
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

  return (
    <Section id={id}>
      {/* .shell owns the page gutter; the inner measure keeps the questions readable. */}
      <div className="shell">
        <div className="mx-auto max-w-[820px]">
          <SectionHeading title={title} />

          <ul className="card-lg mt-10 divide-y divide-separator sm:mt-12">
            {items.map((item) => (
              <li key={item.q}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-6 transition-colors hover:bg-white/[0.02] sm:px-8 sm:py-7 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-[20px] font-bold leading-[1.3] text-white sm:text-heading-sm sm:leading-[1.25]">
                      {item.q}
                    </h3>
                    <Chevron />
                  </summary>

                  <p className="max-w-[66ch] px-6 pb-7 text-body-md text-muted sm:px-8 sm:pb-8">
                    {item.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
