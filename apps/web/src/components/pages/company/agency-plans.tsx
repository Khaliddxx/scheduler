'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { PillLink } from './primitives';

/**
 * The plans block of /agencies, laid out like the reference's enterprise
 * pricing: heading and lead on the left, a Monthly / Yearly switch on the
 * right, then a table from 1024px (highlighted column with a violet wash) and
 * stacked cards below that. The switch changes the prices instantly, as the
 * reference's does; there is no animation to reproduce.
 *
 * Everything arrives pre-formatted from the server so this file holds no
 * pricing logic of its own.
 */

export interface AgencyPlanColumn {
  id: string;
  name: string;
  monthly: string;
  yearly: string;
  /** Quoted plans show their label in place of a price and drop the "/mo". */
  quoted: boolean;
  cta: string;
  href: string;
  highlight?: boolean;
}

export interface AgencyPlanRow {
  label: string;
  /** One value per column, in column order. */
  values: string[];
}

type Period = 'monthly' | 'yearly';

function Price({ column, period, size }: { column: AgencyPlanColumn; period: Period; size: 'lg' }) {
  return (
    <span className={cn('font-jakarta font-bold', size === 'lg' && 'text-[32px]')}>
      {period === 'monthly' ? column.monthly : column.yearly}
      {column.quoted ? null : <span className="text-[14px] font-normal">/mo</span>}
    </span>
  );
}

function Cta({ column }: { column: AgencyPlanColumn }) {
  return (
    <PillLink
      href={column.href}
      className={cn(
        'flex h-fit w-full items-center justify-center gap-[6px] whitespace-nowrap rounded-full px-6 py-3 text-[16px] font-[500] leading-[20.83px] transition-all',
        column.highlight
          ? 'bg-white text-black hover:bg-pink hover:text-white'
          : 'border border-white text-white hover:border-pink',
      )}
    >
      {column.cta}
    </PillLink>
  );
}

export function AgencyPlans({
  title,
  lead,
  note,
  columns,
  rows,
}: {
  title: string;
  lead: string;
  /** Paragraphs under the table. */
  note: string[];
  columns: AgencyPlanColumn[];
  rows: AgencyPlanRow[];
}) {
  const [period, setPeriod] = useState<Period>('monthly');

  const toggle = (value: Period, label: string) => (
    <button
      type="button"
      onClick={() => setPeriod(value)}
      aria-pressed={period === value}
      className={cn(
        'w-20 rounded-lg px-3 py-2.5 sm:w-[86px]',
        period === value ? 'bg-white' : 'bg-black',
      )}
    >
      <span
        className={cn(
          'block text-sm font-medium leading-[18.23px] sm:text-base sm:leading-[20.83px]',
          period === value ? 'text-black' : 'text-[#D1D1D1]',
        )}
      >
        {label}
      </span>
    </button>
  );

  return (
    <section className="section-pz w-full space-y-[40px] px-5">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 lg:flex-row lg:items-end lg:gap-0">
        <div className="flex flex-col gap-4">
          <h2 className="h2-pz lg:text-left">{title}</h2>
          <p className="max-w-[560px] text-[18px] font-[400] leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px] lg:text-left">
            {lead}
          </p>
        </div>
        <div
          role="group"
          aria-label="Billing period"
          className="shrink-0 rounded-[10px] border border-white/10 p-1 sm:rounded-xl sm:p-1.5"
        >
          {toggle('monthly', 'Monthly')}
          {toggle('yearly', 'Yearly')}
        </div>
      </div>

      {/* Phones and tablets: one card per plan. */}
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-4 lg:hidden">
        {columns.map((column, c) => (
          <div
            key={column.id}
            className={cn(
              'rounded-[16px] border border-white/10 p-5',
              column.highlight ? 'bg-gradient-to-br from-[#682EE1] to-[#2A0772]' : 'bg-[#1A1919]',
            )}
          >
            <div className="mb-4">
              <p className="font-jakarta text-[18px] font-semibold">{column.name}</p>
              <p>
                <Price column={column} period={period} size="lg" />
              </p>
            </div>
            <dl className="mb-4 space-y-2 text-[14px]">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4">
                  <dt className="text-[#d1d1d1]">{row.label}</dt>
                  <dd className="text-right">{row.values[c]}</dd>
                </div>
              ))}
            </dl>
            <Cta column={column} />
          </div>
        ))}
      </div>

      {/* From 1024px: the table. */}
      <div className="mx-auto hidden w-full max-w-[1200px] lg:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">
            {title}: plans compared, prices billed {period === 'monthly' ? 'monthly' : 'yearly'}
          </caption>
          <thead>
            <tr>
              <th className="border-b border-white/10 p-4 text-left">
                <span className="sr-only">Plan</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'border-b border-white/10 p-4',
                    column.highlight && 'rounded-t-[16px] bg-gradient-to-b from-[#682EE1] to-transparent',
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-jakarta text-[20px] font-semibold">{column.name}</span>
                    <Price column={column} period={period} size="lg" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="border-b border-white/5 p-4 text-left font-normal text-[#d1d1d1]"
                >
                  {row.label}
                </th>
                {row.values.map((value, c) => (
                  <td
                    key={columns[c]?.id ?? c}
                    className={cn(
                      'border-b border-white/5 p-4 text-center',
                      columns[c]?.highlight && 'bg-[#682EE1]/10',
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4" />
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn('p-4', column.highlight && 'rounded-b-[16px] bg-[#682EE1]/10')}
                >
                  <Cta column={column} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mx-auto max-w-[600px] space-y-4 text-center text-[16px] leading-[20.83px] text-[#d1d1d1]">
        {note.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
