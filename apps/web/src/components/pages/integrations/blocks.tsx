import type { ReactNode } from 'react';
import Link from 'next/link';
import { getChannel } from '@/content/channels';
import { channelMenuLabels } from '@/content/nav';
import { SocialIcon, channelsInDisplayOrder } from '@/components/ui/social-icon';
import { cn } from '@/lib/cn';
import { accents, accentVars, type Accent } from './accents';
import { CodeWindow } from './code-window';
import { AppTile } from './hero';
import { PzIcon } from './icons';

/**
 * The building blocks of the integration and developer pages, one component
 * per block of the reference template: the bordered sections and their
 * headings, the step cards with a chat or code window, the gradient channel
 * orbit, card grids, tables, prompt cards, the FAQ accordion and the closing
 * band. All server components; only the code window (copy button) and the
 * hero mascot run on the client.
 *
 * Accent colours reach nested blocks through the `--pz-accent*` variables set
 * by `AccentScope`.
 */

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const bodyText = 'text-[16px] leading-[26px] text-[#c4c4c4]';
const panel = 'rounded-[24px] border border-white/10 bg-[#1A1919]';
/** The numbered circle used by step cards, step lists and code steps. */
const numberCircle =
  'flex shrink-0 items-center justify-center rounded-full bg-[var(--pz-accent-tint,rgba(182,156,255,0.08))] ring-1 ring-inset ring-[color:var(--pz-accent-ring,rgba(182,156,255,0.3))] font-jakarta font-bold text-[color:var(--pz-accent,#b69cff)]';

/* ------------------------------------------------------------------ */
/* Section frame                                                       */
/* ------------------------------------------------------------------ */

/** Sets the accent variables for the blocks inside it. The first block's top rule is dropped unless `divider`. */
export function AccentScope({
  accent = 'purple',
  divider = false,
  children,
}: {
  accent?: Accent;
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('w-full break-words', !divider && '[&>section:first-child>div]:border-t-0')}
      style={accentVars(accent)}
    >
      {children}
    </div>
  );
}

/**
 * A page block: a hairline rule, an h2 with an optional intro, then content.
 * Anchors land 120px below the top, as on the reference: 24px of scroll margin
 * on top of the 96px scroll padding the site sets on <html>.
 */
