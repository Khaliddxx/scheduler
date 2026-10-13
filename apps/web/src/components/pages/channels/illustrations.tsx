/**
 * The product illustrations inside the five gradient panels of a channel page.
 *
 * The reference design uses flat 698 x 521 screenshots with portrait photos
 * in them. These are rebuilt as inline SVG on the same canvas and the same
 * layout, so they scale with their panel exactly as the images do, but every
 * face is a neutral initials disc and every network shown is one we sell
 * (icons come in as props from the page). All decorative: aria-hidden.
 *
 * SVG text inherits the page font (DM Sans) through `font-dm` on the root.
 */

import type { ReactNode } from 'react';

const W = 698;
const H = 521;

export interface IllustrationChannel {
  name: string;
  /** /preview/socials/<slug>.svg, or null when the icon is missing. */
  icon: string | null;
  /** Short line under the name on the cross-post cards. */
  meta?: string;
  /** Chip text on the cross-post cards. */
  chip?: string;
}

/**
 * `canvas` is the drawing width. The reference's team picture is 738px wide with
 * the 698px frame on its left, so it renders a little smaller than the others
 * in the same column; passing 738 keeps that.
 */
function Frame({ id, canvas = W, children }: { id: string; canvas?: number; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${canvas} ${H}`}
      fill="none"
      aria-hidden
      focusable="false"
      className="block h-auto w-full font-dm"
      data-illustration={id}
    >
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="16" fill="#0E0E0E" stroke="#262626" />
      {children}
    </svg>
  );
}

/** Neutral stand-in for a portrait: a gradient disc with initials. */
function Avatar({
  cx,
  cy,
  r,
  text,
  from,
  to,
  id,
  ring,
}: {
  cx: number;
  cy: number;
  r: number;
  text: string;
  from: string;
  to: string;
  id: string;
  ring?: boolean;
}) {
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
      {ring ? <circle cx={cx} cy={cy} r={r - 1.5} stroke="#D9D9D9" strokeWidth="3" /> : null}
      <text
        x={cx}
        y={cy + r * 0.3}
        textAnchor="middle"
        fontSize={r * 0.82}
        fontWeight={700}
        className="font-jakarta"
        fill="white"
        fillOpacity="0.92"
      >
        {text}
      </text>
    </g>
  );
}

function Icon({ href, x, y, size }: { href: string | null; x: number; y: number; size: number }) {
  if (!href) return <rect x={x} y={y} width={size} height={size} rx={size * 0.2} fill="#3D3D3D" />;
  return <image href={href} x={x} y={y} width={size} height={size} />;
}

/** The two short strokes the reference scatters beside its cards. */
function Ticks({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate})`}
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M0 12C8 5 18 1 28 0" />
      <path d="M4 20C11 14 20 10 29 9" />
    </g>
  );
}

/* --------------------------------------------------------------- calendar */

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu'];
const PICKER_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const PICKER_X = [401, 438, 475, 512, 549, 586, 623];
const PICKER_Y = [265, 300, 335, 370, 405];

