import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Product illustrations.
 *
 * Six abstract renderings of the application's surfaces, built only from divs and
 * inline SVG — no screenshots, no third-party marks, no remote images. They are
 * decorative, so every root carries `aria-hidden` and nothing inside is reachable
 * by a screen reader or the keyboard.
 *
 * They share one visual language (frame surface, hairline, radius, dim label) so a
 * page that shows two of them side by side still reads as one product. The sub-UI
 * type sizes (9–11px) are deliberately below the site type scale: these are pictures
 * of an interface, not text a reader is meant to read.
 *
 * Mocks render inside cards that can be 320px wide. Everything is sized in relative
 * units or clipped by the frame's `overflow-hidden`.
 */

/* ------------------------------------------------------------------ shared */

type Tone = 'violet' | 'magenta' | 'deep' | 'plain';

/**
 * Tinted fills.
 *
 * The palette tokens are CSS variables holding hex values, so Tailwind's opacity
 * modifier (`bg-primary/30`) compiles to nothing at all — the class never exists.
 * `color-mix` against the same variable is the token-safe way to get a tint without
 * hard-coding a hex. Every tinted surface keeps its hairline too, so a chip still
 * reads as a chip in a browser that cannot parse the mix.
 */
const CHIP: Record<Tone, string> = {
  violet: 'bg-[color-mix(in_srgb,var(--primary)_55%,transparent)]',
  magenta: 'bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]',
  deep: 'bg-[color-mix(in_srgb,var(--accent-deep)_38%,transparent)]',
  plain: 'bg-white/[0.08]',
};

const DOT: Record<Tone, string> = {
  violet: 'bg-primary',
  magenta: 'bg-accent',
  deep: 'bg-accentDeep',
  plain: 'bg-white/60',
};

const INK: Record<Tone, string> = {
  violet: 'text-primaryHover',
  magenta: 'text-accent',
  deep: 'text-accentDeep',
  plain: 'text-white/55',
};

/** The outer panel every mock sits in: one step darker than the card around it. */
function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative w-full overflow-hidden rounded-card bg-surface p-3 shadow-hairline sm:p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Skeleton text line. `w` is a percentage so mocks reflow with their container. */
function Bar({ w, className }: { w: string; className?: string }) {
  return (
    <span
      className={cn('block h-1.5 rounded-full bg-white/15', className)}
      style={{ width: w }}
    />
  );
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'block text-[10px] font-medium leading-none tracking-[0.06em] text-dim',
        className,
      )}
    >
      {children}
    </span>
  );
}

function Dot({ tone }: { tone: Tone }) {
  return <span className={cn('block h-1.5 w-1.5 shrink-0 rounded-full', DOT[tone])} />;
}

/* --------------------------------------------------------------- calendar */

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Grid placement is held as a literal class string rather than composed from
 * numbers, because Tailwind can only see classes that exist in the source.
 * Columns are 1 (time gutter) + 2…8 (Mon…Sun).
 */
const POSTS: Array<{ pos: string; tone: Tone; label: string }> = [
  { pos: 'col-start-2 row-start-1', tone: 'violet', label: 'Teaser' },
  { pos: 'col-start-3 row-start-2 col-span-2', tone: 'magenta', label: 'Launch thread' },
  { pos: 'col-start-6 row-start-1', tone: 'plain', label: 'Recap' },
  { pos: 'col-start-4 row-start-4', tone: 'deep', label: 'Short' },
  { pos: 'col-start-7 row-start-3 col-span-2', tone: 'violet', label: 'Carousel' },
  { pos: 'col-start-2 row-start-5 col-span-2', tone: 'plain', label: 'Newsletter' },
  { pos: 'col-start-6 row-start-5', tone: 'violet', label: 'Digest' },
  { pos: 'col-start-3 row-start-6', tone: 'deep', label: 'Clip' },
  { pos: 'col-start-8 row-start-6', tone: 'magenta', label: 'AMA' },
];

const GRID_COLS = 'grid-cols-[26px_repeat(7,minmax(0,1fr))]';

