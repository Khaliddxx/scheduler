import { HeroModeToggle } from '@/components/sections/hero-mode-toggle';
import { ModeShowcase, type ShowcaseClip } from '@/components/ui/mode-showcase';
import type { Mode } from '@/lib/mode';
import { previewClip, previewPoster } from '@/lib/preview-media';

/**
 * Which clip each mode shows. Resolved on the server so the client only ever
 * receives paths that exist; a missing file leaves that mode's frame empty.
 */
const resolveClips = (): Partial<Record<Mode, ShowcaseClip>> => {
  const out: Partial<Record<Mode, ShowcaseClip>> = {};

  const agentic = previewClip('hero-agentic');
  if (agentic) out.agentic = { src: agentic, poster: previewPoster('hero-agentic') ?? undefined };

  const classic = previewClip('scheduling');
  if (classic) out.classic = { src: classic, poster: previewPoster('scheduling') ?? undefined };

  return out;
};

/**
 * The block directly under the hero: the agentic / classic switch, then the
 * full-width media panel (16px radius, 32px from 640px), 40px / 60px below
 * the icon grid, as on the reference. The switch also drives the hero's
 * headline and subtitle.
 */
export function ShowcasePanel() {
  return (
    <section
      aria-label="Product preview"
      className="section-pz flex justify-center !pb-0 !pt-[40px] sm:!pt-[60px]"
    >
      <HeroModeToggle />
      <div className="relative w-full overflow-hidden rounded-[16px] bg-cover sm:rounded-[32px]">
        <ModeShowcase clips={resolveClips()} />
      </div>
    </section>
  );
}