/** Week view with three scheduled posts, and a month picker over it. */
export function CalendarIllustration({ posts }: { posts: [IllustrationChannel, IllustrationChannel, IllustrationChannel] }) {
  const chips = [
    { x: 197, y: 155, w: 104, color: '#5332D8', time: '9:00 AM', avatar: 313, cy: 178, channel: posts[0], initials: 'AM', g: ['#8B6CFF', '#4C27E1'] },
    { x: 50, y: 233, w: 104, color: '#D92E7F', time: '1:45 PM', avatar: 168, cy: 257, channel: posts[1], initials: 'JR', g: ['#F7B267', '#D9480F'] },
    { x: 197, y: 314, w: 104, color: '#1877F2', time: '4:30 PM', avatar: 313, cy: 338, channel: posts[2], initials: 'SK', g: ['#5AA8FF', '#1849C9'] },
  ];

  // March 2024 starts on a Friday: slot 5 of the first row.
  const days: Array<{ d: number; col: number; row: number }> = [];
  for (let d = 1; d <= 30; d += 1) {
    const slot = 5 + d - 1;
    const row = Math.floor(slot / 7);
    if (row < PICKER_Y.length) days.push({ d, col: slot % 7, row });
  }

  return (
    <Frame id="calendar">
      <text x="80" y="67" fontSize="16" fill="white">
        March 11 – 17, 2024
      </text>

      {/* Week grid */}
      <rect x="79" y="85" width="540" height="353" fill="#191919" />
      {WEEK.map((day, i) => {
        const x = 80 + i * 135;
        return (
          <g key={day}>
            <rect x={x} y="85" width="133" height="32" fill="#363636" />
            <text x={x + 66.5} y="106" textAnchor="middle" fontSize="14" fill="white">
              {day}
            </text>
            {[119, 165, 211, 257, 302, 348, 394].map((y) => (
              <rect key={y} x={x} y={y} width="133" height={y === 394 ? 44 : 44} fill="#242323" />
            ))}
          </g>
        );
      })}

      {/* Scheduled posts */}
      {chips.map((chip, i) => (
        <g key={i}>
          <rect x={chip.x} y={chip.y} width={chip.w} height="47" rx="4" fill={chip.color} />
          <text x={chip.x + 11} y={chip.y + 28.5} fontSize="13" fill="white">
            {chip.time}
          </text>
          <Avatar
            cx={chip.avatar}
            cy={chip.cy}
            r={35}
            text={chip.initials}
            from={chip.g[0]}
            to={chip.g[1]}
            id={`ill-cal-av-${i}`}
            ring
          />
          <Icon href={chip.channel.icon} x={chip.avatar + 9} y={chip.cy + 8} size={33} />
        </g>
      ))}
      <Ticks x={30} y={212} rotate={-8} />

      {/* Month picker */}
      <rect x="375.5" y="176.5" width="273" height="294" rx="12" fill="#1A1919" stroke="#2E2E2E" />
      <path d="M403 196l-5 5 5 5" stroke="#B3B3B3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M621 196l5 5-5 5" stroke="#B3B3B3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="512" y="207" textAnchor="middle" fontSize="16" fill="white">
        March 2024
      </text>
      {PICKER_DAYS.map((day, i) => (
        <text key={day} x={PICKER_X[i]} y="240" textAnchor="middle" fontSize="10" fill="#7A7A7A">
          {day}
        </text>
      ))}
      {days.map(({ d, col, row }) => (
        <text key={d} x={PICKER_X[col]} y={PICKER_Y[row] + 4.5} textAnchor="middle" fontSize="13" fill="white">
          {d}
        </text>
      ))}
      <path
        d="M529 288c-6-9-17-12-27-8-11 5-15 17-10 28 5 10 18 14 29 9 10-5 14-17 9-27-2-5-6-9-10-11"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="545" y="428" width="89" height="28" rx="4" fill="#612BD3" />
      <text x="589.5" y="447" textAnchor="middle" fontSize="14" fill="white">
        Save
      </text>
    </Frame>
  );
}

/* -------------------------------------------------------------- assistant */

function GhostCard({ x, y, w, h, bars }: { x: number; y: number; w: number; h: number; bars: number[] }) {
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w} height={h} rx="12" fill="#0E0E0E" stroke="#262626" />
      {bars.map((bw, i) => (
        <rect key={i} x={x + 13} y={y + 48 + i * 20.3} width={bw} height="11" rx="5.5" fill="#1A1919" />
      ))}
    </g>
  );
}

function Draft({
  x,
  y,
  w,
  h,
  chip,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  chip: string;
  lines: Array<{ text: string; bold?: boolean }>;
}) {
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w} height={h} rx="10" fill="#242323" stroke="#5C5C5C" />
      <rect x={x - 14} y={y - 10} width={chip.length * 6.6 + 20} height="21" rx="10.5" fill="#612BD3" />
      <text x={x - 4} y={y + 5} fontSize="12" fill="white">
        {chip}
      </text>
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + 13}
          y={y + 61 + i * 15}
          fontSize="12"
          fill="#E6E6E6"
          fontWeight={line.bold ? 700 : 400}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