export function CalendarMock({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className={cn('grid gap-x-1 pb-2', GRID_COLS)}>
        <span />
        {DAYS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className={cn(
              'text-center text-[10px] font-medium leading-none',
              i === 2 ? 'text-white' : 'text-dim',
            )}
          >
            {d}
          </span>
        ))}
      </div>

      <div
        className={cn(
          'grid items-center gap-x-1 auto-rows-[24px]',
          GRID_COLS,
          'bg-[repeating-linear-gradient(to_bottom,var(--bg-line)_0,var(--bg-line)_1px,transparent_1px,transparent_24px)]',
        )}
      >
        <span className="col-start-1 row-start-1 pr-1 text-right text-[9px] leading-none text-dim">
          09
        </span>
        <span className="col-start-1 row-start-3 pr-1 text-right text-[9px] leading-none text-dim">
          12
        </span>
        <span className="col-start-1 row-start-5 pr-1 text-right text-[9px] leading-none text-dim">
          15
        </span>

        {POSTS.map((p) => (
          <span
            key={p.pos}
            className={cn(
              'flex h-5 min-w-0 items-center gap-1 rounded-[7px] px-1.5 shadow-hairline',
              CHIP[p.tone],
              p.pos,
            )}
          >
            <Dot tone={p.tone} />
            <span className="truncate text-[9px] leading-none text-white/90">{p.label}</span>
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------- agent chat */

const DRAFTS: Array<{ tone: Tone; stamp: string }> = [
  { tone: 'violet', stamp: 'Tue 09:00' },
  { tone: 'magenta', stamp: 'Wed 14:30' },
  { tone: 'deep', stamp: 'Fri 18:00' },
];

export function AgentChatMock({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className="flex flex-col gap-2">
        {/*
          Outgoing bubbles need a *definite* width: `ml-auto` stops a column flex item
          from stretching, so with only a max-width the bubble shrink-wraps its content —
          and its content is percentage-width bars, which then resolve against nothing and
          collapse the bubble to a stub. `w-…` gives the percentages something to measure.
        */}
        <span className="ml-auto flex w-[72%] flex-col gap-1.5 rounded-[12px] rounded-br-[4px] bg-white/[0.09] px-2.5 py-2">
          <Bar w="100%" />
          <Bar w="62%" className="bg-white/10" />
        </span>

        <span className="flex max-w-[86%] items-start gap-2">
          <span className="mt-0.5 block h-5 w-5 shrink-0 rounded-[7px] bg-brand shadow-hairline" />
          <span className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[12px] rounded-bl-[4px] bg-bg px-2.5 py-2 shadow-hairline">
            <Bar w="92%" className="bg-white/25" />
            <Bar w="100%" className="bg-white/20" />
            <Bar w="48%" className="bg-white/[0.12]" />
          </span>
        </span>

        <span className="ml-auto flex w-[52%] flex-col gap-1.5 rounded-[12px] rounded-br-[4px] bg-white/[0.09] px-2.5 py-2">
          <Bar w="80%" />
        </span>
      </div>

      <Label className="mt-3.5">3 drafts</Label>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {DRAFTS.map((d) => (
          <span
            key={d.stamp}
            className="flex min-w-0 flex-col gap-1.5 rounded-[10px] bg-bg p-2 shadow-hairline"
          >
            <Dot tone={d.tone} />
            <Bar w="100%" className="bg-white/20" />
            <Bar w="70%" className="bg-white/[0.12]" />
            <span className="truncate text-[9px] leading-none text-dim">{d.stamp}</span>
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ----------------------------------------------------------------- editor */

const ICON = 'h-3.5 w-3.5';
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const TOOLS = [
  // Text
  <svg key="text" viewBox="0 0 14 14" className={ICON}>
    <path d="M3 3.5h8M7 3.5v7" {...STROKE} />
  </svg>,
  // Photos
  <svg key="photo" viewBox="0 0 14 14" className={ICON}>
    <rect x="2" y="3" width="10" height="8" rx="1.6" {...STROKE} />
    <path d="M3.4 9.6 6 7l2 1.8 1.4-1.2 1.4 1.4" {...STROKE} />
    <circle cx="5" cy="5.4" r="0.9" {...STROKE} />
  </svg>,
  // Elements
  <svg key="shapes" viewBox="0 0 14 14" className={ICON}>
    <circle cx="5" cy="5" r="2.6" {...STROKE} />
    <rect x="6.4" y="6.4" width="5.2" height="5.2" rx="1.2" {...STROKE} />
  </svg>,
  // Background
  <svg key="bg" viewBox="0 0 14 14" className={ICON}>
    <rect x="2.2" y="2.2" width="9.6" height="9.6" rx="2" {...STROKE} />
    <path d="M2.6 8.4 8.4 2.6M5.6 11.4 11.4 5.6" {...STROKE} />
  </svg>,
];

const SWATCHES = [
  'bg-gradient-to-br from-primary to-accentDeep',
  'bg-gradient-to-tr from-accent to-primary',
  'bg-gradient-to-b from-white/20 to-white/[0.04]',
  'bg-brand-diag',
  'bg-gradient-to-tr from-white/15 to-white/[0.03]',
  'bg-gradient-to-br from-accentDeep to-primary',
  'bg-gradient-to-b from-primaryHover to-bg',
  'bg-gradient-to-tl from-white/[0.12] to-white/[0.03]',
];

export function EditorMock({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className="flex gap-2">
        <div className="flex w-9 shrink-0 flex-col gap-1.5 rounded-[12px] bg-bg p-1.5 shadow-hairline">
          {TOOLS.map((icon, i) => (
            <span
              key={i}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-[7px]',
                i === 0 ? 'bg-white/10 text-white shadow-hairline' : 'text-dim',
              )}
            >
              {icon}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="relative h-24 overflow-hidden rounded-[12px] bg-bg shadow-hairline">
            <div className="absolute inset-x-4 top-3.5 h-10 rounded-[8px] bg-brand-diag">
              <span className="absolute -left-1 -top-1 h-2 w-2 rounded-[3px] bg-white" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-[3px] bg-white" />
              <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-[3px] bg-white" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-[3px] bg-white" />
            </div>
            <div className="absolute inset-x-4 bottom-3.5 flex flex-col gap-1.5">
              <Bar w="68%" className="h-2 bg-white/25" />
              <Bar w="44%" className="bg-white/[0.12]" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {SWATCHES.map((s) => (
              <span
                key={s}
                className={cn('aspect-square rounded-[6px] shadow-hairline', s)}
              />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------- team */

const MEMBERS: Array<{
  initials: string;
  name: string;
  role: string;
  grad: string;
  pill: string;
}> = [
  {
    initials: 'AR',
    name: 'Ava R.',
    role: 'Owner',
    grad: 'bg-gradient-to-br from-primary to-accentDeep',
    pill: 'bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-accent',
  },
  {
    initials: 'NK',
    name: 'Noah K.',
    role: 'Admin',
    grad: 'bg-gradient-to-tr from-accent to-primary',
    pill: 'bg-[color-mix(in_srgb,var(--primary)_55%,transparent)] text-white',
  },
  {
    initials: 'MT',
    name: 'Mia T.',
    role: 'Editor',
    grad: 'bg-gradient-to-b from-white/25 to-white/5',
    pill: 'bg-white/10 text-muted',
  },
];

export function TeamMock({ className }: { className?: string }) {
  const lift = ['-mr-3 rotate-[-2deg]', 'z-10 -translate-y-3', '-ml-3 rotate-[2deg]'];
  const width = ['w-[34%]', 'w-[40%]', 'w-[34%]'];

  return (
    <Frame className={className}>
      <div className="flex items-end justify-center py-3">
        {MEMBERS.map((m, i) => (
          <div
            key={m.initials}
            className={cn(
              'flex min-w-0 flex-col items-center gap-2 rounded-card bg-bgInner p-2.5',
              i === 1 ? 'shadow-lift ring-1 ring-white/25' : 'shadow-hairline',
              width[i],
              lift[i],
            )}
          >
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold leading-none text-white shadow-hairline',
                m.grad,
              )}
            >
              {m.initials}
            </span>
            <span className="max-w-full truncate text-[11px] font-medium leading-none text-white">
              {m.name}
            </span>
            <span
              className={cn(
                'rounded-control px-2 py-0.5 text-[9px] font-medium leading-[1.4]',
                m.pill,
              )}
            >
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ plugs */

const RULES: Array<{ when: string; then: string; on: boolean; tone: Tone }> = [
  { when: '100 likes', then: 'repost after 3 days', on: true, tone: 'violet' },
  { when: 'New follower', then: 'send a welcome reply', on: true, tone: 'magenta' },
  { when: 'Draft approved', then: 'publish at 09:00', on: false, tone: 'plain' },
  { when: 'Top post', then: 'cross-post everywhere', on: true, tone: 'deep' },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        'relative ml-auto block h-4 w-7 shrink-0 rounded-full',
        on ? 'bg-primary shadow-hairline' : 'bg-white/15',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-3 w-3 rounded-full bg-white',
          on ? 'left-3.5' : 'left-0.5',
        )}
      />
    </span>
  );
}

export function PlugsMock({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Label>Automations</Label>
      <div className="mt-2.5 flex flex-col gap-1.5">
        {RULES.map((r) => (
          <span
            key={r.when}
            className="flex items-center gap-2 rounded-[12px] bg-bg p-2 shadow-hairline"
          >
            <Dot tone={r.tone} />
            <span className="min-w-0 truncate text-[10px] leading-none">
              <span className="text-white/90">{r.when}</span>
              <span className="px-1 text-dim">&rarr;</span>
              <span className="text-dim">{r.then}</span>
            </span>
            <Toggle on={r.on} />
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* -------------------------------------------------------------- analytics */

/**
 * Curves are hand-authored so each card has its own character: a steady climb,
 * a dip and recovery, a plateau, a spike, a soft decline, a late surge.
 */
const METRICS: Array<{ key: string; label: string; value: string; tone: Tone; d: string }> = [
  {
    key: 'impressions',
    label: 'Impressions',
    value: '48.2k',
    tone: 'magenta',
    d: 'M0 26 C 12 25 18 19 30 20 S 50 11 64 13 S 86 5 100 4',
  },
  {
    key: 'engagements',
    label: 'Engagements',
    value: '3.1k',
    tone: 'plain',
    d: 'M0 14 C 10 13 16 24 28 25 S 46 18 58 16 S 80 20 100 11',
  },
  {
    key: 'followers',
    label: 'Followers',
    value: '+612',
    tone: 'plain',
    d: 'M0 22 L 16 21 C 28 20 34 20 46 19 S 70 18 82 17 L 100 16',
  },
  {
    key: 'reach',
    label: 'Reach',
    value: '21.8k',
    tone: 'violet',
    d: 'M0 24 C 14 23 22 22 34 21 S 52 20 60 9 S 72 3 80 8 S 92 18 100 15',
  },
  {
    key: 'clicks',
    label: 'Clicks',
    value: '1.9k',
    tone: 'plain',
    d: 'M0 8 C 12 10 20 14 32 15 S 54 19 68 20 S 88 23 100 24',
  },
  {
    key: 'saves',
    label: 'Saves',
    value: '740',
    tone: 'plain',
    d: 'M0 27 C 16 26 26 25 38 25 S 58 24 70 21 S 88 10 100 6',
  },
];

function Spark({ id, d, tone }: { id: string; d: string; tone: Tone }) {
  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={cn('mt-2 h-7 w-full', INK[tone])}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L100 32 L0 32 Z`} fill={`url(#${id})`} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function AnalyticsMock({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className="grid grid-cols-2 gap-2">
        {METRICS.map((m) => (
          <div key={m.key} className="rounded-[12px] bg-bg p-2.5 shadow-hairline">
            <Label className="truncate">{m.label}</Label>
            <span className="mt-1.5 block text-[15px] font-semibold leading-none text-white">
              {m.value}
            </span>
            <Spark id={`spark-${m.key}`} d={m.d} tone={m.tone} />
          </div>
        ))}
      </div>
    </Frame>
  );
}
