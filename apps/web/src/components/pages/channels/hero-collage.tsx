/**
 * The two floating collages either side of a channel page's hero: a month
 * calendar with a follower chip and a magic-wand button on the left, a post
 * card and a day schedule on the right.
 *
 * Drawn as inline SVG on the reference design's own geometry (card sizes,
 * angles and offsets), so they sit exactly where the reference's do. The
 * reference fills the round frames with portrait photos; these are neutral
 * initials, and the photo in the post card is an abstract gradient. The badges
 * on the schedule rows are channel icons passed in by the page, so a channel
 * page shows its own network there.
 *
 * Purely decorative: aria-hidden, no focusable content. Shown from 1360px only,
 * as in the reference (below that the hero copy needs the width).
 */

/** SVG text inherits the page font (DM Sans) through `font-dm` on the root. */
const label = { fill: 'white' } as const;

/** Two-colour disc with initials: the stand-in for a portrait. */
function Initials({
  cx,
  cy,
  r,
  text,
  gradient,
  size,
}: {
  cx: number;
  cy: number;
  r: number;
  text: string;
  gradient: string;
  size: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradient})`} />
      <text
        x={cx}
        y={cy + size * 0.36}
        textAnchor="middle"
        fontSize={size}
        fontWeight={700}
        className="font-jakarta"
        fill="white"
        fillOpacity={0.92}
      >
        {text}
      </text>
    </g>
  );
}

/** Gradients for the initials discs, defined once per collage. */
function AvatarGradients({ prefix }: { prefix: string }) {
  const stops: Array<[string, string, string]> = [
    ['violet', '#8B6CFF', '#4C27E1'],
    ['pink', '#F27AD9', '#A0129B'],
    ['blue', '#5AA8FF', '#1849C9'],
    ['teal', '#34D1A6', '#0A7A62'],
  ];
  return (
    <>
      {stops.map(([id, a, b]) => (
        <linearGradient key={id} id={`${prefix}-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      ))}
    </>
  );
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const COLS = [31, 77, 123, 168.8, 214.7, 260.9, 307];
const ROWS = [110, 153.6, 197.3, 241, 284.6];

/** March 2024 starts on a Friday, which is the layout the reference shows. */
const MONTH_START = 5;
const MONTH_DAYS = 31;

export function HeroCollageLeft({ className }: { className?: string }) {
  const days: Array<{ d: number; col: number; row: number }> = [];
  for (let d = 1; d <= MONTH_DAYS; d += 1) {
    const slot = MONTH_START + d - 1;
    const row = Math.floor(slot / 7);
    if (row < ROWS.length) days.push({ d, col: slot % 7, row });
  }

  return (
    <svg
      viewBox="0 0 299 515"
      width="299"
      height="515"
      fill="none"
      aria-hidden
      focusable="false"
      className={`font-dm ${className ?? ''}`}
    >
      <defs>
        <AvatarGradients prefix="chl" />
        <filter
          id="chl-shadow"
          x="-267"
          y="0"
          width="521"
          height="630"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="-1.85" dy="9.25" stdDeviation="10.64" floodColor="#000" floodOpacity="0.1" />
          <feDropShadow dx="-9.25" dy="37" stdDeviation="19.43" floodColor="#000" floodOpacity="0.09" />
          <feDropShadow dx="-20.35" dy="84.19" stdDeviation="25.9" floodColor="#000" floodOpacity="0.05" />
        </filter>
      </defs>

      {/* Back plate */}
      <rect
        x="-61.4072"
        y="33.2617"
        width="326.262"
        height="386.337"
        rx="20"
        transform="rotate(9.21666 -61.4072 33.2617)"
        fill="#1A1919"
      />

      {/* Month calendar */}
      <g filter="url(#chl-shadow)">
        <g transform="translate(-168.258 66.959) rotate(-9.26916)">
          <rect width="337.669" height="355.915" rx="17.9492" fill="#242323" />
          <text x="218" y="38" textAnchor="end" fontSize="20" {...label}>
            March 2024
          </text>
          <path
            d="M303.5 25.5l6 6-6 6"
            stroke="#909090"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {WEEKDAYS.map((day, i) => (
            <text
              key={day}
              x={COLS[i]}
              y="77"
              textAnchor="middle"
              fontSize="11"
              fill="white"
              fillOpacity="0.4"
            >
              {day}
            </text>
          ))}
          <circle cx="168.8" cy="153.3" r="21.79" fill="#612BD3" />
          {days.map(({ d, col, row }) => (
            <text
              key={d}
              x={COLS[col]}
              y={ROWS[row] + 5.4}
              textAnchor="middle"
              fontSize="15"
              {...label}
            >
              {d}
            </text>
          ))}
          <rect x="237" y="312.3" width="83.28" height="26.14" rx="4.36" fill="#612BD3" />
          <text x="278.6" y="330" textAnchor="middle" fontSize="13" {...label}>
            Save
          </text>
        </g>
      </g>

      {/* Avatar card with the follower chip */}
      <g transform="translate(133.658 229.43) rotate(9.65685)">
        <rect width="167.303" height="186.031" rx="28.1882" fill="#3D3D3D" />
        <Initials cx={83.65} cy={83.65} r={62.51} text="AM" gradient="chl-pink" size={40} />
        <rect x="21.14" y="121.16" width="125.02" height="43.728" rx="21.864" fill="#2F70EF" />
        <g
          transform="translate(42 132) scale(1.15)"
          stroke="white"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7.5" cy="5.5" r="4.6" />
          <path d="M0 19c.6-4.2 3.6-6.6 7.5-6.6s6.9 2.4 7.5 6.6" />
          <path d="M14.2 1.4a4.6 4.6 0 0 1 0 8.4M18 12.8c2.4.9 3.9 3 4.3 6.2" />
        </g>
        <text x="101" y="151" textAnchor="middle" fontSize="23" fontWeight={600} {...label}>
          8.3K
        </text>
      </g>

      {/* Magic-wand button */}
      <rect x="47.9238" y="360.066" width="76.0762" height="76.0762" rx="16.6206" fill="#0E0E0E" />
      <rect
        x="48.1835"
        y="360.326"
        width="75.5568"
        height="75.5568"
        rx="16.3609"
        stroke="white"
        strokeOpacity="0.05"
        strokeWidth="0.519392"
      />
      <g stroke="white" strokeWidth="6.6" strokeLinecap="round">
        <path d="M70.6 414.4l18.2-18.2" />
        <path d="M93.4 391.6l3.2-3.2" />
      </g>
      <g fill="white">
        <path d="M80 377.4l1.6 3.6 3.6 1.6-3.6 1.6-1.6 3.6-1.6-3.6-3.6-1.6 3.6-1.6z" />
        <path d="M71.4 389.6l1.4 3.1 3.1 1.4-3.1 1.4-1.4 3.1-1.4-3.1-3.1-1.4 3.1-1.4z" />
        <path d="M100.6 398.4l1.4 3.1 3.1 1.4-3.1 1.4-1.4 3.1-1.4-3.1-3.1-1.4 3.1-1.4z" />
      </g>
    </svg>
  );
}

