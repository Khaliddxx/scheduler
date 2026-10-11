import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/ui/section';
import { CtaBandSlim } from '@/components/sections/cta-band';
import {
  CHOOSE_INSTEAD,
  COMPARE,
  OUR_CASE,
  VERDICT_LABELS,
  columns,
  rows,
  type Verdict,
} from '@/content/compare';

/**
 * /compare
 *
 * A Server Component.
 *
 * Compared against CATEGORIES, never named competitors, and with no invented
 * numbers about anyone else's product — the reasoning is at the top of
 * src/content/compare.ts and it is a legal position, not a stylistic one. If a
 * row here ever acquires a specific claim about a named rival, it needs
 * substantiation on file before it ships.
 *
 * The table is a real table: `<caption>`, `scope="col"` on the category headers,
 * `scope="row"` on each dimension. It scrolls inside its own panel, bounded by
 * `.shell`, so the page itself never scrolls sideways at 390px.
 *
 * The verdict dot is decoration. Its meaning is carried by visually hidden text in
 * the same cell, so a screen reader hears "Limitation" rather than nothing, and
 * the cell's sentence is doing the real work either way.
 */

export const metadata: Metadata = {
  title: 'How we compare',
  description: COMPARE.description,
  alternates: { canonical: '/compare' },
  openGraph: {
    title: `${COMPARE.title} — ${brand.name}`,
    description: COMPARE.description,
    url: siteUrl('/compare'),
    type: 'website',
  },
};

const DOT: Record<Verdict, string> = {
  strong: 'bg-accent',
  mixed: 'bg-white/40',
  weak: 'bg-transparent shadow-hairline-strong',
};

function VerdictDot({ verdict }: { verdict: Verdict }) {
  return (
    <>
      <span
        aria-hidden
        className={`mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full ${DOT[verdict]}`}
      />
      <span className="sr-only">{VERDICT_LABELS[verdict]}: </span>
    </>
  );
}

export default function ComparePage() {
  return (
    <>
      <PageHeader eyebrow={COMPARE.eyebrow} title={COMPARE.title} body={COMPARE.body} />

      <Section tight>
        <div className="shell">
          <div className="card-lg overflow-hidden">
            <div className="scrollbar-slim overflow-x-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
                <caption className="sr-only">
                  {brand.name} compared with big incumbent suites, lightweight creator tools
                  and self-hosting, across {rows.length} dimensions
                </caption>

                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 z-20 w-[220px] min-w-[220px] border-b border-line bg-bgInner px-5 py-5 align-bottom text-eyebrow uppercase text-dim"
                    >
                      Dimension
                    </th>

                    {columns.map((column) => (
                      <th
                        key={column.id}
                        scope="col"
                        className="min-w-[200px] border-b border-line bg-bgInner px-5 py-5 align-bottom"
                      >
                        <span
                          className={
                            column.emphasis
                              ? 'block font-display text-body-sm font-bold text-accent'
                              : 'block font-display text-body-sm font-semibold text-white'
                          }
                        >
                          {column.name}
                        </span>
                        <span className="mt-1 block text-body-xs leading-[1.4] text-dim">
                          {column.note}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.dimension}>
                      <th
                        scope="row"
                        className="sticky left-0 z-10 border-b border-line bg-bgInner px-5 py-5 align-top font-normal"
                      >
                        <span className="block text-body-sm leading-[1.4] text-white">
                          {row.dimension}
                        </span>
                        {row.hint ? (
                          <span className="mt-1.5 block max-w-[34ch] text-body-xs leading-[1.45] text-dim">
                            {row.hint}
                          </span>
                        ) : null}
                      </th>

                      {columns.map((column) => {
                        const cell = row.cells[column.id];
                        return (
                          <td
                            key={column.id}
                            className="border-b border-line px-5 py-5 align-top"
                          >
                            <span className="flex gap-2.5">
                              <VerdictDot verdict={cell.verdict} />
                              <span className="text-body-xs leading-[1.6] text-muted">
                                {cell.text}
                              </span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend for the dots, so the colour means something to a sighted reader
              as well as to a screen reader. */}
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {(['strong', 'mixed', 'weak'] as Verdict[]).map((verdict) => (
              <li key={verdict} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT[verdict]}`}
                />
                <span className="text-body-xs text-dim">{VERDICT_LABELS[verdict]}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading
            align="left"
            eyebrow={CHOOSE_INSTEAD.eyebrow}
            title={CHOOSE_INSTEAD.title}
            body={CHOOSE_INSTEAD.body}
          />

          <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3">
            {CHOOSE_INSTEAD.items.map((item) => {
              const column = columns.find((c) => c.id === item.columnId);

              return (
                <article key={item.columnId} className="card flex flex-col gap-4 p-6 sm:p-7">
                  {column ? (
                    <span className="text-eyebrow uppercase text-dim">{column.name}</span>
                  ) : null}

                  <h3 className="font-display text-body-lg font-bold leading-[1.3] text-white">
                    {item.title}
                  </h3>
                  <p className="text-body-sm leading-[1.6] text-muted">{item.body}</p>

                  <ul className="mt-auto flex flex-col gap-2.5 border-t border-separator pt-5">
                    {item.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 40)} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-white/40"
                        />
                        <span className="text-body-xs leading-[1.6] text-dim">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </Section>

      <Section tight>
        <div className="shell">
          {/* The one gradient element on this page. */}
          <div className="panel-brand p-7 sm:p-10 lg:p-12">
            <span className="eyebrow">{OUR_CASE.eyebrow}</span>
            <h2 className="mt-5 max-w-[28ch] font-display text-[27px] font-bold leading-[1.15] tracking-[-0.01em] text-white sm:text-heading-md">
              {OUR_CASE.title}
            </h2>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:gap-x-10">
              {OUR_CASE.bullets.map((bullet) => (
                <li key={bullet.slice(0, 40)} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"
                  />
                  <span className="text-body-sm leading-[1.6] text-white/80">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/pricing" withChevron className="w-full sm:w-auto">
                See pricing
              </Button>
              <Button
                href="/open-source"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Or self-host it instead
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <CtaBandSlim />
    </>
  );
}
