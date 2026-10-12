import { ModeShowcase, type ShowcaseClip } from '@/components/ui/mode-showcase';
import type { Mode } from '@/lib/mode';
import { previewClip, previewPoster } from '@/lib/preview-media';

/**
 * Which clip each hero mode shows. Resolved on the server so the client only
 * ever receives paths that exist; a missing file simply drops that mode.
 */
const resolveClips = (): Partial<Record<Mode, ShowcaseClip>> => {
  const out: Partial<Record<Mode, ShowcaseClip>> = {};

  const agentic = previewClip('hero-agentic');
  if (agentic) {
    out.agentic = {
      src: agentic,
      poster: previewPoster('hero-agentic') ?? undefined,
      ratio: '1920 / 1018',
      title: 'Tell it what you want to publish',
      caption: 'via your assistant',
    };
  }

  const classic = previewClip('scheduling');
  if (classic) {
    out.classic = {
      src: classic,
      poster: previewPoster('scheduling') ?? undefined,
      ratio: '1396 / 722',
      title: 'Plan the week yourself, in one calendar',
      caption: 'every channel, one view',
    };
  }

  return out;
};

/**
 * The gradient showcase that sits directly under the hero.
 *
 * One full-width panel in the brand gradient, a single line of copy, and the
 * product footage. It is the first thing a visitor sees after the headline, so
 * it carries the "agent does the work" claim visually rather than in prose:
 * the heading names the action, the footage shows it done.
 *
 * Layout notes
 * ------------
 * - The heading pins to the top and the footage to the bottom (`mt-auto` on
 *   the caption), so the panel keeps its presence at the minimum height even
 *   before the footage is present and the fallback slot is showing.
 * - The footage frame carries a small negative bottom margin, eating into the
 *   panel's bottom padding, so it reads as sitting ON the panel's lower edge
 *   rather than floating in the middle of it.
 * - Colours come from the brand variables only; the gradient is the same
 *   violet-to-magenta sweep the stat band and feature cards use, laid at an
 *   angle so the left edge reads cool and the right edge warm.
 */
export function ShowcasePanel() {
  const clips = resolveClips();
  const hasFootage = Boolean(clips.agentic || clips.classic);

  return (
    <section aria-labelledby="showcase-heading" className="shell">
      <div
        className="relative isolate flex min-h-[420px] flex-col items-center overflow-hidden rounded-card-lg px-4 pb-10 pt-8 text-center shadow-hairline-strong sm:min-h-[560px] sm:px-10 sm:pb-12 sm:pt-14"
        style={{
          backgroundImage:
            'linear-gradient(104deg, var(--gradient-from) 0%, var(--gradient-via) 36%, var(--gradient-to) 74%, var(--accent-deep) 100%)',
        }}
      >
        {/*
          Two soft highlights over the flat gradient: a warm one bottom-right
          where the footage lands, a cool one top-left behind the heading.
          Negative z-index inside the panel's own stacking context puts them
          above its background and below its content.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: [
              'radial-gradient(60% 55% at 86% 100%, color-mix(in srgb, var(--accent) 42%, transparent), transparent 72%)',
              'radial-gradient(50% 60% at 8% 0%, color-mix(in srgb, var(--gradient-from) 70%, transparent), transparent 70%)',
            ].join(', '),
          }}
        />

        {hasFootage ? (
          <ModeShowcase clips={clips} />
        ) : (
          <>
            <h2
              id="showcase-heading"
              className="max-w-[20ch] font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-display-sm"
            >
              Tell it what you want to publish
            </h2>

            <p className="mt-auto pt-10 text-body-lg text-white/70 sm:pt-16">via your assistant</p>

            <div className="-mb-4 mt-4 w-full max-w-[820px] sm:-mb-5 sm:mt-5">
              <div
                className="flex items-center justify-center rounded-[14px] bg-black/20 shadow-lift"
                style={{ aspectRatio: '1920 / 1018' }}
              >
                <span className="px-6 text-center text-body-xs leading-relaxed text-white/50">
                  A week planned by an agent
                  <br />
                  <span className="text-white/30">drop hero-agentic.webm into public/preview/</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