/** Two drafts written by an assistant, and the button that asked for them. */
export function AssistantIllustration({ channelName }: { channelName: string }) {
  return (
    <Frame id="assistant">
      <GhostCard x={351} y={59} w={231} h={168} bars={[186, 150, 190, 155]} />
      <GhostCard x={80} y={256} w={232} h={169} bars={[185, 205, 185, 200, 160]} />

      <path
        d="M95 92c-9 6-7 24 1 33-12-2-31 3-30 13 1 9 21 7 30 3-4 10-6 22 3 25 9 3 13-13 14-21 7 7 19 13 24 6 5-7-8-15-16-18 10-3 21-12 16-20-5-7-19 0-25 7 0-11-6-31-17-28z"
        stroke="#2690F2"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <Draft
        x={159}
        y={102}
        w={229}
        h={168}
        chip="Draft"
        lines={[
          { text: `Three things we changed on ${channelName}` },
          { text: 'this month, and the one that moved' },
          { text: 'the numbers most.', bold: true },
          { text: 'A short thread on what we kept.' },
        ]}
      />
      <Draft
        x={296}
        y={290}
        w={229}
        h={166}
        chip="Draft"
        lines={[
          { text: 'Launch week, day two: the feature' },
          { text: 'you asked for most is live. Here is' },
          { text: 'how it works and what comes next.' },
          { text: 'Reply with what you want to see.', bold: true },
        ]}
      />

      <rect x="370" y="246" width="250" height="75" rx="10" fill="#EC2CCD" />
      <g fill="white">
        <path
          d="M411.5 270.5l3 3-19.5 19.5a2.1 2.1 0 0 1-3 0 2.1 2.1 0 0 1 0-3z"
          stroke="white"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M412 268l1.5 3.6 3.6 1.5-3.6 1.5-1.5 3.6-1.5-3.6-3.6-1.5 3.6-1.5z" />
        <path d="M395.5 264l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
        <path d="M389 276l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
        <path d="M416 285l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" />
      </g>
      <text x="452" y="293" fontSize="27" fill="white">
        AI agent
      </text>
      <Ticks x={610} y={318} rotate={-28} />
    </Frame>
  );
}

/* -------------------------------------------------------------- cross-post */

function ChannelCard({
  x,
  y,
  channel,
  chipColor,
  id,
}: {
  x: number;
  y: number;
  channel: IllustrationChannel;
  chipColor: string;
  id: string;
}) {
  const cx = x + 115;
  const chip = channel.chip ?? '';
  const chipW = Math.max(56, chip.length * 7.4 + 26);
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width="230" height="271" rx="12" fill="#1B1B1B" stroke="#2C2C2C" />
      <defs>
        <radialGradient id={id} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#3A3A3A" />
          <stop offset="1" stopColor="#262626" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={y + 76} r="54" fill={`url(#${id})`} />
      <Icon href={channel.icon} x={cx - 26} y={y + 50} size={52} />
      <rect x={cx - chipW / 2} y={y + 122} width={chipW} height="22" rx="11" fill={chipColor} />
      <text x={cx} y={y + 137.5} textAnchor="middle" fontSize="13" fill="white">
        {chip}
      </text>
      <text x={cx} y={y + 171} textAnchor="middle" fontSize="22" fill="white">
        {channel.name}
      </text>
      <text x={cx} y={y + 193} textAnchor="middle" fontSize="11" fill="#9A9A9A">
        {channel.meta}
      </text>
      <rect x={x + 17} y={y + 218} width="196" height="37" rx="6" fill="#612BD3" />
      <text x={cx} y={y + 241} textAnchor="middle" fontSize="14" fill="white">
        Add to post
      </text>
    </g>
  );
}

