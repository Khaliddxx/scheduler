import { HeroModeToggle } from '@/components/sections/hero-mode-toggle';
import { ModeShowcase, type ShowcaseClip } from '@/components/ui/mode-showcase';
import type { Mode } from '@/lib/mode';
import { previewClip, previewPoster } from '@/lib/preview-media';

/**
 * Which clip each mode shows. Resolved on the server so the client only ever
 * receives paths that exist; a missing file leaves that mode's frame empty.
 */
const resolveClip = (name: string): ShowcaseClip | undefined => {
  const src = previewClip(name);
  if (!src) return undefined;
  return {
    src,
    poster: previewPoster(name) ?? undefined,
    mobileSrc: previewClip(`${name}-mobile`) ?? undefined,
    mobilePoster: previewPoster(`${name}-mobile`) ?? undefined,
  };
};

const resolveClips = (): Partial<Record<Mode, ShowcaseClip>> => ({
  agentic: resolveClip('hero-agentic'),
  classic: resolveClip('hero-classic'),
});

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
