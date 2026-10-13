/* eslint-disable @next/next/no-img-element -- static decorative SVGs from /public need no optimisation pass */
import type { Metadata } from 'next';
import { brand, registerUrl, siteUrl } from '@scheduler/brand';
import { Faq } from '@/components/sections/faq';
import { CompanyHero } from '@/components/pages/company/hero';
import {
  AgencyPlans,
  type AgencyPlanColumn,
  type AgencyPlanRow,
} from '@/components/pages/company/agency-plans';
import {
  CompanyPage,
  OUTLINE_PILL,
  PillLink,
  WHITE_PILL_PLAIN,
} from '@/components/pages/company/primitives';
import { isQuoted, money } from '@/components/pricing/price';
import { QUOTED_PRICE } from '@/components/pricing/copy';
import { cn } from '@/lib/cn';
import {
  AGENCIES,
  CAPABILITIES,
  CAPS,
  CHANNELS_PER_CLIENT,
  CLIENTS_AT_CAP,
  FAQS,
} from '@/content/agencies';
import { comparisonMatrix, plans, TRIAL_DAYS, type Cell } from '@/content/pricing';

/**
 * /agencies
 *
 * A Server Component; only the plan switch is client code.
 *
 * Laid out like the reference's enterprise page: centred opener with two
 * buttons, a framed two-panel diagram, a grid of feature cards, a plans table
 * with a Monthly / Yearly switch, and a solid violet call-to-action band. Our
 * agency FAQ sits between the plans and the band.
 *
 * The diagram is the channel-cap worked example: one client's channels on the
 * left, the Agency plan on the right. Every number in it, and in the plans
 * table, is computed from src/content/pricing.ts and src/content/agencies.ts, so
 * a pricing change cannot leave a stale sum on this page.
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

const agencyPlan = plans.find((p) => p.id === 'agency') ?? plans[plans.length - 1];

/** Decorative card icons, in CAPABILITIES order. */
const ICONS: Record<string, string> = {
  workspaces: '🗂️',
  approvals: '✅',
  reporting: '📊',
  volume: '⚡',
};

/* ------------------------------------------------------------ plans table */

const matrixRow = (label: string) =>
  comparisonMatrix.flatMap((section) => section.rows).find((row) => row.label === label);

const cellText = (cell: Cell | undefined): string => {
  if (cell === true) return 'Included';
  if (cell === false || cell === undefined) return '—';
  return String(cell);
};

const planColumns: AgencyPlanColumn[] = plans.map((plan) => {
  const quoted = isQuoted(plan);
  return {
    id: plan.id,
    name: plan.name,
    monthly: quoted ? QUOTED_PRICE : money(plan.monthly, plan.currency),
    yearly: quoted ? QUOTED_PRICE : money(plan.yearlyMonthly, plan.currency),
    quoted,
    cta: plan.cta,
    href: plan.fulfilment === 'dedicated' ? '/contact' : registerUrl(),
    highlight: plan.id === agencyPlan.id,
  };
});

const ROW_LABELS = [
  'Connected channels',
  'Team members',
  'Approval before publish',
  'Separate client workspaces',
  'White-labelled client reports',
  'Custom domain',
];

const planRows: AgencyPlanRow[] = ROW_LABELS.flatMap((label) => {
  const row = matrixRow(label);
  if (!row) return [];
  const values = plans.map((plan) => cellText(row.values[plan.id]));

  if (label !== 'Connected channels') return [{ label, values }];

  // The cap arithmetic from the copy, as a row: clients of a typical
  // CHANNELS_PER_CLIENT-channel shape that each plan's channel cap covers.
  const clients = plans.map((plan) => {
    const cap = row.values[plan.id];
    return typeof cap === 'number'
      ? String(Math.max(1, Math.floor(cap / CHANNELS_PER_CLIENT)))
      : cellText(cap);
  });
  return [
    { label, values },
    { label: `Clients at ${CHANNELS_PER_CLIENT} channels each`, values: clients },
  ];
});

/* ----------------------------------------------------------------- page */

function Arrow() {
  return (
    <div className="flex shrink-0 items-center justify-center px-4" aria-hidden="true">
      <div className="hidden flex-col items-center gap-2 lg:flex">
        <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
          <path
            d="M99.06 13.06a1.5 1.5 0 0 0 0-2.12l-9.55-9.55a1.5 1.5 0 1 0-2.12 2.12L95.88 12l-8.49 8.49a1.5 1.5 0 1 0 2.12 2.12l9.55-9.55ZM0 13.5h98v-3H0v3Z"
            fill="#682EE1"
          />
        </svg>
        <p className="text-[14px] text-[#d1d1d1]">× {CLIENTS_AT_CAP}</p>
      </div>
      <div className="flex items-center justify-center py-2 lg:hidden">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
          <path
            d="M13.06 39.06a1.5 1.5 0 0 1-2.12 0l-9.55-9.55a1.5 1.5 0 1 1 2.12-2.12L12 35.88l8.49-8.49a1.5 1.5 0 1 1 2.12 2.12l-9.55 9.55ZM13.5 0v38h-3V0h3Z"
            fill="#682EE1"
          />
        </svg>
      </div>
    </div>
  );
}

const CHIP = 'rounded-xl bg-white/20 px-6 py-4 text-[16px] sm:text-[18px]';

