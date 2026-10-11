import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/ui/section';
import { Faq } from '@/components/sections/faq';
import { CtaBandSlim } from '@/components/sections/cta-band';
import {
  AnalyticsMock,
  CalendarMock,
  PlugsMock,
  TeamMock,
} from '@/components/visuals';
import { AGENCIES, CAPABILITIES, CAPS, FAQS } from '@/content/agencies';

/**
 * /agencies
 *
 * A Server Component. Four capability blocks, then the channel-cap arithmetic,
 * then the agency FAQ.
 *
 * The cap section is the one that earns its place. An agency's first question is
 * "how many clients does this cover", and every number in it is computed from the
 * Agency plan in src/content/pricing.ts — so a pricing change cannot leave a
 * stale sum sitting on this page.
 */

export const metadata: Metadata = {
  title: 'For agencies',
  description: AGENCIES.description,
  alternates: { canonical: '/agencies' },
  openGraph: {
    title: `${AGENCIES.title} — ${brand.name}`,
    description: AGENCIES.description,
    url: siteUrl('/agencies'),
    type: 'website',
  },
};

const VISUALS = {
  team: TeamMock,
  calendar: CalendarMock,
  analytics: AnalyticsMock,
  plugs: PlugsMock,
};

export default function AgenciesPage() {
  return (
    <>
      <PageHeader eyebrow={AGENCIES.eyebrow} title={AGENCIES.title} body={AGENCIES.body}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="/pricing" withChevron className="w-full sm:w-auto">
            See agency pricing
          </Button>
          <Button href="/contact" variant="secondary" className="w-full sm:w-auto">
            Talk about a dedicated instance
          </Button>
        </div>
      </PageHeader>

      <Section tight>
        <div className="shell flex flex-col gap-16 sm:gap-20">
          {CAPABILITIES.map((capability, i) => {
            const Visual = VISUALS[capability.visual];

            return (
              <section
                key={capability.id}
                id={capability.id}
                className="grid scroll-mt-28 items-start gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={i % 2 === 1 ? 'lg:order-last' : undefined}>
                  <span className="eyebrow">{capability.eyebrow}</span>
                  <h2 className="mt-5 max-w-[24ch] font-display text-[27px] font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-heading-md">
                    {capability.title}
                  </h2>
                  <p className="mt-4 max-w-[54ch] text-body-md text-muted">{capability.body}</p>

                  <ul className="mt-6 flex flex-col gap-3">
                    {capability.points.map((point) => (
                      <li key={point.slice(0, 40)} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        <span className="text-body-sm leading-[1.6] text-muted">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card min-w-0 p-5 sm:p-6">
                  <Visual />
                </div>
              </section>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading align="left" eyebrow={CAPS.eyebrow} title={CAPS.title} />

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
            <div className="flex flex-col gap-5">
              {CAPS.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="max-w-[62ch] text-body-md text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* The worked example. A table, because that is what an agency is
                about to recreate in a spreadsheet anyway. */}
            <div className="card overflow-hidden">
              <table className="w-full text-left">
                <caption className="border-b border-separator px-6 py-4 text-left font-display text-body-lg font-bold text-white">
                  {CAPS.example.title}
                </caption>
                <tbody>
                  {CAPS.example.rows.map((row) => (
                    <tr key={row.label} className="border-b border-separator">
                      <th
                        scope="row"
                        className="px-6 py-3.5 text-body-sm font-normal text-muted"
                      >
                        {row.label}
                      </th>
                      <td className="whitespace-nowrap px-6 py-3.5 text-right text-body-sm text-dim">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th
                      scope="row"
                      className="px-6 py-4 font-display text-body-sm font-bold text-white"
                    >
                      {CAPS.example.totalLabel}
                    </th>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-display text-body-sm font-bold text-accent">
                      {CAPS.example.totalValue}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="border-t border-separator px-6 py-4 text-body-xs leading-[1.55] text-dim">
                {CAPS.example.footnote}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Faq items={FAQS} id="agency-faq" />

      <CtaBandSlim />
    </>
  );
}
