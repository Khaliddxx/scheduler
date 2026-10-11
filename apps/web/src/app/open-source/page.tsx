import type { Metadata } from 'next';
import { siteUrl } from '@scheduler/brand';
import { OSS, FACTS, SECTIONS } from '@/content/open-source';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { CtaBandSlim } from '@/components/sections/cta-band';

export const metadata: Metadata = {
  title: 'Open source and licence',
  description: OSS.description,
  alternates: { canonical: siteUrl('/open-source') },
};

/**
 * This page is a compliance artifact as much as a marketing one. The footer
 * links here, and the licence expects the source offer to be reachable rather
 * than produced on request — so the facts table and the source link must stay.
 */
export default function OpenSourcePage() {
  return (
    <>
      <PageHeader eyebrow={OSS.eyebrow} title={OSS.title} body={OSS.body} />

      <Section tight>
        <div className="shell">
          <dl className="grid gap-4 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.term} className="card flex flex-col gap-1.5 p-6">
                <dt className="text-eyebrow uppercase text-dim">{f.term}</dt>
                <dd className="font-display text-body-xl font-bold text-white">
                  {f.href ? (
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </dd>
                {f.note ? <p className="text-body-sm text-dim">{f.note}</p> : null}
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section>
        <div className="shell flex max-w-prose flex-col gap-12">
          {SECTIONS.map((s) => (
            <section key={s.heading} id={s.id} className="scroll-mt-28">
              <h2 className="font-display text-heading-md leading-tight text-white">
                {s.heading}
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 text-body-md text-muted">
                  {p}
                </p>
              ))}
              {s.list ? (
                <>
                  {s.list.intro ? (
                    <p className="mt-4 text-body-md text-muted">{s.list.intro}</p>
                  ) : null}
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {s.list.items.map((item) => (
                      <li key={item.slice(0, 40)} className="flex gap-3 text-body-md text-muted">
                        <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ))}
        </div>
      </Section>

      <CtaBandSlim />
    </>
  );
}
