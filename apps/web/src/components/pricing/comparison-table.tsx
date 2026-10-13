'use client';

import { useId, useState } from 'react';
import { registerUrl } from '@scheduler/brand';
import { cn } from '@/lib/cn';
import { BillingToggle } from '@/components/pricing/billing-toggle';
import { Cross, InfinityMark, InfoCircle, Tick } from '@/components/pricing/glyphs';
import { PillLink } from '@/components/pricing/pill-link';
import { CONTACT_HREF, QUOTED_NOTE, QUOTED_PRICE, RIBBON, TABLE } from '@/components/pricing/copy';
import { isQuoted, money } from '@/components/pricing/price';
import {
  comparisonMatrix,
  plans,
  priceFor,
  type BillingPeriod,
  type Cell,
  type MatrixRow,
  type Plan,
} from '@/content/pricing';

/**
 * The feature comparison, laid out as the reference's: not a <table> but a
 * 200px label column beside a four-column grid of rounded #1A1919 cells.
 *
 * From 1024px: a header row (a "Plans:" note and its own billing switch on the
 * left, one column card per plan on the right; the popular plan's card is the
 * purple gradient with a "Popular" pill), then one row per feature with a cell
 * per plan. Ticks are green, crosses red, "Unlimited" is an infinity sign.
 *
 * Below 1024px the column cards shrink to four 63px tabs and every row shows only
 * the selected plan's cell next to the label (each 50% wide). Tapping a tab
 * selects its plan; the selected tab takes the gradient. Nothing is wider than
 * the screen, so the page never scrolls sideways.
 *
 * The rows come straight from `comparisonMatrix`; its section titles head each
 * group in the same type as the "Plans:" note. A row's `hint` becomes the
 * reference's tooltip (shown on hover and on keyboard focus of its info button).
 *
 * The billing switch here is independent of the one above the plan cards, as on
 * the reference.
 */

const SOLO_ROW = 'Team members';

/** A plan has a single seat when the matrix says its "Team members" value is 1. */
const isSolo = (plan: Plan): boolean =>
  comparisonMatrix.some((s) => s.rows.some((r) => r.label === SOLO_ROW && r.values[plan.id] === 1));

function CellValue({ value }: { value: Cell | undefined }) {
  // An absent key is treated exactly like `false`.
  if (value === undefined || value === false) {
    return (
      <>
        <Cross />
        <span className="sr-only">{TABLE.notIncluded}</span>
      </>
    );
  }
  if (value === true) {
    return (
      <>
        <Tick />
        <span className="sr-only">{TABLE.included}</span>
      </>
    );
  }
  if (value === 'Unlimited') {
    return (
      <>
        <InfinityMark />
        <span className="sr-only">{TABLE.unlimited}</span>
      </>
    );
  }
  return <span className="text-center leading-[22px]">{value}</span>;
}

function ValueCell({ plan, value }: { plan: Plan; value: Cell | undefined }) {
  return (
    <div className="flex min-h-[54px] items-center justify-center rounded-lg bg-[#1A1919] p-3 text-[18px] font-normal text-white">
      <span className="sr-only">{plan.name}: </span>
      <CellValue value={value} />
    </div>
  );
}