/** Three overlapping cards for other networks the same post can go to. */
export function CrossPostIllustration({
  channels,
}: {
  channels: [IllustrationChannel, IllustrationChannel, IllustrationChannel];
}) {
  return (
    <Frame id="crosspost">
      <text x="81" y="90" fontSize="18" fill="white">
        Publish to
      </text>
      <rect x="427" y="73" width="190" height="23" rx="4" fill="#242323" />
      <rect x="522" y="73" width="95" height="23" rx="4" fill="#612BD3" />
      <text x="474.5" y="88.5" textAnchor="middle" fontSize="10" fill="#D9D9D9">
        Same copy
      </text>
      <text x="569.5" y="88.5" textAnchor="middle" fontSize="10" fill="white">
        Per network
      </text>
      <path
        d="M545 109c24-4 49-5 72-2-22 6-44 10-63 17 21-2 40-1 58 1-21 8-42 16-53 27"
        stroke="#F477FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ChannelCard x={81} y={121} channel={channels[0]} chipColor="#9F50F7" id="ill-cp-0" />
      <ChannelCard x={235} y={148} channel={channels[1]} chipColor="#B34BF0" id="ill-cp-1" />
      <ChannelCard x={386} y={175} channel={channels[2]} chipColor="#008FF7" id="ill-cp-2" />
    </Frame>
  );
}

/* -------------------------------------------------------------------- team */

const MEMBERS = [
  { handle: '@morgan', role: 'Owner', color: '#1D9BF0', initials: 'MO', g: ['#F7B267', '#D9480F'] },
  { handle: '@riley.k', role: 'Editor', color: '#6234E6', initials: 'RK', g: ['#F27AD9', '#A0129B'] },
  { handle: '@sam_lee', role: 'Reviewer', color: '#3446E6', initials: 'SL', g: ['#34D1A6', '#0A7A62'] },
];

/** A team list with roles, one member raised to show the approver. */
export function TeamIllustration() {
  const row = (y: number, m: (typeof MEMBERS)[number], i: number) => (
    <g key={m.handle}>
      <rect x="99" y={y} width="499" height="67" rx="12" fill="#242323" />
      <Avatar cx={133} cy={y + 33.5} r={17} text={m.initials} from={m.g[0]} to={m.g[1]} id={`ill-team-${i}`} />
      <text x="160" y={y + 39} fontSize="16" fill="white">
        {m.handle}
      </text>
      <rect x="471" y={y + 16} width="111" height="36" rx="5" fill={m.color} />
      <text x="526.5" y={y + 39.5} textAnchor="middle" fontSize="16" fill="white">
        {m.role}
      </text>
    </g>
  );

  return (
    <Frame id="team" canvas={738}>
      <text x="99" y="74" fontSize="21" fontWeight={500} fill="white">
        Team members
      </text>
      {row(101, MEMBERS[0], 0)}
      {row(177, MEMBERS[1], 1)}
      <rect x="99" y="253" width="499" height="67" rx="12" fill="#242323" />
      {row(347, MEMBERS[2], 2)}

      {/* The raised row */}
      <rect x="48" y="239" width="600" height="80" rx="12" fill="#3C10EC" />
      <Avatar cx={88} cy={279} r={23} text="JC" from="#5AA8FF" to="#1849C9" id="ill-team-raised" />
      <text x="122" y="286" fontSize="20" fill="white">
        @jordan.c
      </text>
      <rect x="468" y="256" width="163" height="46" rx="6" fill="white" />
      <text x="549.5" y="285.5" textAnchor="middle" fontSize="18" fill="#0E0E0E">
        Approver
      </text>

      <rect x="98" y="437" width="176" height="32" rx="4" fill="#612BD3" />
      <circle cx="122" cy="453" r="5.5" stroke="white" strokeWidth="1.2" />
      <path d="M122 450.5v5M119.5 453h5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <text x="134" y="457.5" fontSize="12.5" fill="white">
        Add another member
      </text>

      <g stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M638 207l2 17M649 213l-3 12M662 233l-9 5" />
        <path d="M45 323l-8 3M55 330l-7 18" />
      </g>
    </Frame>
  );
}

