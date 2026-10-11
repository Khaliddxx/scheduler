import type { Metadata } from 'next';
import { brand, registerUrl, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { Section, SectionHeading } from '@/components/ui/section';
import { CtaBandSlim } from '@/components/sections/cta-band';
import { PlugsMock } from '@/components/visuals';
import { DEV, GUARDRAILS, SAMPLES, SAMPLE_NOTICE, SURFACES } from '@/content/developers';

/**
 * /developers
 *
 * A Server Component; nothing on this route needs client JavaScript.
 *
 * Four surfaces, each paired with either a code sample or an illustration, in
 * alternating columns. The pairing is fixed here rather than in content because
 * it is a layout decision: the content module owns the words, this file owns
 * which side of the page they sit on.
 *
 * Every sample is labelled illustrative, in the content and again above the
 * samples, and none of them asserts an exact endpoint path as a published
 * contract. See the note at the top of src/content/developers.ts.
 */

export const metadata: Metadata = {
  title: 'API, webhooks and automation',
  description: DEV.description,
  alternates: { canonical: '/developers' },
  openGraph: {
    title: `${DEV.title} — ${brand.name}`,
    description: DEV.description,
    url: siteUrl('/developers'),
    type: 'website',
  },
};

/** Which illustration or sample sits beside each surface. */
const sampleFor: Record<string, string | undefined> = {
  rest: 'curl',
  mcp: 'mcp',
  cli: 'cli',
};

export default function DevelopersPage() {
  return (
    <>
      <PageHeader eyebrow={DEV.eyebrow} title={DEV.title} body={DEV.body}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={registerUrl()} external withChevron className="w-full sm:w-auto">
            Get an API key
          </Button>
          <Button href="/docs" variant="secondary" className="w-full sm:w-auto">
            Read the docs
          </Button>
        </div>
      </PageHeader>

      <Section tight>
        <div className="shell">
          <p className="max-w-[80ch] border-l-2 border-primary pl-5 text-body-sm leading-[1.65] text-dim">
            {SAMPLE_NOTICE}
          </p>

          <div className="mt-14 flex flex-col gap-16 sm:gap-20">
            {SURFACES.map((surface, i) => {
              const sampleId = sampleFor[surface.id];
              const sample = SAMPLES.find((s) => s.id === sampleId);

              return (
                <section
                  key={surface.id}
                  id={surface.id}
                  className="grid scroll-mt-28 items-start gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <div className={i % 2 === 1 ? 'lg:order-last' : undefined}>
                    <span className="eyebrow">{surface.eyebrow}</span>
                    <h2 className="mt-5 max-w-[22ch] font-display text-[27px] font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-heading-md">
                      {surface.title}
                    </h2>
                    <p className="mt-4 max-w-[54ch] text-body-md text-muted">{surface.body}</p>

                    <ul className="mt-6 flex flex-col gap-3">
                      {surface.points.map((point) => (
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

                  {sample ? (
                    <CodeBlock
                      label={sample.label}
                      language={sample.language}
                      code={sample.code}
                      className="min-w-0"
                    />
                  ) : (
                    <div className="card min-w-0 p-5 sm:p-6">
                      <PlugsMock />
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            align="left"
            eyebrow={GUARDRAILS.eyebrow}
            title={GUARDRAILS.title}
            body={GUARDRAILS.body}
          />

          <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2">
            {GUARDRAILS.items.map((item) => (
              <li key={item.title} className="card flex flex-col gap-2.5 p-6 sm:p-7">
                <h3 className="font-display text-body-lg font-bold text-white">{item.title}</h3>
                <p className="text-body-sm leading-[1.6] text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBandSlim />
    </>
  );
}
