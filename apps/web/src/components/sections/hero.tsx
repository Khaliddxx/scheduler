import type { CSSProperties } from 'react';
import { brand, registerUrl } from '@scheduler/brand';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Sparkle, Squiggle } from '@/components/ui/doodles';
import { sellableChannels as channels, channelCount, type Channel } from '@/content/channels';
import { TRIAL_DAYS } from '@/content/pricing';

/**
 * Home page hero.
 *
 * Every string here resolves from brand.json or src/content — the headline is
 * `brand.tagline` split in two so the gradient can land on its closing phrase,
 * and the counts are computed from the channel list. Renaming or re-pitching the
 * product is therefore a content change, never an edit to this file.
 */

/** The tile cloud under the calls to action: two rows of ten networks. */
const TILE_ROWS = 2;
const TILES_PER_ROW = 10;

const tileRows: Channel[][] = Array.from({ length: TILE_ROWS }, (_, row) =>
  channels.slice(row * TILES_PER_ROW, (row + 1) * TILES_PER_ROW),
).filter((row) => row.length > 0);

/**
 * Split the tagline into a lead and a closing phrase, so exactly one phrase can
 * carry the brand gradient. Word-count based rather than hardcoded, because the
 * tagline can be overridden by NEXT_PUBLIC_BRAND_TAGLINE at deploy time.
 */
function splitTagline(tagline: string): { lead: string; closing: string } {
  const words = tagline.trim().split(/\s+/);
  if (words.length < 3) return { lead: '', closing: tagline.trim() };
  const take = Math.min(3, Math.ceil(words.length / 3));
  return {
    lead: words.slice(0, words.length - take).join(' '),
    closing: words.slice(words.length - take).join(' '),
  };
}

const credibility: string[] = [
  'Open source core',
  `${channelCount} networks`,
  `${TRIAL_DAYS}-day free trial`,
];

export function Hero() {
  const { lead, closing } = splitTagline(brand.tagline);

  return (
    <section className="relative isolate">
      {/*
        Ambient glow behind the headline.

        Two nested elements on purpose: the OUTER one owns the centring
        translate, the INNER one owns the drift animation. Put both on one
        element and the animation's `transform` replaces the centring outright,
        and the glow slides off to one side.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[min(1100px,100%)] -translate-x-1/2"
      >
        <div
          className="drift h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(45% 46% at 50% 42%, color-mix(in srgb, var(--primary) 34%, transparent), transparent 72%)',
          }}
        />
      </div>

      {/*
        Bottom padding is deliberately short: the gradient showcase panel sits
        directly under this section and the two read as one composition, with
        roughly 40px between the toggle and the panel's top edge.
      */}
      <div className="shell relative flex flex-col items-center pb-8 pt-14 text-center sm:pb-10 sm:pt-24 lg:pt-28">
        {/*
          Hand-drawn marks in the dead space either side of the headline:
          squiggle lower-left, sparkle upper-right. Desktop only — below lg
          there is no dead space, and a mark crossing the text is worse than
          none. Both components set aria-hidden and pointer-events-none, and
          they sit outside `.stagger` so they do not join the entrance.
        */}
        <Squiggle className="absolute left-0 top-[300px] hidden w-[180px] -translate-x-[28%] text-white opacity-70 lg:block xl:w-[250px]" />
        <Sparkle className="absolute right-2 top-[150px] hidden h-11 w-11 text-white lg:block xl:right-6" />

        <div className="stagger flex w-full flex-col items-center">
          <ul style={{ "--i": 0 } as CSSProperties} className="flex flex-wrap items-center justify-center gap-2">
            {credibility.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-control bg-white/[0.06] px-3.5 py-1.5 text-body-xs text-muted shadow-hairline"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/30" />
                {chip}
              </li>
            ))}
          </ul>

          {/*
            `break-words` because the tagline is deploy-time configurable
            (NEXT_PUBLIC_BRAND_TAGLINE): a single long word at 40px would
            otherwise push the page wider than a 390px viewport.
          */}
          <h1 style={{ "--i": 1 } as CSSProperties} className="mx-auto mt-7 max-w-[19ch] break-words font-display text-[40px] font-extrabold leading-[1.06] tracking-[-0.02em] text-white sm:mt-8 sm:text-display-md sm:font-extrabold md:text-display-lg md:font-extrabold lg:text-display-xl">
            {lead ? `${lead} ` : null}
            <span className="text-gradient inline sm:inline-block">{closing}</span>
          </h1>

          <p style={{ "--i": 2 } as CSSProperties} className="mx-auto mt-6 max-w-[54ch] text-body-md text-muted">
            {brand.description}
          </p>

          <div style={{ "--i": 3 } as CSSProperties} className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              href={registerUrl()}
              external
              size="lg"
              withChevron
              className="w-full sm:w-auto"
            >
              Start free — {TRIAL_DAYS} days
            </Button>
            <Button href="/channels" variant="ghost" size="lg" className="w-full sm:w-auto">
              See all {channelCount} networks
            </Button>
          </div>

          {/*
            Decorative: the marks are the networks' own trademarks shown to
            signal breadth, and they carry no text. The secondary call to
            action above and the band below name the networks properly, so
            hiding this from assistive tech loses nothing.
          */}
          <div
            aria-hidden
            style={{ '--i': 4 } as CSSProperties}
            className="mt-14 flex w-full max-w-[680px] flex-col gap-2.5 sm:mt-16 sm:gap-3"
          >
            {tileRows.map((row, index) => (
              <div
                key={row[0]?.slug ?? index}
                className={cn(
                  'flex flex-wrap items-center justify-center gap-2.5 sm:gap-3',
                  index % 2 === 1 && 'sm:translate-x-7',
                )}
              >
                {row.map((channel) => (
                  <ChannelIcon
                    key={channel.slug}
                    channel={channel}
                    size={44}
                    className="tile-hover"
                  />
                ))}
              </div>
            ))}
          </div>

          {/*
            Mode switch. A client component, imported into this Server
            Component; the wrapper carries the stagger index because the
            switch owns its own class list.
          */}
          <div style={{ '--i': 5 } as CSSProperties} className="mt-10 sm:mt-12">
            <ModeToggle left="I need agentic scheduling" right="I need classic scheduling" />
          </div>
        </div>
      </div>
    </section>
  );
}