export function Block({
  id,
  title,
  intro,
  children,
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto block w-full max-w-[1360px] scroll-mt-[24px] overflow-visible px-5">
      <div className="border-t border-white/10 py-12 sm:py-[72px]">
        <header className="max-w-[820px]">
          <h2 className="text-balance text-left font-jakarta text-[28px] font-bold leading-[34px] tracking-[-0.01em] text-white sm:text-[36px] sm:leading-[42px]">
            {title}
          </h2>
          {intro ? (
            <div className="mt-4 max-w-[720px] space-y-4 text-[17px] leading-[27px] text-[#bdbdbd]">{intro}</div>
          ) : null}
        </header>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

/** A titled group inside a block. */
export function SubBlock({ title, intro, children }: { title?: ReactNode; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-14 first:mt-0">
      {title ? (
        <h3 className="text-balance font-jakarta text-[21px] font-semibold leading-[28px] text-white sm:text-[24px] sm:leading-[30px]">
          {title}
        </h3>
      ) : null}
      {intro ? <div className={cn('mt-3 max-w-[720px] space-y-4', bodyText)}>{intro}</div> : null}
      <div className={title || intro ? 'mt-6' : ''}>{children}</div>
    </div>
  );
}

/** Small grey line under a block's content. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-6 max-w-[820px] text-[15px] leading-[24px] text-[#a3a3a3]">{children}</p>;
}

/** Accent-coloured underlined link. */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    'text-[color:var(--pz-accent,#a87fef)] underline decoration-[color:var(--pz-accent-line,rgba(168,127,239,0.45))] underline-offset-[3px] transition-colors hover:text-white hover:decoration-white/60';
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Cards and lists                                                     */
/* ------------------------------------------------------------------ */

export interface CardItem {
  icon?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  href?: string;
  /** Outlined in the accent: "you are here". */
  current?: boolean;
}

/** Two or three columns of cards with an optional icon chip. */
export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2',
        items.length === 2 || items.length === 4 ? '' : 'lg:grid-cols-3',
      )}
    >
      {items.map((item, i) => {
        const className = cn(
          'flex flex-col p-6 sm:p-7',
          panel,
          item.current && '!border-[color:var(--pz-accent-ring)] shadow-[inset_0_0_0_1px_var(--pz-accent-ring)]',
        );
        const inner = (
          <>
            {item.icon ? (
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--pz-accent-tint)] ring-1 ring-inset ring-[color:var(--pz-accent-ring)]">
                <PzIcon name={item.icon} className="h-5 w-5 text-[color:var(--pz-accent)]" />
              </span>
            ) : null}
            <h3 className="font-jakarta text-[19px] font-semibold leading-[26px] text-white">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-[15px] leading-[24px] text-[#b5b5b5]">{item.description}</p>
            ) : null}
            {item.children ? (
              <div className="mt-2 space-y-3 text-[15px] leading-[24px] text-[#b5b5b5] [&_li]:text-[15px] [&_li]:leading-[24px] [&_li]:text-[#b5b5b5]">
                {item.children}
              </div>
            ) : null}
          </>
        );
        return item.href ? (
          <Link key={i} href={item.href} className={cn(className, 'transition-colors hover:border-white/25')}>
            {inner}
          </Link>
        ) : (
          <div key={i} className={className}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Ticked list. */
export function CheckList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <li key={i} className={cn('flex items-start gap-3', bodyText)}>
          <span
            aria-hidden="true"
            className="mt-[4px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--pz-accent-tint)] ring-1 ring-inset ring-[color:var(--pz-accent-ring)]"
          >
            <PzIcon name="check" strokeWidth={3} className="h-[10px] w-[10px] text-[color:var(--pz-accent)]" />
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Small numbered list (setup steps inside a card). */
export function NumberedList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ol className={cn('space-y-2.5', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] leading-[24px] text-[#c4c4c4]">
          <span className={cn('mt-[1px] h-[22px] w-[22px] text-[11px]', numberCircle)}>{i + 1}</span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ol>
  );
}

/** A panel with a heading, text and ticked list, and optionally a code window beside it. */
export function FeatureBox({
  title,
  children,
  list,
  aside,
}: {
  title?: ReactNode;
  children?: ReactNode;
  list?: ReactNode[];
  aside?: ReactNode;
}) {
  return (
    <div className={cn('grid grid-cols-1 items-start gap-8 p-6 sm:p-8', panel, aside ? 'lg:grid-cols-2 lg:gap-10' : '')}>
      <div className="min-w-0">
        {title ? (
          <h3 className="text-balance font-jakarta text-[21px] font-semibold leading-[28px] text-white sm:text-[24px] sm:leading-[30px]">
            {title}
          </h3>
        ) : null}
        {children ? <div className={cn(title ? 'mt-3' : '', 'space-y-4', bodyText)}>{children}</div> : null}
        {list ? (
          <CheckList
            items={list}
            className={cn(
              title || children ? 'mt-6' : '',
              !aside && 'lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-3 lg:space-y-0',
            )}
          />
        ) : null}
      </div>
      {aside ? <div className="min-w-0">{aside}</div> : null}
    </div>
  );
}

/** Bordered table; scrolls sideways inside its frame on narrow screens. */
export function DataTable({
  label,
  head,
  rows,
  highlightColumn,
  minWidth = 640,
}: {
  /** Accessible name for the scroll region. */
  label: string;
  head: ReactNode[];
  rows: ReactNode[][];
  highlightColumn?: number;
  minWidth?: number;
}) {
  return (
    <div className={cn('overflow-x-auto', panel)} role="region" aria-label={label} tabIndex={0}>
      <table className="w-full border-collapse text-left text-[15px] leading-[23px]" style={{ minWidth }}>
        <thead>
          <tr className="bg-white/[0.03]">
            {head.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  'px-6 py-4 align-bottom font-jakarta text-[14px] font-semibold leading-[20px]',
                  i === highlightColumn ? 'bg-[var(--pz-accent-tint)] text-[color:var(--pz-accent)]' : 'text-white',
                )}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-white/10">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th
                    key={i}
                    scope="row"
                    className="w-[22%] px-6 py-4 align-top font-jakarta text-[14px] font-semibold leading-[22px] text-white"
                  >
                    {cell}
                  </th>
                ) : (
                  <td
                    key={i}
                    className={cn(
                      'px-6 py-4 align-top',
                      i === highlightColumn ? 'bg-[var(--pz-accent-tint)] text-white' : 'text-[#c4c4c4]',
                    )}
                  >
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Numbered panels, each with its explanation on the left and a code window (or any aside) on the right. */
export function CodeSteps({
  steps,
}: {
  steps: Array<{ id?: string; title: ReactNode; description?: ReactNode; code?: string; codeTitle?: string; aside?: ReactNode }>;
}) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const aside = step.code ? <CodeWindow title={step.codeTitle ?? 'Example'} code={step.code} /> : step.aside;
        return (
          <li
            key={i}
            id={step.id}
            className={cn(
              'grid scroll-mt-[24px] grid-cols-1 items-start gap-6 p-6 sm:p-8',
              panel,
              aside ? 'lg:grid-cols-2 lg:gap-10' : '',
            )}
          >
            <div className="flex gap-4">
              <span className={cn('h-8 w-8 text-[14px]', numberCircle)}>{i + 1}</span>
              <div className="min-w-0 pt-[3px]">
                <h3 className="font-jakarta text-[19px] font-semibold leading-[26px] text-white">{step.title}</h3>
                {step.description ? <div className={cn('mt-2 space-y-3', bodyText)}>{step.description}</div> : null}
              </div>
            </div>
            {aside ? <div className="min-w-0">{aside}</div> : null}
          </li>
        );
      })}
    </ol>
  );
}

