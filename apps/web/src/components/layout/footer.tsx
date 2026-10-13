import Link from 'next/link';
import { brand, registerUrl } from '@scheduler/brand';
import { agentsMenu, footerColumns } from '@/content/nav';
import { previewImage } from '@/lib/preview-media';
import { channelCount } from '@/content/channels';
import { Logo } from '@/components/ui/logo';
import { DoubleChevron, startPillClass } from '@/components/layout/header-icons';

const YEAR = 2026;

/**
 * Giant brand name at the foot of the call-to-action block, cut off by the
 * block's bottom edge.
 *
 * `sticky` with a negative bottom inset makes it rise into place as the block
 * scrolls up: until the block is well into view the word is held against the
 * bottom of the viewport, then it settles. No script, no animation, so there is
 * nothing for reduced-motion settings to switch off.
 *
 * Drawn as SVG text in a fixed 1188x541 box so it scales with the width of the
 * block like an image. The size is worked out from the length of the name, so a
 * rename never overflows the box. Decorative, hence aria-hidden.
 */
function Wordmark() {
  const name = brand.name;
  const W = 1188;
  const H = 541;
  // Plus Jakarta Sans ExtraBold: ~0.545em of ink per letter, ascender ~0.77em.
  // The baseline sits one ascender down so the tallest letter touches the top.
  const size = Math.min(545, W / (0.545 * Math.max(name.length, 1)));
  return (
    <svg
      aria-hidden
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      data-wordmark
      className="pointer-events-none sticky bottom-[-13%] h-auto max-w-full shrink-0 select-none md:bottom-[-32%]"
    >
      <text
        x={W / 2}
        y={Math.round(size * 0.77)}
        textAnchor="middle"
        fontSize={size}
        fill="#E064FF"
        className="font-jakarta font-extrabold"
      >
        {name}
      </text>
    </svg>
  );
}

const GitHubIcon = () => (
  <svg aria-hidden width="21" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
  </svg>
);

const MailIcon = () => (
  <svg aria-hidden width="22" height="18" viewBox="0 0 22 18" fill="none">
    <rect x="1.75" y="1.75" width="18.5" height="14.5" rx="2.5" stroke="white" strokeWidth="1.5" />
    <path d="M2.5 3l8.5 6.5L19.5 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const roundButton =
  'flex h-11 w-11 items-center justify-center rounded-full bg-[#3e3e3e] transition-all hover:bg-pink';

/**
 * Footer: the closing call to action, then the link columns.
 *
 * The bottom row is not decoration. The engine is AGPL-3.0, and section 13
 * obliges an operator of a modified network service to offer that modified
 * source to its users; docs/06-agpl-compliance.md also asks for a
 * non-affiliation statement here. A persistent, prominent link discharges
 * that obligation and costs nothing. Do not remove it.
 */
/** The assistants column: the same list as the header's AI Agents menu. */
function AgentsColumn() {
  return (
    <div className="space-y-3 sm:space-y-5">
      <p className="font-bold">AI Agents</p>
      <ul className="space-y-2 sm:space-y-3">
        {agentsMenu.map((agent) => {
          const src = previewImage(`agents/${agent.logo}.svg`);
          return (
            <li key={agent.label} className="transition-all hover:text-pink 2xl:whitespace-nowrap">
              <Link
                href={agent.href}
                className="flex items-center justify-center gap-2 sm:justify-start"
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    width={24}
                    height={24}
                    draggable={false}
                    className={
                      agent.ownTile
                        ? 'h-5 w-5 shrink-0'
                        : 'h-5 w-5 shrink-0 select-none rounded-[27%] ring-1 ring-inset ring-white/25'
                    }
                  />
                ) : null}
                {agent.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-col items-center">
      {/* Call to action */}
      <div className="relative flex h-[500px] w-full flex-col items-center gap-[77px] overflow-hidden rounded-t-[20px] bg-[#1A1919] px-5 pt-[80px] sm:h-[770px] sm:gap-[65px] sm:rounded-t-[32px] sm:px-12 sm:pt-[140px]">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center font-jakarta text-[40px] font-bold leading-[44px] sm:text-[60px] sm:leading-[66px]">
            Start posting with {brand.name}
          </h2>
          <p className="mb-4 max-w-[538px] text-center text-[18px] leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]">
            Plan and publish to {channelCount} networks from one calendar.
            <br />
            Let your own AI agents do the drafting.
          </p>
          <div>
            <a href={registerUrl()} className={startPillClass('lg')}>
              Start for $0
              <DoubleChevron className="h-5 w-5 md:h-6 md:w-6" />
            </a>
          </div>
        </div>
        <Wordmark />
      </div>

      {/* Links */}
      <div className="w-full max-w-[1440px] px-5 pb-10 pt-[60px] sm:px-20 sm:pb-8 sm:pt-16">
        <div className="flex flex-col items-center justify-between gap-[60px] text-center text-[18px] leading-[23.4px] sm:text-left xl:flex-row">
          <div className="flex min-w-[320px] flex-col items-center justify-center space-y-3 lg:items-start">
            <Logo className="[&]:gap-4 [&>span:first-child]:h-[50px] [&>span:first-child]:w-[50px] [&>span:first-child]:rounded-[16px] [&>span:first-child]:text-[26px] [&>span:last-child]:text-[34px]" />
            <p>{brand.tagline}.</p>
            <ul className="flex justify-center gap-[10px]">
              <li>
                <a
                  href={brand.upstream.sourceOfferUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brand.name} source code on GitHub`}
                  className={roundButton}
                >
                  <GitHubIcon />
                </a>
              </li>
              {brand.supportEmail ? (
                <li>
                  <a
                    href={`mailto:${brand.supportEmail}`}
                    aria-label={`Email ${brand.name} support`}
                    className={roundButton}
                  >
                    <MailIcon />
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="flex w-full max-w-[820px] flex-col justify-between gap-[60px] sm:flex-row sm:flex-wrap xl:flex-nowrap">
            {footerColumns.map((col, i) => [
              i === 1 ? <AgentsColumn key="ai-agents" /> : null,
              <div key={col.title} className="space-y-3 sm:space-y-5">
                <p className="font-bold">{col.title}</p>
                <ul className="space-y-2 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href} className="transition-all hover:text-pink 2xl:whitespace-nowrap">
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>,
            ])}
          </div>
        </div>

        <div className="my-10 min-h-[1px] w-full bg-white/10 sm:my-8" />

        <div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row">
          <div className="flex flex-col-reverse items-center gap-2 text-center text-[14px] leading-[18.23px] text-[#D1D1D1] sm:gap-8 md:flex-row md:text-left">
            <p>
              &copy; {brand.legalName || brand.name}, {YEAR}. All rights reserved.
            </p>
            <p>
              Built on{' '}
              <a
                href={brand.upstream.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {brand.upstream.project}
              </a>
              , licensed {brand.upstream.licence}.
            </p>
            <p>
              <a
                href={brand.upstream.sourceOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-white"
              >
                Source for the version we run
              </a>
              . {brand.name} is not affiliated with or endorsed by the {brand.upstream.project}{' '}
              project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
