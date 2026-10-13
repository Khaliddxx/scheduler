import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { capabilities, type Capability } from '@/content/features';
import { previewClip, previewImage, previewPoster } from '@/lib/preview-media';
import { CapabilitiesClip } from '@/components/sections/capabilities-clip';

/**
 * The capability panels: one gradient panel per entry in `capabilities`, each
 * pairing its copy with a looping product clip.
 *
 * Layout follows the reference design. Below 1360px every panel is a fixed-width
 * column (335px, 550px from 640px) with the media above the copy. From 1360px
 * they wrap into rows of a 778px + 530px pair, then a full 1320px panel with the
 * copy beside the media, which is why each panel's surface, width and direction
 * live in `panels` below rather than in a generic grid.
 *
 * Media: the clip lives in `public/preview/` (desktop cut) and
 * `public/preview/capabilities/mobile/` (phone cut), each with a still. The still
 * sizes the frame and shows until the clip plays; see capabilities-clip.tsx.
 */

type Panel = {
  /** Surface and wide-screen layout classes. */
  className: string;
  /** Clip name: desktop cut at /preview/<clip>, phone cut at /preview/capabilities/mobile/<clip>. */
  clip: string;
  /** Desktop still, relative to public/preview/. */
  poster: string;
  /** Frame aspect ratios: from 1360px, and below it. */
  ratio: { desktop: string; mobile: string };
  label: string;
};

const panels: Record<Capability['visual'], Panel> = {
  calendar: {
    className: 'bg-gradient-to-br from-[#4A0047] to-[#B611B0] 2xl:flex-col 2xl:w-[778px]',
    clip: 'scheduling',
    poster: 'scheduling.webp',
    ratio: { desktop: '1396 / 722', mobile: '640 / 416' },
    label: 'A week of posts in the calendar',
  },
  agents: {
    className:
      'bg-gradient-to-br from-[#9033ED] to-[#3C0078] 2xl:flex-col-reverse 2xl:w-[530px]',
    clip: 'ai-agents',
    poster: 'ai-agents.webp',
    ratio: { desktop: '900 / 722', mobile: '640 / 514' },
    label: 'The assistants that can drive the calendar',
  },
  editor: {
    className: 'bg-gradientBlue 2xl:flex-row 2xl:items-center 2xl:w-[1320px]',
    clip: 'design-ai',
    poster: 'design-ai.webp',
    ratio: { desktop: '1396 / 1000', mobile: '640 / 458' },
    label: 'The image editor',
  },
  team: {
    className: 'bg-gradient-to-br from-[#002584] to-[#24005E] 2xl:flex-col 2xl:w-[530px]',
    clip: '3',
    poster: 'capabilities/3.webp',
    ratio: { desktop: '450 / 369', mobile: '295 / 225' },
    label: 'Team members and their roles',
  },
  plugs: {
    className:
      'bg-gradient-to-br from-[#4C27E1] to-[#2F007B] 2xl:flex-col-reverse 2xl:w-[778px]',
    clip: '4',
    poster: 'capabilities/4.webp',
    ratio: { desktop: '1396 / 796', mobile: '1396 / 796' },
    label: 'A post picking up engagement',
  },
  analytics: {
    className:
      'bg-gradient-to-bl from-[#7B08D5] to-[#390053] 2xl:flex-row 2xl:items-center 2xl:w-[1320px]',
    clip: '5',
    poster: 'capabilities/5.webp',
    ratio: { desktop: '698 / 600', mobile: '295 / 225' },
    label: 'Analytics across channels',
  },
};

/**
 * Section heading. No content home yet, so it sits here as a named constant.
 * The last phrase carries the hand-drawn underline.
 */
const HEADING = {
  lead: ['The whole', 'publishing loop,'],
  underlined: 'in one place',
};

function Still({ src, ratio, label, className }: {
  src: string | null;
  ratio: string;
  label: string;
  className: string;
}) {
  const style: CSSProperties = { aspectRatio: ratio };
  if (!src) {
    return <div style={style} className={cn('w-full rounded-[16px] bg-black/30', className)} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      loading="lazy"
      decoding="async"
      style={style}
      className={cn('w-full rounded-[16px] object-cover object-top', className)}
    />
  );
}

function CapabilityPanel({ item }: { item: Capability }) {
  const panel = panels[item.visual];

  return (
    <li
      className={cn(
        'flex flex-col-reverse justify-between gap-5 rounded-[16px] border border-white/10 p-5 sm:w-[550px] sm:gap-[38px] sm:rounded-[32px] sm:p-10',
        'w-[335px]',
        panel.className,
      )}
    >
      <div className="space-y-4 sm:space-y-5">
        <div className="w-fit rounded-full bg-white/15 px-4 pb-[7px] pt-[6px] sm:pb-[9px] sm:pt-[8px]">
          <p className="text-[14px] font-medium uppercase leading-[18.23px] sm:text-[18px] sm:leading-[23.44px]">
            {item.eyebrow}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-balance font-jakarta text-[22px] font-semibold leading-[24.2px] sm:text-[38px] sm:leading-[41.8px]">
            {item.title}
          </h3>
          <p className="max-w-[570px] text-[18px] leading-[23.44px] sm:text-[22px] sm:leading-[28.64px]">
            {item.body}
          </p>
        </div>
      </div>

      <div className="relative w-full 2xl:max-w-[698px] 2xl:shrink-0">
        <CapabilitiesClip
          desktop={previewClip(panel.clip)}
          mobile={previewClip(`capabilities/mobile/${panel.clip}`)}
        />
        <Still
          src={previewImage(panel.poster) ?? previewPoster(panel.clip)}
          ratio={panel.ratio.desktop}
          label={panel.label}
          className="hidden 2xl:block"
        />
        <Still
          src={previewImage(`capabilities/mobile/${panel.clip}.webp`)}
          ratio={panel.ratio.mobile}
          label={panel.label}
          className="block 2xl:hidden"
        />
      </div>
    </li>
  );
}

export function Capabilities() {
  const underline = previewImage('capabilities/inoneplace-underline.svg');

  return (
    <section id="capabilities" className="section-pz !px-0 space-y-10 sm:space-y-20">
      <div className="relative space-y-3">
        <h2 className="h2-pz max-w-[768px]">
          {HEADING.lead[0]} <br className="sm:hidden" />
          {HEADING.lead[1]}
          <br />
          <span className="relative inline-block">
            {HEADING.underlined}
            {underline ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={underline}
                alt=""
                aria-hidden
                width={316}
                height={22}
                className="pointer-events-none absolute left-[-101px] top-[calc(100%+1px)] block h-[22px] w-[316px] max-w-none scale-[0.6] select-none mobile:hidden md:left-[-20px] md:top-[calc(100%+14px)] md:block md:scale-100"
              />
            ) : null}
          </span>
        </h2>
      </div>

      <ul className="flex flex-col justify-center gap-2 sm:gap-3 2xl:flex-row 2xl:flex-wrap">
        {capabilities.map((item) => (
          <CapabilityPanel key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