function ColumnCard({
  plan,
  period,
  active,
  onSelect,
}: {
  plan: Plan;
  period: BillingPeriod;
  active: boolean;
  onSelect: () => void;
}) {
  const quoted = isQuoted(plan);
  const popular = plan.popular === true;
  const note = quoted ? null : TABLE.period[period];

  return (
    <div
      className={cn(
        'relative flex h-[63px] flex-col items-center justify-around rounded-[10px] border border-white/10 bg-[#1A1919] from-[#682EE1] to-[#2A0772] p-0',
        'min-[1024px]:block min-[1024px]:h-full min-[1024px]:w-full min-[1024px]:items-start min-[1024px]:rounded-[20px] min-[1024px]:p-3 min-[1440px]:p-5',
        popular && 'min-[1024px]:bg-gradient-to-bl',
        active && 'max-[1023px]:bg-gradient-to-bl',
      )}
    >
      <p className="font-jakarta text-[12px] font-medium leading-[10px] min-[1024px]:text-[20px] min-[1024px]:leading-[22px]">
        {plan.name}
      </p>
      <p className="font-jakarta text-[13px] font-semibold leading-[12px] md:my-3 min-[1024px]:text-[30px] min-[1024px]:leading-[33px]">
        {quoted ? QUOTED_PRICE : money(priceFor(plan, period), plan.currency)}
      </p>
      <p className="text-[11px] leading-[11px] text-[#D1D1D1] min-[1024px]:hidden">
        <span>{note ? note.short : QUOTED_NOTE}</span>
      </p>
      <p className="mb-6 hidden text-[#D1D1D1] min-[1024px]:block min-[1024px]:text-[14px] min-[1024px]:leading-[15.4px] min-[1440px]:text-[16px] min-[1440px]:leading-[17.6px]">
        <span>{note ? note.long : QUOTED_NOTE}</span>
      </p>
      <div className="hidden justify-center min-[1024px]:flex">
        <PillLink
          href={quoted ? CONTACT_HREF : registerUrl()}
          variant={popular ? 'primary' : 'secondary'}
          size="compact"
        >
          {plan.cta}
          <span className="sr-only">, {plan.name} plan</span>
        </PillLink>
      </div>
      {isSolo(plan) ? (
        <p className="mt-3 hidden text-[12px] leading-[14px] text-[#FF6B6B] min-[1024px]:block">
          {TABLE.soloNote}
        </p>
      ) : null}
      {popular ? (
        <div className="absolute right-4 top-4 hidden min-[1024px]:block">
          <div className="w-fit rounded-full bg-white/20 px-4 py-2">
            <p className="text-[14px] leading-[18.23px]">{RIBBON}</p>
          </div>
        </div>
      ) : null}

      {/* Below 1024px the whole card is a tab that picks the plan shown in the rows. */}
      <button
        type="button"
        aria-pressed={active}
        aria-label={TABLE.showPlan(plan.name)}
        onClick={onSelect}
        className="absolute inset-0 rounded-[10px] min-[1024px]:hidden"
      />
    </div>
  );
}

function RowLabel({ row }: { row: MatrixRow }) {
  const tipId = useId();
  return (
    <div className="group relative w-[50%] text-[18px] min-[1024px]:w-[200px]">
      <span className="flex items-center gap-1.5">
        {row.label}
        {row.hint ? (
          <button
            type="button"
            aria-describedby={tipId}
            className="cursor-help rounded-full"
          >
            <InfoCircle />
            <span className="sr-only">{TABLE.moreAbout(row.label)}</span>
          </button>
        ) : null}
      </span>
      {row.hint ? (
        <div
          id={tipId}
          role="tooltip"
          className="invisible absolute bottom-full left-0 z-50 mb-2 w-64 rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm text-white opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        >
          {row.hint}
          <div className="absolute left-4 top-full h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
        </div>
      ) : null}
    </div>
  );
}

function FeatureRow({ row, activeId }: { row: MatrixRow; activeId: string }) {
  const active = plans.find((p) => p.id === activeId) ?? plans[0];
  return (
    <div className="flex w-full items-center justify-between gap-5">
      <RowLabel row={row} />
      <div className="hidden grid-cols-4 gap-1 lg:grid min-[1024px]:w-[calc(100%-200px)]">
        {plans.map((plan) => (
          <ValueCell key={plan.id} plan={plan} value={row.values[plan.id]} />
        ))}
      </div>
      <div className="grid w-[50%] grid-cols-1 lg:hidden">
        <ValueCell plan={active} value={row.values[active.id]} />
      </div>
    </div>
  );
}

export function ComparisonTable() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  const [activeId, setActiveId] = useState<string>(plans[0].id);

  return (
    <div className="mt-8 flex w-full flex-col gap-6 min-[1024px]:mt-[60px]">
      <div className="flex w-full flex-col items-center gap-5 min-[1024px]:flex-row">
        <div className="flex w-full flex-col gap-6 min-[1024px]:w-[200px]">
          <div className="hidden flex-col gap-3 min-[1024px]:flex">
            <h3 className="text-xl font-bold text-white">{TABLE.plansLabel}</h3>
            <p className="text-xl font-normal leading-[26.04px] text-[#D1D1D1]">{TABLE.saveNote}</p>
          </div>
          <BillingToggle
            period={period}
            onChange={setPeriod}
            className="w-full justify-center gap-2 sm:rounded-xl"
          />
        </div>
        <div className="grid w-full grid-cols-4 gap-1 min-[1024px]:w-[calc(100%-200px)] min-[1440px]:w-[1100px]">
          {plans.map((plan) => (
            <ColumnCard
              key={plan.id}
              plan={plan}
              period={period}
              active={plan.id === activeId}
              onSelect={() => setActiveId(plan.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        {comparisonMatrix.map((section, i) => (
          <div key={section.title} className="contents">
            <h3
              className={cn(
                'w-full pb-2 text-xl font-bold text-white',
                i === 0 ? 'pt-0' : 'pt-6',
              )}
            >
              {section.title}
            </h3>
            {section.rows.map((row) => (
              <FeatureRow key={row.label} row={row} activeId={activeId} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
