/* eslint-disable @next/next/no-img-element -- static decorative SVGs from /public need no optimisation pass */
import type { Metadata } from 'next';
import { brand, registerUrl, siteUrl } from '@scheduler/brand';
import { Mark } from '@/components/ui/logo';
import { ComparePicker } from '@/components/pages/company/compare-picker';
import {
  CompanyPage,
  LEAD,
  OUTLINE_PILL,
  PillLink,
  StartPill,
} from '@/components/pages/company/primitives';
import { cn } from '@/lib/cn';
import { TRIAL_DAYS } from '@/content/pricing';
import {
  CHOOSE_INSTEAD,
  COMPARE,
  OUR_CASE,
  VERDICT_LABELS,
  columns,
  rows,
  type ColumnId,
  type Verdict,
} from '@/content/compare';

/**
 * /compare
 *
 * A Server Component; only the gradient picker pill is client code.
 *
 * The top half is the reference's comparison index: an opener with a
 * hand-underlined word, then "<us> vs. the rest" over a grid of link cards.
 * The reference links each card to a page per named rival; we compare against
 * three CATEGORIES, never named competitors (the reasoning is at the top of
 * src/content/compare.ts, and it is a legal position, not a stylistic one), so
 * the cards jump to sections on this page. Those sections borrow the
 * reference's per-comparison layout: a plan-style table with our column
 * highlighted (cards on phones), tick-list cards, and a solid violet band.
 *
 * The table is a real table: `<caption>`, `scope="col"` on the category headers,
 * `scope="row"` on each dimension. The verdict icon is decoration; its meaning
 * is carried by visually hidden text in the same cell.
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

/** Decorative category icons. */
const ICON: Record<ColumnId, string> = {
  us: '',
  suite: '🏢',
  light: '🪶',
  self: '🛠️',
};

const rivals = columns.filter((c) => c.id !== 'us');

/** The word in the title that gets the hand-drawn underline. */
const UNDERLINED = 'ways';

function Title() {
  const at = COMPARE.title.indexOf(` ${UNDERLINED} `);
  if (at < 0) return <>{COMPARE.title}</>;
  return (
    <>
      {COMPARE.title.slice(0, at)}{' '}
      <span className="relative">
        {UNDERLINED}
        <img
          alt=""
          aria-hidden="true"
          width={340}
          height={25}
          className="absolute -bottom-4 -right-4 h-[14px] w-[140px] sm:-bottom-6 sm:-right-10 sm:h-[20px] sm:w-[220px]"
          src="/preview/company/header-line.svg"
        />
      </span>{' '}
      {COMPARE.title.slice(at + UNDERLINED.length + 2)}
    </>
  );
}

/** Tick, dash or hollow ring in the reference's 24px chip. Nothing is a cross. */
function VerdictIcon({ verdict }: { verdict: Verdict }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="mt-px flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-white/5"
      >
        {verdict === 'strong' ? (
          <img alt="" width={11} height={8} className="h-2 w-[11px]" src="/preview/company/tick.svg" />
        ) : verdict === 'mixed' ? (
          <span className="h-[2px] w-[10px] rounded-full bg-[#F5B841]" />
        ) : (
          <span className="h-[10px] w-[10px] rounded-full border-[1.5px] border-white/40" />
        )}
      </span>
      <span className="sr-only">{VERDICT_LABELS[verdict]}: </span>
    </>
  );
}

/** Section heading at the size of the reference's comparison-page headings. */
const H2 = 'h2-pz !text-[28px] !leading-[32px] sm:!text-[40px] sm:!leading-[44px]';
const CELL_TEXT = 'font-dm text-[15px] leading-[22px] text-[#D1D1D1] min-[1024px]:text-[16px] min-[1024px]:leading-[24px]';