export function HeroCollageRight({
  badges,
  className,
}: {
  /** Two channel icon URLs for the schedule rows. */
  badges: [string | null, string | null];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 328 455"
      width="328"
      height="455"
      fill="none"
      aria-hidden
      focusable="false"
      className={`font-dm ${className ?? ''}`}
    >
      <defs>
        <AvatarGradients prefix="chr" />
        <linearGradient id="chr-photo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#120634" />
          <stop offset="0.55" stopColor="#2B12A8" />
          <stop offset="1" stopColor="#0B0525" />
        </linearGradient>
        <radialGradient id="chr-glow" cx="0.55" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#6C4BFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#6C4BFF" stopOpacity="0" />
        </radialGradient>
        <filter id="chr-neon" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <clipPath id="chr-photo-clip">
          <rect x="20" y="125.8" width="312" height="216" rx="15.29" />
        </clipPath>
      </defs>

      {/* Back plate */}
      <rect
        x="99.3867"
        y="163.014"
        width="234"
        height="293.462"
        rx="20"
        transform="rotate(-6 99.3867 163.014)"
        fill="#1A1919"
      />

      {/* Post card */}
      <g transform="translate(161.115 0.638672) rotate(10)">
        <rect width="352" height="361.802" rx="21.0227" fill="#242323" />
        <Initials cx={48.67} cy={48.67} r={28.67} text="YP" gradient="chr-violet" size={20} />
        <text x="89" y="45" fontSize="19" {...label}>
          Your page
        </text>
        <rect x="86.9" y="60.5" width="64.98" height="10.94" rx="5.47" fill="#3D3D3D" />
        <rect x="20" y="88.8" width="236.98" height="10.94" rx="5.47" fill="#3D3D3D" />
        <rect x="20" y="103.4" width="165.32" height="10.94" rx="5.47" fill="#3D3D3D" />
        <g clipPath="url(#chr-photo-clip)">
          <rect x="20" y="125.8" width="312" height="216" fill="url(#chr-photo)" />
          <rect x="20" y="125.8" width="312" height="216" fill="url(#chr-glow)" />
          <path
            d="M88 300c-8-40 18-86 52-92 30-5 34 30 12 40-24 11-30-34 0-58 28-22 72-14 92 12"
            stroke="#5B8CFF"
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#chr-neon)"
            opacity="0.9"
          />
          <path
            d="M88 300c-8-40 18-86 52-92 30-5 34 30 12 40-24 11-30-34 0-58 28-22 72-14 92 12"
            stroke="#E9EEFF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Day schedule */}
      <g transform="translate(0.112305 222.371) rotate(-6)">
        <rect width="229.531" height="218.357" rx="12.6448" fill="#242323" />
        <rect x="8.43" y="8.43" width="212.672" height="53.103" rx="5.283" fill="#464CED" />
        <text x="114.7" y="42.5" textAnchor="middle" fontSize="23" {...label}>
          Wed
        </text>

        <rect x="8.43" y="63.53" width="212.672" height="72.197" rx="5.283" fill="#3D3D3D" />
        <text x="23.3" y="105.4" fontSize="18" {...label}>
          10:00 AM
        </text>
        <Initials cx={181.83} cy={99.13} r={24.63} text="LR" gradient="chr-teal" size={15} />
        {badges[0] ? (
          <image href={badges[0]} x="188.9" y="104.4" width="24.12" height="24.12" />
        ) : null}

        <rect x="8.43" y="137.7" width="212.672" height="72.197" rx="5.283" fill="#3D3D3D" />
        <text x="24.3" y="179.7" fontSize="18" {...label}>
          3:00 PM
        </text>
        <Initials cx={181.83} cy={173.33} r={24.63} text="SK" gradient="chr-pink" size={15} />
        {badges[1] ? (
          <image href={badges[1]} x="188.9" y="178.6" width="24.12" height="24.12" />
        ) : null}
      </g>
    </svg>
  );
}