/* --------------------------------------------------------------- analytics */

/** Two follower tiles and a line chart with a tooltip, as on the reference. */
export function AnalyticsIllustration() {
  const star = (x: number, y: number) => (
    <g>
      <rect x={x} y={y} width="26" height="26" rx="4" fill="#612BD3" />
      <path
        d={`M${x + 13} ${y + 6.5}l2 4.3 4.6.5-3.4 3.1.9 4.6-4.1-2.3-4.1 2.3.9-4.6-3.4-3.1 4.6-.5z`}
        stroke="white"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </g>
  );

  return (
    <Frame id="analytics">
      <text x="66" y="85" fontSize="14" fill="white">
        Analytics
      </text>

      <rect x="65.5" y="101.5" width="440" height="197" rx="12" stroke="#262626" />
      {star(79, 114)}
      <text x="117" y="133" fontSize="17" fill="white">
        Followers
      </text>
      <text x="79" y="163" fontSize="23" fontWeight={700} fill="white">
        2,926
      </text>
      <path
        d="M80 220c14 4 22 12 34 8 13-5 18-32 34-38 12-5 13 8 22 0"
        stroke="#4F4F4F"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <rect x="65.5" y="309.5" width="160" height="81" rx="12" fill="#0E0E0E" stroke="#262626" />
      <rect x="79" y="321" width="26" height="26" rx="4" fill="#612BD3" />
      <path d="M85 340l5-5 4 3 6-7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="117" y="340" fontSize="17" fill="white">
        Reach
      </text>
      <text x="79" y="374" fontSize="15" fill="white">
        Friday
      </text>

      <rect x="167" y="182" width="466" height="268" rx="12" fill="#1A1919" />
      {star(181, 196)}
      <text x="221" y="215" fontSize="17" fill="white">
        Followers
      </text>
      {[
        ['30k', 242],
        ['20k', 293],
        ['10k', 344],
        ['0k', 395],
      ].map(([label, y]) => (
        <g key={label}>
          <line x1="215" x2="604" y1={y} y2={y} stroke="#2E2E2E" />
          <text x="207" y={Number(y) + 4} textAnchor="end" fontSize="11" fill="#9A9A9A">
            {label}
          </text>
        </g>
      ))}
      {[
        ['1', 219],
        ['50', 311],
        ['100', 404],
        ['150', 496],
        ['200', 589],
      ].map(([label, x]) => (
        <text key={label} x={x} y="422" textAnchor="middle" fontSize="11" fill="#9A9A9A">
          {label}
        </text>
      ))}
      <path
        d="M215 338c22-2 26 42 50 42 25 0 24-62 48-74 26-14 30-48 50-44 22 4 26 38 40 38 14 0 16 24 25 28 12 6 20 46 42 67 18 17 40 14 50-10 9-22 19-48 34-48 15 0 21 30 33 44 9 11 14 12 17 13"
        stroke="#2F70EF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M215 395c20-12 34-34 56-32 23 2 36 27 56 18 22-10 21-40 41-36 22 4 18-72 40-75 24-3 27 38 44 37 17-1 18-34 42-35 26-1 24 44 50 46 16 1 18 27 30 30 10 3 14-15 30-14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="428.5" x2="428.5" y1="330" y2="395" stroke="white" strokeDasharray="3 3" />
      <circle cx="428.5" cy="328.5" r="4.5" fill="white" stroke="#1A1919" strokeWidth="2" />
      <rect x="369" y="235" width="121" height="74" rx="10" fill="white" />
      <text x="381" y="258" fontSize="11" fill="#0E0E0E">
        This month
      </text>
      <text x="380" y="290" fontSize="26" fill="#0E0E0E">
        110.4k
      </text>
      <path
        d="M520 126c-30 7-48 22-49 42-1 18 22 22 37 12 16-11 4-36-16-31-26 6-45 30-58 60"
        stroke="#FC64FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M432 201l1 12 10-6" stroke="#FC64FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}