/** A panel with a heading, an accent meta line, text, and a code window that stretches to the panel's height. */
export function CodeCard({
  title,
  meta,
  children,
  code,
  codeTitle,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  code?: string;
  codeTitle?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col p-6 sm:p-8', panel)}>
      <h3 className="font-jakarta text-[21px] font-semibold leading-[28px] text-white sm:text-[24px] sm:leading-[30px]">
        {title}
      </h3>
      {meta ? <p className="mt-1 text-[14px] leading-[20px] text-[color:var(--pz-accent)]">{meta}</p> : null}
      {children ? <div className={cn('mt-4 space-y-4', bodyText)}>{children}</div> : null}
      {code ? (
        <div className="mt-6 flex flex-1 flex-col [&>div]:flex-1">
          <CodeWindow title={codeTitle ?? 'Example'} code={code} />
        </div>
      ) : null}
    </div>
  );
}

/** Two- or three-column grid for arbitrary panels. */
export function Columns({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', cols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2')}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export interface QA {
  question: string;
  answer: ReactNode;
}

/** Native <details> accordion; the first item starts open. The plus turns into a cross over 200ms. */
export function FaqList({ items, openFirst = true }: { items: QA[]; openFirst?: boolean }) {
  return (
    <div className={cn('divide-y divide-white/10 px-6 sm:px-8', panel)}>
      {items.map((item, i) => (
        <details key={item.question} className="group" open={openFirst && i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[4px] py-5 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pz-accent)] sm:py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-jakarta text-[17px] font-semibold leading-[25px] text-white sm:text-[18px] sm:leading-[26px]">
              {item.question}
            </h3>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-transform duration-200 group-open:rotate-45 group-open:border-[color:var(--pz-accent-ring)] group-open:text-[color:var(--pz-accent)] motion-reduce:transition-none"
            >
              <PzIcon name="plus" strokeWidth={2} className="h-4 w-4" />
            </span>
          </summary>
          <div className={cn('-mt-1 max-w-[820px] pb-6', bodyText)}>{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Channels and integrations                                           */
/* ------------------------------------------------------------------ */

/** Every sellable channel as a small linked tile, six to a row on desktop. */
export function ChannelGrid() {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {orbitOrder()
        .map((slug) => getChannel(slug))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((channel) => (
        <li key={channel.slug}>
          <Link
            href={`/channels/${channel.slug}`}
            className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-[#1A1919] px-3 py-2.5 text-[15px] leading-[20px] text-[#d9d9d9] transition-colors hover:border-white/25 hover:text-white"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white">
              <SocialIcon channel={channel} className="h-[22px] w-[22px] rounded-[5px]" />
            </span>
            <span className="truncate">{channelMenuLabels[channel.slug] ?? channel.name}</span>
          </Link>
        </li>
        ))}
    </ul>
  );
}

export interface GuideItem {
  name: string;
  href: string;
  blurb: string;
  mark: ReactNode;
}

/** Linked tiles for other integrations: mark, name and a one-line blurb (hidden on phones). */
export function GuideGrid({ items }: { items: GuideItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex h-full items-center gap-3 rounded-[16px] border border-white/10 bg-[#1A1919] p-3 transition-colors hover:border-white/25 sm:gap-4 sm:rounded-[20px] sm:p-4"
          >
            {item.mark}
            <span className="min-w-0">
              <span className="block font-jakarta text-[14px] font-semibold leading-[19px] text-white sm:text-[16px] sm:leading-[22px]">
                {item.name}
              </span>
              <span className="mt-0.5 hidden text-[13px] leading-[18px] text-[#9d9d9d] sm:block">{item.blurb}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Connect steps                                                       */
/* ------------------------------------------------------------------ */

/** "How to connect" block: two step cards side by side, a numbered list under them, then `after`. */
export function ConnectSection({
  accent,
  divider,
  title,
  intro,
  steps,
  after,
  children,
}: {
  accent?: Accent;
  divider?: boolean;
  title: ReactNode;
  intro?: ReactNode;
  steps?: ReactNode[];
  after?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AccentScope accent={accent} divider={divider}>
      <Block id="connect" title={title} intro={intro}>
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">{children}</div>
        {steps ? (
          <div className="mt-10">
            <StepList steps={steps} />
          </div>
        ) : null}
        {after}
      </Block>
    </AccentScope>
  );
}

export function StepCard({
  step,
  label,
  meta,
  title,
  description,
  children,
}: {
  step: number;
  label: string;
  meta?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-[24px] border border-white/10 bg-[#1A1919] p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn('h-8 w-8 text-[14px]', numberCircle)}>{step}</span>
          <span className="font-jakarta text-[15px] font-semibold text-white">{label}</span>
        </div>
        {meta ? (
          <span className="flex items-center gap-1.5 text-[13px] text-[#d1d1d1] text-opacity-70">{meta}</span>
        ) : null}
      </div>
      <div>
        <h3 className="font-jakarta text-[21px] font-semibold leading-[28px] text-white sm:text-[24px] sm:leading-[30px]">
          {title}
        </h3>
        <p className={cn('mt-2', bodyText)}>{description}</p>
      </div>
      {children}
    </div>
  );
}

/** Green "live" dot for a step card's meta line. */
export function LiveDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" aria-hidden="true" />;
}

/** 13px grey note under a code window inside a step card. */
export function SmallNote({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-[18px] text-[#d1d1d1] text-opacity-80">{children}</p>;
}

/** A request bubble (right) and the reply (left, with avatar and the channels it went to). */
export function ChatExchange({
  user,
  reply,
  avatar,
  via = [],
  viaLabel,
}: {
  user: ReactNode;
  reply: ReactNode;
  avatar: ReactNode;
  /** Channel slugs shown as small icons after "via …". */
  via?: string[];
  viaLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-white border-opacity-10 bg-[#0e0e0e] p-4 sm:p-5">
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[18px] rounded-br-[6px] bg-[var(--pz-accent-tint,rgba(182,156,255,0.08))] px-4 py-3 text-[14px] leading-[21px] text-[#e6e6e6] ring-1 ring-inset ring-[color:var(--pz-accent-ring,rgba(182,156,255,0.3))]">
          {user}
        </p>
      </div>
      <div className="flex items-end gap-2.5">
        <span className="mb-1 shrink-0">{avatar}</span>
        <div className="max-w-[85%] rounded-[18px] rounded-bl-[6px] border border-white border-opacity-10 bg-[#1A1919] px-4 py-3">
          <p className="text-[14px] leading-[21px] text-[#e6e6e6]">{reply}</p>
          <p className="mt-2 flex items-center gap-2 text-[11px] text-[#d1d1d1] text-opacity-60">
            <span>{viaLabel}</span>
            {via.length > 0 ? (
              <span className="flex gap-1">
                {via.map((slug) => {
                  const channel = getChannel(slug);
                  return channel ? (
                    <SocialIcon key={slug} channel={channel} className="h-[14px] w-[14px] rounded-[3px]" />
                  ) : null;
                })}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

/** "Also try" chips under a chat. */
export function AlsoTry({ items, label = 'Also try' }: { items: string[]; label?: string }) {
  return (
    <div>
      <p className="mb-2 text-[12px] text-[#d1d1d1] text-opacity-60">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white border-opacity-15 px-3 py-1.5 text-[13px] text-[#d1d1d1]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Numbered recap row: three to five short steps side by side from 768px. */
export function StepList({ steps }: { steps: ReactNode[] }) {
  return (
    <ol
      className={cn(
        'grid grid-cols-1 gap-x-8 gap-y-5',
        steps.length >= 5 ? 'md:grid-cols-5' : steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
      )}
    >
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-[14px] leading-[22px] text-[#c4c4c4] md:flex-col">
          <span className={cn('h-7 w-7 text-[12px]', numberCircle)}>{i + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Channel orbit band                                                  */
/* ------------------------------------------------------------------ */

/**
 * Full-width gradient band: centred heading, then the integration's mark in a
 * white disc with every channel arranged around it on one ring (12 or fewer)
 * or two (inner 12 at 28%, the rest at 44%, offset half a step).
 */
export function OrbitBand({
  accent = 'purple',
  title,
  description,
  center,
  footnote,
}: {
  accent?: Accent;
  title: ReactNode;
  description: ReactNode;
  center: ReactNode;
  footnote?: ReactNode;
}) {
  const channels = orbitOrder();
  const twoRings = channels.length > 12;
  const rings = twoRings
    ? [
        { items: channels.slice(0, 12), radius: 28, offset: 0 },
        { items: channels.slice(12), radius: 44, offset: 0.5 },
      ]
    : [{ items: channels, radius: 43, offset: 0 }];

  return (
    <div className="relative w-full overflow-hidden" style={{ background: accents[accent].orbit }}>
      <div className="mx-auto flex max-w-[1360px] flex-col items-center px-5 py-[70px] sm:py-[110px]">
        <h2 className="max-w-[860px] text-center font-jakarta text-[30px] font-bold leading-[33px] text-white sm:text-[48px] sm:leading-[52.8px]">
          {title}
        </h2>
        <p className="mt-4 max-w-[620px] text-center text-[17px] leading-[24px] text-white text-opacity-85 sm:text-[20px] sm:leading-[28px]">
          {description}
        </p>
        <div className="min-h-[40px] sm:min-h-[60px]" />
        <div
          className={cn(
            'relative h-[320px] w-[320px]',
            twoRings ? 'sm:h-[640px] sm:w-[640px]' : 'sm:h-[560px] sm:w-[560px]',
          )}
        >
          {rings.map((ring) => (
            <span
              key={ring.radius}
              aria-hidden="true"
              className="absolute rounded-full border border-white border-opacity-15"
              style={{ inset: `${50 - ring.radius}%` }}
            />
          ))}
          <div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-[6px] shadow-[0_30px_70px_rgba(10,0,40,0.5)] sm:h-[190px] sm:w-[190px]">
            <div className="h-full w-full overflow-hidden rounded-full bg-white">{center}</div>
          </div>
          {rings.flatMap((ring) =>
            ring.items.map((slug, i) => {
              const angle = ((i + ring.offset) / ring.items.length) * Math.PI * 2 - Math.PI / 2;
              const left = +(50 + ring.radius * Math.cos(angle)).toFixed(3);
              const top = +(50 + ring.radius * Math.sin(angle)).toFixed(3);
              const channel = getChannel(slug);
              if (!channel) return null;
              return (
                <Link
                  key={slug}
                  href={`/channels/${slug}`}
                  title={channel.name}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-transform hover:scale-105"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <AppTile
                    slug={slug}
                    box={cn(
                      '!rounded-full',
                      twoRings ? 'h-[34px] w-[34px] sm:h-[56px] sm:w-[56px]' : 'h-[44px] w-[44px] sm:h-16 sm:w-16',
                    )}
                    icon={twoRings ? 'h-[23px] w-[23px]' : 'h-[30px] w-[30px]'}
                  />
                  {!twoRings ? (
                    <span className="hidden whitespace-nowrap text-[12px] leading-[14px] text-white text-opacity-80 sm:block">
                      {channel.name}
                    </span>
                  ) : null}
                </Link>
              );
            }),
          )}
        </div>
        {footnote ? <p className="mt-10 text-center text-[14px] text-white text-opacity-70">{footnote}</p> : null}
      </div>
    </div>
  );
}

/** The reference's channel order (its orbit and grid open with X, LinkedIn, Instagram…). */
const ORBIT_ORDER = [
  'x', 'linkedin', 'instagram', 'facebook', 'threads', 'youtube', 'tiktok', 'pinterest',
  'bluesky', 'discord', 'slack', 'google-my-business', 'telegram', 'mastodon', 'dribbble',
  'wordpress', 'medium', 'hashnode', 'devto', 'warpcast', 'nostr', 'lemmy', 'vk', 'listmonk',
];

/** Sellable channel slugs in the reference's order (orbit and channel grid). */
export function orbitOrder(): string[] {
  const sellable = new Set(channelsInDisplayOrder.map((c) => c.slug));
  const ordered = ORBIT_ORDER.filter((slug) => sellable.has(slug));
  const rest = channelsInDisplayOrder.map((c) => c.slug).filter((slug) => !ordered.includes(slug));
  return [...ordered, ...rest];
}

/* ------------------------------------------------------------------ */
/* Prompt cards                                                        */
/* ------------------------------------------------------------------ */

export interface PromptCard {
  category: string;
  title: string;
  prompt: string;
  /** Channel slugs shown top-right. */
  icons: string[];
}

/** Four cards: category, channel icons, a title and the request as a chat bubble. */
export function PromptCards({ cards }: { cards: PromptCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="flex flex-col rounded-[24px] border border-white/10 bg-[#1A1919] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-jakarta text-[13px] font-semibold text-[color:var(--pz-accent,#a87fef)]">
              {card.category}
            </span>
            <span className="flex gap-1.5" aria-hidden="true">
              {card.icons.map((slug) => {
                const channel = getChannel(slug);
                return channel ? <SocialIcon key={slug} channel={channel} className="h-5 w-5 rounded-[5px]" /> : null;
              })}
            </span>
          </div>
          <h3 className="mt-3 font-jakarta text-[18px] font-semibold leading-[24px] text-white">{card.title}</h3>
          <p className="mt-auto pt-6">
            <span className="ml-auto block max-w-[94%] rounded-[18px] rounded-br-[6px] bg-[var(--pz-accent-tint,rgba(168,127,239,0.08))] px-4 py-3 text-[14px] leading-[21px] text-[#e6e6e6] ring-1 ring-inset ring-[color:var(--pz-accent-ring,rgba(168,127,239,0.3))]">
              {card.prompt}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Closing band                                                        */
/* ------------------------------------------------------------------ */

/**
 * Rounded gradient card at the end of the page (square-edged and full-bleed
 * below 640px): heading, line, two pills, and from 1024px either the mascot
 * still (cropped by the card's bottom edge) or a `visual`.
 */
export function ClosingBand({
  accent = 'purple',
  title,
  description,
  actions,
  image,
  visual,
}: {
  accent?: Accent;
  title: ReactNode;
  description: ReactNode;
  actions: ReactNode;
  image?: { src: string; width: number; height: number } | null;
  visual?: ReactNode;
}) {
  return (
    <section className="mx-auto block w-full max-w-[1360px] overflow-visible px-0 pb-16 pt-4 sm:px-5 sm:pb-24 sm:pt-6">
      <div className="relative overflow-hidden sm:rounded-[32px]" style={{ background: accents[accent].hero }}>
        <div className="relative grid items-center gap-8 px-5 py-12 sm:px-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-16">
          <div>
            <h2 className="text-balance text-left font-jakarta text-[34px] font-[800] leading-[38px] text-white sm:text-[52px] sm:leading-[56px]">
              {title}
            </h2>
            <p className="mt-4 max-w-[560px] text-[18px] leading-[27px] text-white/85 sm:text-[20px] sm:leading-[29px]">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row max-sm:[&>*]:!w-full">{actions}</div>
          </div>
          {visual && !image ? (
            <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
              {visual}
            </div>
          ) : null}
          {image ? (
            <div className="relative hidden h-[240px] lg:block" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                loading="lazy"
                className="absolute -bottom-[92px] right-0 h-auto w-[280px] drop-shadow-[0_30px_50px_rgba(10,0,40,0.45)]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
