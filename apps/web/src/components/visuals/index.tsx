import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Product mockups.
 *
 * These are built from divs and inline SVG rather than shipped as video or
 * screenshots, which is the better trade in every direction: they stay sharp
 * at any size, they follow the brand tokens so a palette change updates them
 * for free, they cost a few kilobytes instead of a few megabytes, and they are
 * ours.
 *
 * Each one animates on a long loop (18-26s) rather than a short one. A card
 * that scrolls into view is then usually caught mid-cycle, which reads as a
 * live interface; a short loop reads as a GIF. Every animation ends at its
 * resting state, so a reduced-motion viewer sees a complete, legible mockup
 * with nothing missing — see the `prefers-reduced-motion` block in globals.css.
 *
 * All six are decorative and carry `aria-hidden` at the root.
 */

/* ------------------------------------------------------------------ */
/* Shared parts                                                        */
/* ------------------------------------------------------------------ */

const Frame = ({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) => (
  <div
    aria-hidden
    className={cn(
      'relative overflow-hidden rounded-[14px] bg-[#0d0d0d] shadow-hairline',
      className,
    )}
  >
    {title ? (
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-white/15" />
          <i className="h-2 w-2 rounded-full bg-white/15" />
          <i className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="text-[10px] font-medium text-white/40">{title}</span>
      </div>
    ) : null}
    {children}
  </div>
);

/** Skeleton line. Width is a percentage so rows read as varied text. */
const Bar = ({ w = 100, dim = false }: { w?: number; dim?: boolean }) => (
  <span
    className={cn('block h-1.5 rounded-full', dim ? 'bg-white/[0.07]' : 'bg-white/15')}
    style={{ width: `${w}%` }}
  />
);

const Dot = ({ color }: { color: string }) => (
  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
);

const v = (i: number, dur: number): CSSProperties =>
  ({ animationDelay: `${i * 0.5}s`, animationDuration: `${dur}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* 1. Calendar                                                         */
/* ------------------------------------------------------------------ */

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CHIPS = [
  { row: 0, col: 0, span: 2, label: 'Launch thread', tone: '#6C10DF' },
  { row: 0, col: 3, span: 1, label: 'Teaser', tone: '#B611B0' },
  { row: 1, col: 1, span: 2, label: 'Carousel', tone: '#CE2777' },
  { row: 1, col: 5, span: 1, label: 'Recap', tone: '#164CD9' },
  { row: 2, col: 2, span: 1, label: 'Short', tone: '#4C27E1' },
  { row: 2, col: 4, span: 2, label: 'Newsletter', tone: '#8217C3' },
  { row: 3, col: 0, span: 1, label: 'Clip', tone: '#D82D7E' },
  { row: 3, col: 3, span: 2, label: 'Digest', tone: '#612BD3' },
];

export function CalendarMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-calendar w-full', className)} title="Calendar">
      <div className="p-3">
        <div className="mb-2 grid grid-cols-7 gap-1.5">
          {DAYS.map((d, i) => (
            <span key={i} className="text-center text-[9px] font-medium text-white/30">
              {d}
            </span>
          ))}
        </div>

        <div className="relative grid grid-cols-7 gap-1.5">
          {/* Empty cells give the grid its ruled-paper structure. */}
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="h-9 rounded-md bg-white/[0.025]" />
          ))}

          {/* Chips sit over the grid, so a post can span two days. */}
          {CHIPS.map((c, i) => (
            <span
              key={i}
              className="absolute flex items-center gap-1.5 rounded-md px-1.5"
              style={{
                left: `calc(${(c.col * 100) / 7}% + 2px)`,
                top: c.row * 42 + 4,
                width: `calc(${(c.span * 100) / 7}% - 6px)`,
                height: 20,
                backgroundColor: c.tone,
                animation: 'chipIn 22s ease-in-out infinite',
                ...v(i, 22),
              }}
            >
              <i className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
              <i className="truncate text-[8px] font-medium not-italic text-white/90">
                {c.label}
              </i>
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Agent chat                                                       */
/* ------------------------------------------------------------------ */

export function AgentChatMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-chat w-full', className)} title="Assistant">
      <div className="flex flex-col gap-2.5 p-3.5">
        {/* Outgoing. Explicit width, not ml-auto: an auto cross-axis margin
            stops a column flex item stretching, and percentage-width children
            then collapse to nothing. */}
        <span
          className="ml-auto flex w-[70%] flex-col gap-1.5 rounded-[10px] rounded-br-sm bg-primary/90 p-2.5"
          style={{ animation: 'msgIn 20s ease-in-out infinite', ...v(0, 20) }}
        >
          <Bar w={92} />
          <Bar w={54} />
        </span>

        <span
          className="flex w-[82%] flex-col gap-1.5 rounded-[10px] rounded-bl-sm bg-white/[0.06] p-2.5"
          style={{ animation: 'msgIn 20s ease-in-out infinite', ...v(1, 20) }}
        >
          <Bar w={86} dim />
          <Bar w={62} dim />
        </span>

        {/* Typing indicator, between the answer and the drafts. */}
        <span className="flex items-center gap-1 pl-1">
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/50"
              style={{ animation: 'typing 1.4s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>

        <span className="mt-0.5 text-[9px] text-white/35">3 drafts ready</span>

        <span className="grid grid-cols-3 gap-2">
          {[
            { tone: '#0A66C2', day: 'Tue 09:00' },
            { tone: '#E4405F', day: 'Wed 14:30' },
            { tone: '#0285FF', day: 'Fri 18:00' },
          ].map((d, i) => (
            <span
              key={i}
              className="flex flex-col gap-1.5 rounded-lg bg-white/[0.05] p-2 shadow-hairline"
              style={{ animation: 'msgIn 20s ease-in-out infinite', ...v(i + 3, 20) }}
            >
              <Dot color={d.tone} />
              <Bar w={90} dim />
              <Bar w={64} dim />
              <i className="text-[8px] not-italic text-white/35">{d.day}</i>
            </span>
          ))}
        </span>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Image editor                                                     */
/* ------------------------------------------------------------------ */

const SWATCHES = [
  'linear-gradient(135deg,#8217C3,#D82D7E)',
  'linear-gradient(135deg,#164CD9,#4C27E1)',
  'linear-gradient(135deg,#B611B0,#612BD3)',
  'linear-gradient(135deg,#CE2777,#8217C3)',
  'linear-gradient(135deg,#4C27E1,#0285FF)',
  'linear-gradient(135deg,#612BD3,#B611B0)',
];

export function EditorMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-editor w-full', className)} title="Design">
      <div className="flex">
        <div className="flex w-10 shrink-0 flex-col items-center gap-2.5 border-r border-white/[0.07] py-3">
          {['T', '▣', '◆', '☀'].map((g, i) => (
            <span
              key={i}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-md text-[10px]',
                i === 1 ? 'bg-white/10 text-white' : 'text-white/35',
              )}
            >
              {g}
            </span>
          ))}
        </div>

        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SWATCHES.map((bg, i) => (
              <span
                key={i}
                className="h-11 rounded-md"
                style={{
                  backgroundImage: bg,
                  animation: 'swatchIn 18s ease-in-out infinite',
                  ...v(i, 18),
                }}
              />
            ))}
          </div>

          {/* Crop frame drifting across the canvas. */}
          <div className="relative mt-2 h-14 overflow-hidden rounded-md bg-white/[0.04]">
            <span
              className="absolute inset-y-1.5 left-2 w-14 rounded border-2 border-dashed border-white/40"
              style={{ animation: 'scanCrop 14s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Team                                                             */
/* ------------------------------------------------------------------ */

const MEMBERS = [
  { initials: 'AR', role: 'Owner', tone: '#B611B0', raised: false },
  { initials: 'NK', role: 'Admin', tone: '#4C27E1', raised: true },
  { initials: 'MT', role: 'Editor', tone: '#164CD9', raised: false },
];

export function TeamMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-team w-full p-4', className)}>
      <div className="flex items-end justify-center gap-2">
        {MEMBERS.map((m, i) => (
          <span
            key={i}
            className={cn(
              'flex flex-1 flex-col items-center gap-1.5 rounded-xl p-3 shadow-hairline',
              m.raised ? '-translate-y-2 bg-white/[0.08]' : 'bg-white/[0.03]',
            )}
            style={{ animation: 'swatchIn 20s ease-in-out infinite', ...v(i, 20) }}
          >
            <i
              className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold not-italic text-white"
              style={{ backgroundColor: m.tone }}
            >
              {m.initials}
            </i>
            <Bar w={72} dim />
            <i className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] not-italic text-white/70">
              {m.role}
            </i>
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Automation rules                                                 */
/* ------------------------------------------------------------------ */

const RULES = [
  { when: '100 likes', then: 'repost after 3 days', tone: '#D82D7E' },
  { when: 'New follower', then: 'send a welcome reply', tone: '#4C27E1' },
  { when: 'Draft approved', then: 'publish at 09:00', tone: '#164CD9' },
  { when: 'Top post', then: 'cross-post everywhere', tone: '#B611B0' },
];

export function PlugsMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-plugs w-full', className)} title="Automations">
      <div className="flex flex-col gap-1.5 p-3">
        {RULES.map((r, i) => (
          <span
            key={i}
            className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-2"
            style={{ animation: 'swatchIn 24s ease-in-out infinite', ...v(i, 24) }}
          >
            <Dot color={r.tone} />
            <i className="truncate text-[9px] not-italic text-white/80">{r.when}</i>
            <i className="text-[9px] not-italic text-white/30">→</i>
            <i className="flex-1 truncate text-[9px] not-italic text-white/50">{r.then}</i>

            {/* Track and knob animate together so the switch reads as flipping. */}
            <i
              className="relative flex h-3.5 w-7 shrink-0 items-center rounded-full px-0.5"
              style={{
                animation: 'toggleTrack 24s ease-in-out infinite',
                animationDelay: `${i * 0.5 + 0.3}s`,
              }}
            >
              <i
                className="block h-2.5 w-2.5 rounded-full bg-white"
                style={{
                  animation: 'toggleOn 24s ease-in-out infinite',
                  animationDelay: `${i * 0.5 + 0.3}s`,
                }}
              />
            </i>
          </span>
        ))}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Analytics                                                        */
/* ------------------------------------------------------------------ */

const SERIES = [
  { label: 'Impressions', value: '48.2k', d: 'M0 30 L18 26 L36 28 L54 18 L72 20 L90 10 L108 12', tone: '#D82D7E' },
  { label: 'Engagements', value: '3.1k', d: 'M0 24 L18 28 L36 16 L54 22 L72 12 L90 16 L108 8', tone: '#B611B0' },
  { label: 'Followers', value: '+612', d: 'M0 32 L18 30 L36 24 L54 26 L72 16 L90 14 L108 9', tone: '#8217C3' },
  { label: 'Reach', value: '21.8k', d: 'M0 28 L18 20 L36 24 L54 14 L72 18 L90 11 L108 6', tone: '#4C27E1' },
  { label: 'Clicks', value: '1.9k', d: 'M0 26 L18 24 L36 18 L54 20 L72 14 L90 15 L108 7', tone: '#164CD9' },
  { label: 'Saves', value: '740', d: 'M0 31 L18 25 L36 27 L54 17 L72 19 L90 9 L108 11', tone: '#0285FF' },
];

export function AnalyticsMock({ className }: { className?: string }) {
  return (
    <Frame className={cn('anim-analytics w-full', className)} title="Analytics">
      <div className="grid grid-cols-2 gap-1.5 p-3">
        {SERIES.map((s, i) => (
          <span
            key={i}
            className="flex flex-col gap-1 rounded-lg bg-white/[0.04] p-2.5"
            style={{ animation: 'swatchIn 26s ease-in-out infinite', ...v(i, 26) }}
          >
            <i className="text-[8px] not-italic text-white/40">{s.label}</i>
            <i className="font-display text-[13px] font-bold not-italic text-white">
              {s.value}
            </i>
            <svg viewBox="0 0 108 36" className="mt-0.5 h-6 w-full" preserveAspectRatio="none">
              <defs>
                {/* ids are suffixed per series: two of these on one page would
                    otherwise share a gradient and tint each other. */}
                <linearGradient id={`sp-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.tone} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={s.tone} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${s.d} L108 36 L0 36 Z`} fill={`url(#sp-${i})`} />
              <path
                d={s.d}
                fill="none"
                stroke={s.tone}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={
                  {
                    strokeDasharray: 200,
                    '--len': 200,
                    animation: 'drawLine 26s ease-in-out infinite',
                    animationDelay: `${i * 0.5}s`,
                  } as CSSProperties
                }
              />
            </svg>
          </span>
        ))}
      </div>
    </Frame>
  );
}
