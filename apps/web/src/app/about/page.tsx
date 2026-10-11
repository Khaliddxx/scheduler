import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Prose } from '@/components/ui/prose';
import { Section, SectionHeading } from '@/components/ui/section';
import { CtaBandSlim } from '@/components/sections/cta-band';
import { ABOUT, DUTIES, FACTS, FACTS_TITLE, STORY } from '@/content/about';

/**
 * /about
 *
 * A Server Component with no client code on the route.
 *
 * The page's whole argument is that being a managed deployment of an open-source
 * engine is a selling point rather than something to bury, so the duties list sits
 * high — above the narrative — because "what stops being your problem" is the part
 * a buyer is actually weighing. Copy lives in src/content/about.ts.
 */

export const metadata: Metadata = {
  title: ABOUT.eyebrow,
  description: ABOUT.description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `${ABOUT.title} — ${brand.name}`,
    description: ABOUT.description,
    url: siteUrl('/about'),
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={ABOUT.eyebrow} title={ABOUT.title} body={ABOUT.body}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="/pricing" withChevron className="w-full sm:w-auto">
            See what that costs
          </Button>
          <Button href="/open-source" variant="secondary" className="w-full sm:w-auto">
            Read the licence page
          </Button>
        </div>
      </PageHeader>

      <Section>
        <div className="shell">
          <SectionHeading
            align="left"
            eyebrow={DUTIES.eyebrow}
            title={DUTIES.title}
            body={DUTIES.body}
          />

          <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {DUTIES.items.map((duty, i) => (
              <li
                key={duty.title}
                className="card flex flex-col gap-3 p-6 sm:p-7"
              >
                <span
                  aria-hidden
                  className="font-display text-body-sm font-bold text-dim"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-body-lg font-bold leading-[1.3] text-white">
                  {duty.title}
                </h3>
                <p className="text-body-sm leading-[1.6] text-muted">{duty.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tight>
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <Prose className="max-w-[70ch]">
            {STORY.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </Prose>

          {/* The licence facts, repeated here so a reader who lands on About
              rather than the licence page still sees them without scrolling. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="text-eyebrow uppercase text-dim">{FACTS_TITLE}</p>

              <dl className="mt-5 flex flex-col gap-5">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1">
                    <dt className="font-display text-body-lg font-bold text-white">
                      {fact.value}
                    </dt>
                    <dd className="text-body-xs leading-[1.5] text-dim">{fact.label}</dd>
                  </div>
                ))}
              </dl>

              <Button
                href="/open-source"
                variant="secondary"
                size="sm"
                className="mt-7 w-full"
              >
                Licence and source
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      <CtaBandSlim />
    </>
  );
}