export default function AgenciesPage() {
  const example = CAPS.example;

  return (
    <CompanyPage>
      <CompanyHero title={AGENCIES.title} body={AGENCIES.body}>
        <PillLink href="/pricing" className={cn(WHITE_PILL_PLAIN, '!w-full sm:!w-fit')}>
          See agency pricing
        </PillLink>
        <PillLink href="/contact" className={cn(OUTLINE_PILL, '!w-full sm:!w-fit')}>
          Talk about a dedicated instance
        </PillLink>
      </CompanyHero>

      {/* The worked example as the reference's two-panel diagram. */}
      <section className="section-pz w-full px-5 py-[40px] sm:py-[60px]">
        <figure className="mx-auto w-full max-w-[1200px] rounded-[20px] border border-white/10 bg-[#1A1919] p-6 sm:rounded-[32px] sm:p-10">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-8">
            <div className="w-full flex-1">
              <div className="h-full rounded-[20px] bg-gradient-to-br from-[#4A0047] to-[#B611B0] p-8 text-center sm:p-12">
                <p className="mb-3 text-[14px] uppercase tracking-wide opacity-80 sm:text-[16px]">
                  {example.title}
                </p>
                <p className="font-jakarta text-[28px] font-semibold sm:text-[36px]">
                  {example.totalValue}
                </p>
                <ul className="mt-8 space-y-4">
                  {example.rows.map((row) => (
                    <li key={row.label} className={CHIP}>
                      {row.label}
                      <span className="sr-only">: {row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Arrow />

            <div className="w-full flex-1">
              <div className="h-full rounded-[20px] bg-gradient-to-br from-[#682EE1] to-[#2A0772] p-8 text-center sm:p-12">
                <p className="mb-3 text-[14px] uppercase tracking-wide opacity-80 sm:text-[16px]">
                  {agencyPlan.name}
                </p>
                <p className="font-jakarta text-[28px] font-semibold sm:text-[36px]">
                  {agencyPlan.channels} channels
                </p>
                <ul className="mt-8 space-y-4">
                  {agencyPlan.highlights.slice(1, 4).map((item) => (
                    <li key={item} className={CHIP}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <figcaption className="mx-auto mt-6 max-w-[600px] text-center text-[16px] text-[#d1d1d1] sm:mt-8 sm:text-[18px]">
            {example.footnote}
          </figcaption>
        </figure>
      </section>

      {/* Capabilities as the reference's feature cards. */}
      <section className="section-pz w-full space-y-[40px] px-5 sm:space-y-[60px]">
        <h2 className="h2-pz">Built for a book of clients</h2>
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2">
          {CAPABILITIES.map((capability) => (
            <article
              key={capability.id}
              id={capability.id}
              className="flex scroll-mt-28 flex-col gap-4 rounded-[16px] border border-white/10 bg-[#1A1919] p-6 sm:rounded-[20px] sm:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#682EE1] to-[#2A0772] sm:h-14 sm:w-14">
                <span className="text-2xl sm:text-3xl" aria-hidden="true">
                  {ICONS[capability.id] ?? '✳️'}
                </span>
              </div>
              <h3 className="font-jakarta text-[20px] font-semibold leading-[22px] sm:text-[24px] sm:leading-[26.4px]">
                {capability.title}
              </h3>
              <p className="text-[16px] leading-[20.83px] text-[#d1d1d1] sm:text-[18px] sm:leading-[23.44px]">
                {capability.body}
              </p>
              <ul className="space-y-2.5">
                {capability.points.map((point) => (
                  <li key={point.slice(0, 40)} className="flex items-start gap-3">
                    <span className="mt-px flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-white/5">
                      <img alt="" aria-hidden="true" width={11} height={8} className="h-2 w-[11px]" src="/preview/company/tick.svg" />
                    </span>
                    <span className="font-dm text-[15px] leading-[22px] text-[#D1D1D1] min-[1024px]:text-[16px] min-[1024px]:leading-[24px]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <AgencyPlans
        title={CAPS.title}
        lead={CAPS.paragraphs[0]}
        note={CAPS.paragraphs.slice(1)}
        columns={planColumns}
        rows={planRows}
      />

      <div className="w-full">
        <Faq items={FAQS} id="agency-faq" />
      </div>

      {/* Closing band, as the reference's solid violet call to action. */}
      <section className="section-pz w-full sm:px-5">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-10 rounded-none bg-[#682EE1] px-5 py-10 sm:rounded-[20px] sm:p-15 lg:flex-row lg:items-center">
          <div className="space-y-5 sm:space-y-4">
            <h2 className="text-left font-jakarta text-[30px] font-[700] leading-[33px] sm:text-[48px] sm:leading-[52.8px]">
              Bring every client into one calendar
            </h2>
            <p className="max-w-[620px] text-left text-[18px] font-[400] leading-[23.44px] text-white sm:text-[22px] sm:leading-[28.64px]">
              Try the {agencyPlan.name} plan free for {TRIAL_DAYS} days, or talk to us about a
              dedicated instance with your own domain and branding throughout.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:shrink-0">
            <PillLink
              href="/contact"
              className="flex h-fit w-fit items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-pink px-4 py-3 text-[16px] font-[500] leading-[20.83px] text-white transition-all hover:bg-white hover:text-black sm:px-8 sm:py-4 sm:text-[19px] sm:leading-[25px]"
            >
              Talk to us
            </PillLink>
          </div>
        </div>
      </section>
    </CompanyPage>
  );
}
