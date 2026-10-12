import { cn } from '@/lib/cn';

/**
 * Small glyphs for the mega-menu rows.
 *
 * Original line marks on a 24x24 grid, one weight, one cap style, so a column
 * of fifteen of them reads as a set. They sit on a tinted tile rather than
 * bare, because a 16px line mark alone on a dark panel disappears.
 */

const P = ({ d }: { d: string }) => (
  <path
    d={d}
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

const GLYPHS: Record<string, React.ReactNode> = {
  claude: <P d="M12 3v18M6.2 6.2l11.6 11.6M3 12h18M6.2 17.8 17.8 6.2" />,
  openai: <P d="M12 3.6a4 4 0 0 1 3.9 3.1 4 4 0 0 1 2 7 4 4 0 0 1-5.9 3.3 4 4 0 0 1-5.9-3.3 4 4 0 0 1 2-7A4 4 0 0 1 12 3.6Z" />,
  terminal: (
    <>
      <P d="M3 5h18v14H3z" />
      <P d="M7 10l2.5 2L7 14M12.5 14.5H17" />
    </>
  ),
  cursor: <P d="M5 3l14 7.5-6 1.8-2.6 5.7L5 3Z" />,
  sparkle: <P d="M12 3c.8 4.6 4.4 8.2 9 9-4.6.8-8.2 4.4-9 9-.8-4.6-4.4-8.2-9-9 4.6-.8 8.2-4.4 9-9Z" />,
  plug: (
    <>
      <P d="M9 3v5M15 3v5" />
      <P d="M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4" />
    </>
  ),
  braces: <P d="M9 4c-2 0-2.5 1-2.5 3v2c0 2-1 2.5-2.5 3 1.5.5 2.5 1 2.5 3v2c0 2 .5 3 2.5 3M15 4c2 0 2.5 1 2.5 3v2c0 2 1 2.5 2.5 3-1.5.5-2.5 1-2.5 3v2c0 2-.5 3-2.5 3" />,
  webhook: (
    <>
      <P d="M8.5 11a3.5 3.5 0 1 1 5.2 3L11 19" />
      <P d="M15.5 13a3.5 3.5 0 1 1-1.2 6.4H8.5" />
      <P d="M9.6 17.4A3.5 3.5 0 1 1 5 12.6l2.4-4.2" />
    </>
  ),
  workflow: (
    <>
      <P d="M4 5h5v5H4zM15 14h5v5h-5z" />
      <P d="M9 7.5h4a2 2 0 0 1 2 2v5" />
    </>
  ),
  bolt: <P d="M13.5 3 5 13.5h5.5L10 21l8.5-10.5H13L13.5 3Z" />,
  rss: (
    <>
      <P d="M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <P d="M5 12a7 7 0 0 1 7 7M5 5a14 14 0 0 1 14 14" />
    </>
  ),
  book: <P d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />,
  scales: <P d="M12 4v16M6 8h12M4 8l-2 6h4l-2-6ZM20 8l-2 6h4l-2-6ZM8 20h8" />,
  code: <P d="M9 8l-5 4 5 4M15 8l5 4-5 4" />,
  users: (
    <>
      <P d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0" />
      <P d="M16 11.5a3 3 0 0 0 0-6M17 14.6a5.5 5.5 0 0 1 4 5.4" />
    </>
  ),
};

export function IntegrationGlyph({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const glyph = GLYPHS[name] ?? GLYPHS.sparkle;
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]',
        'bg-white/[0.06] text-white/70 shadow-hairline',
        'transition-colors duration-200 group-hover/row:bg-white/[0.12] group-hover/row:text-white',
        className,
      )}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" focusable="false">
        {glyph}
      </svg>
    </span>
  );
}