export default function ComparePage() {
  return (
    <CompanyPage>
      {/* Opener. The reference opens 120px / 200px below the top of the
          document; the root layout's 60px / 81px header spacer is already above. */}
      <section className="section-pz w-full !pt-[60.36px] sm:!pt-[119px]">
        <div className="max-w-[700px] space-y-8 sm:space-y-10">
          <h1 className="h1-pz [text-wrap:balance]">
            <Title />
          </h1>
          <p className={cn(LEAD, 'text-center')}>{COMPARE.body}</p>
          <div className="flex justify-center">
            <StartPill href={registerUrl()}>Start a {TRIAL_DAYS}-day free trial</StartPill>
          </div>
        </div>
        {/* Against the page, not the section, as in the reference. */}
        <img alt="" aria-hidden="true" width={138} height={226} className="absolute left-0 top-[375px] hidden lg:block" src="/preview/company/left-tornado.svg" />
        <img alt="" aria-hidden="true" width={119} height={133} className="absolute right-0 top-[178.9px] hidden lg:block" src="/preview/company/right-tornado.svg" />
        <img alt="" aria-hidden="true" width={50} height={88} className="absolute left-0 top-[360px] block lg:hidden" src="/preview/company/left-tornado-mob.svg" />
        <img alt="" aria-hidden="true" width={25} height={59} className="absolute right-0 top-[67px] block lg:hidden" src="/preview/company/right-tornado-mob.svg" />
      </section>

      {/* Index: "<us> vs. the rest" over a grid of link cards. */}
      <section className="section-pz w-full">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <ComparePicker
            logo={<Mark className="!h-6 !w-6 !rounded-[8px] !text-[13px] sm:!h-7 sm:!w-7 sm:!text-[15px]" />}
            name={brand.name}
            items={[
              { label: 'Dimension by dimension', href: '#table' },
              ...rivals.map((c) => ({ label: `vs. ${c.name}`, href: `#${c.id}` })),
              { label: `When ${brand.name} fits`, href: '#our-case' },
            ]}
          />
          <h2 className="h2-pz !text-[20px] !leading-[26px] sm:!text-[28px] sm:!leading-[36px]">
            vs. the rest
          </h2>
        </div>
        <p className={cn(LEAD, 'mb-8 mt-4 text-center sm:mb-12')}>
          Three other ways to get posts out, and where each one wins.
        </p>
        <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 min-[1024px]:grid-cols-3">
          {rivals.map((column) => (
            <li key={column.id} className="flex">
              <a
                href={`#${column.id}`}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-[#1A1919] p-5 transition-all hover:border-white/20 sm:rounded-[20px] sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#242323] p-1.5 text-[22px] sm:h-12 sm:w-12 sm:text-[26px]"
                >
                  {ICON[column.id]}
                </span>
                <span className="min-w-0 flex-1 text-[18px] font-bold leading-[23px] sm:text-[22px] sm:leading-[28px]">
                  vs. {column.name}
                </span>
                <span aria-hidden="true" className="shrink-0 text-[20px] text-[#a070e8]">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* The full comparison. */}
      <section id="table" className="section-pz w-full scroll-mt-24 pb-[30px] max-[1023px]:pt-[30px] sm:pb-[30px]">
        <h2 className={cn(H2, 'mb-6 min-[1024px]:mb-10')}>Dimension by dimension</h2>

        {/* Phones and tablets: a card per dimension. */}
        <div className="flex w-full flex-col gap-2 lg:hidden">
          {rows.map((row) => (
            <div key={row.dimension} className="rounded-2xl border border-white/5 bg-[#1A1919] px-5 py-7">
              <h3 className="font-jakarta text-[20px] font-bold leading-[26px]">{row.dimension}</h3>
              {row.hint ? <p className="mt-1 text-[14px] leading-[20px] text-[#A8A8A8]">{row.hint}</p> : null}
              <dl className="mt-5 space-y-4">
                {columns.map((column) => {
                  const cell = row.cells[column.id];
                  return (
                    <div key={column.id}>
                      <dt
                        className={cn(
                          'text-[13px] font-semibold uppercase tracking-wide',
                          column.emphasis ? 'text-[#B491FF]' : 'text-[#A8A8A8]',
                        )}
                      >
                        {column.name}
                      </dt>
                      <dd className="mt-1.5 flex items-start gap-3">
                        <VerdictIcon verdict={cell.verdict} />
                        <span className={CELL_TEXT}>{cell.text}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        {/* From 1024px: the table, our column washed violet like the reference's highlighted plan. */}
        <div className="hidden w-full lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {brand.name} compared with big incumbent suites, lightweight creator tools and
              self-hosting, across {rows.length} dimensions
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[220px] border-b border-white/10 p-4 align-bottom text-[14px] font-normal text-[#A8A8A8]">
                  Dimension
                </th>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn(
                      'border-b border-white/10 p-4 align-bottom',
                      column.emphasis && 'rounded-t-[16px] bg-gradient-to-b from-[#682EE1] to-transparent',
                    )}
                  >
                    <span className="block font-jakarta text-[20px] font-semibold leading-[26px]">{column.name}</span>
                    <span className="mt-1 block text-[14px] font-normal leading-[20px] text-[#d1d1d1]">{column.note}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row.dimension}>
                  <th scope="row" className="border-b border-white/5 p-4 align-top font-normal">
                    <span className="block text-[16px] leading-[22px] text-white">{row.dimension}</span>
                    {row.hint ? (
                      <span className="mt-1.5 block text-[14px] leading-[20px] text-[#A8A8A8]">{row.hint}</span>
                    ) : null}
                  </th>
                  {columns.map((column) => {
                    const cell = row.cells[column.id];
                    return (
                      <td
                        key={column.id}
                        className={cn(
                          'border-b border-white/5 p-4 align-top',
                          column.emphasis && 'bg-[#682EE1]/10',
                          column.emphasis && r === rows.length - 1 && 'rounded-b-[16px] border-b-0',
                        )}
                      >
                        <span className="flex items-start gap-3">
                          <VerdictIcon verdict={cell.verdict} />
                          <span className={CELL_TEXT}>{cell.text}</span>
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend, so the icons mean something to a sighted reader too. */}
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {(['strong', 'mixed', 'weak'] as Verdict[]).map((verdict) => (
            <li key={verdict} className="flex items-center gap-2.5">
              <VerdictIcon verdict={verdict} />
              <span aria-hidden="true" className="text-[14px] text-[#A8A8A8]">
                {VERDICT_LABELS[verdict]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* When one of the others wins. */}
      <section className="section-pz w-full pb-[30px] max-[1023px]:pt-[30px] sm:pb-[30px]">
        <h2 className={cn(H2, 'mb-4')}>{CHOOSE_INSTEAD.title}</h2>
        <p className="mx-auto mb-6 max-w-[720px] text-center font-dm text-[16px] leading-[24px] text-[#d1d1d1] sm:text-[18px] sm:leading-[27px] min-[1024px]:mb-10">
          {CHOOSE_INSTEAD.body}
        </p>
        <div className="grid w-full gap-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-3">
          {CHOOSE_INSTEAD.items.map((item) => {
            const column = columns.find((c) => c.id === item.columnId);
            return (
              <article
                key={item.columnId}
                id={item.columnId}
                className="flex scroll-mt-24 flex-col gap-6 rounded-2xl border border-white/5 bg-[#1A1919] px-5 py-7 min-[1024px]:rounded-[20px] min-[1024px]:p-8"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#242323] p-1.5 text-[20px]">
                    {ICON[item.columnId]}
                  </span>
                  <p className="font-jakarta text-[20px] font-bold leading-[26px] text-white min-[1024px]:text-[24px] min-[1024px]:leading-[30px]">
                    {column?.name}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-jakarta text-[18px] font-bold leading-[24px] text-white min-[1024px]:text-[20px] min-[1024px]:leading-[26px]">
                    {item.title}
                  </h3>
                  <p className={CELL_TEXT}>{item.body}</p>
                </div>
                <ul className="mt-auto space-y-2.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 40)} className="flex items-start gap-3">
                      <VerdictIcon verdict="strong" />
                      <span className={CELL_TEXT}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* And when we are the right answer: the reference's closing violet band. */}
      <section id="our-case" className="section-pz w-full scroll-mt-24 pt-[100px] min-[1024px]:pt-[140px]">
        <div className="flex w-full flex-col items-start justify-between gap-10 rounded-[20px] bg-[#3C1AC9] px-[20px] py-10 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:p-[60px]">
          <div className="min-[1024px]:w-[754px]">
            <p className="mb-4 text-[12px] font-bold leading-[13.2px] min-[1024px]:mb-6 min-[1024px]:text-[22px] min-[1024px]:leading-[24.2px]">
              {OUR_CASE.eyebrow}
            </p>
            <h2 className="mb-[20px] text-left font-jakarta text-[30px] font-bold leading-[33px] min-[1024px]:mb-8 min-[1024px]:text-[48px] min-[1024px]:leading-[52.8px]">
              {OUR_CASE.title}
            </h2>
            <ul className="space-y-2.5">
              {OUR_CASE.bullets.map((bullet) => (
                <li key={bullet.slice(0, 40)} className="flex items-start gap-3">
                  <VerdictIcon verdict="strong" />
                  <span className="text-[16px] leading-[22px] text-white min-[1024px]:text-[18px] min-[1024px]:leading-[26px]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex flex-col items-start gap-4 min-[1024px]:items-center">
            <img alt="" aria-hidden="true" width={101} height={74} className="hidden min-[1024px]:block" src="/preview/company/cta-doodle-right.svg" />
            <StartPill href="/pricing">See pricing</StartPill>
            <PillLink href="/open-source" className={OUTLINE_PILL}>
              Or self-host it instead
            </PillLink>
          </div>
        </div>
      </section>
    </CompanyPage>
  );
}
