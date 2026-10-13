import { brand, registerUrl } from '@scheduler/brand';
import { HeroHeadline, type HeadlineAgent } from '@/components/sections/hero-headline';
import { HeroLoop, HeroStar } from '@/components/ui/doodles';
import { SocialIcon, channelsInDisplayOrder } from '@/components/ui/social-icon';
import { channelCount } from '@/content/channels';
import { TRIAL_DAYS } from '@/content/pricing';
import { previewImage } from '@/lib/preview-media';

/**
 * Home page hero, laid out on the reference design's measurements:
 * a 51px row of credibility chips, the headline (40/44 → 70/77 from 640px,
 * Jakarta 800), the subtitle, one call to action, and the channel icons in a
 * 10 / 15-column grid. Vertical rhythm comes from fixed spacers and a 30px
 * `space-y`, exactly as the reference builds it.
 *
 * Top margin: the reference puts this section 106px (147px from 640px) below
 * the top of the page, under a fixed header. Our header leaves a 60px / 81px
 * spacer in the flow (layout/header-bar.tsx), so the margin here is the rest.
 *
 * The headline and subtitle live in a client component because they follow
 * the agentic / classic switch in the showcase panel below.
 */

/** Assistants cycled in the headline, all ones Kolo connects to. */
const ROTATION: Omit<HeadlineAgent, 'logo'>[] = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'grok-bot', name: 'Grok Bot' },
  { id: 'muse', name: 'Muse' },
  { id: 'codex', name: 'Codex' },
  { id: 'openclaw', name: 'OpenClaw' },
  { id: 'hermes', name: 'Hermes' },
];

const credibility: string[] = [
  'Open source core',
  `${channelCount} networks`,
  `${TRIAL_DAYS}-day free trial`,
];

/** Double chevron, 1.5px round stroke on a 25-unit grid. */
const Chevrons = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 25 25"
    fill="none"
    aria-hidden
    className="h-5 w-5 md:h-6 md:w-6"
  >
    <path
      d="M6.4 17.5l5-5-5-5M13.4 17.5l5-5-5-5"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Hero() {
  const agents: HeadlineAgent[] = [
    { id: 'any', name: 'any AI agent', logo: null },
    ...ROTATION.map((a) => ({ ...a, logo: previewImage(`agents/${a.id}.svg`) })),
  ];

  return (
    <section className="section-pz !mt-[46px] !pb-0 !pt-0 space-y-[30px] sm:!mt-[66px]">
      <div className="flex flex-col items-center">
        {/* Sits where the reference shows its award laurels: same 51px band. */}
        <ul className="flex h-[51px] items-center justify-center gap-[6px] sm:gap-2">
          {credibility.map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-control bg-white/[0.06] px-2.5 py-1.5 text-[12px] leading-[1.3] text-muted shadow-hairline sm:px-3.5 sm:text-body-xs"
            >
              <span aria-hidden className="hidden h-1.5 w-1.5 rounded-full bg-white/30 sm:block" />
              {chip}
            </li>
          ))}
        </ul>

        <div className="min-h-[12px] sm:min-h-[10px]" />

        <HeroHeadline
          agents={agents}
          lead="Run your whole social"
          joiner="calendar from"
          tagline={brand.tagline}
          agenticSubtitle={brand.description}
          classicSubtitle={`Plan every post on one calendar, publish to all ${channelCount} networks on time,\nand see what worked so next week is easier to fill.`}
        />
      </div>

      <div className="flex justify-center">
        <a
          href={registerUrl()}
          className="flex h-fit w-fit cursor-pointer items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white py-[12px] pl-[24px] pr-[16px] text-[16px] font-medium leading-[20.83px] text-[#0e0e0e] stroke-[#0e0e0e] transition-all hover:bg-pink hover:text-white hover:stroke-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:!pl-8 sm:!pr-6 sm:py-4 sm:text-[19px] sm:leading-[25px] min-[1024px]:py-[16px] min-[1024px]:pl-[32px] min-[1024px]:pr-[24px] min-[1024px]:leading-[24.74px]"
        >
          Start a {TRIAL_DAYS}-day free trial
          <Chevrons />
        </a>
      </div>

      <div className="grid gap-[8px] max-sm:grid-cols-10 sm:grid-cols-15">
        {channelsInDisplayOrder.map((channel) => (
          <SocialIcon key={channel.slug} channel={channel} className="h-6 w-6 sm:h-8 sm:w-8" />
        ))}
      </div>

      {/*
        Positioned against the page, not the section (no positioned ancestor),
        like the reference: 296px + the 30px space-y margin from the top of the
        document on the left, 120px + 30px on the right. Desktop only.
      */}
      <HeroLoop className="absolute left-0 top-[296px] hidden lg:block" />
      <HeroStar className="absolute right-0 top-[120px] hidden lg:block" />
    </section>
  );
}
