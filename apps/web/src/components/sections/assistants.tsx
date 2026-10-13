import { cn } from '@/lib/cn';
import { VideoFrame } from '@/components/ui/video-frame';
import { assistants, automation } from '@/content/assistants';
import { AssistantGlyph, AutomateGlyph } from './assistants-glyphs';

/**
 * "Power your content": a two-line centred heading with one word circled, then
 * a two-column grid of assistant cards and one full-width automation card.
 * Built to the reference design's spec, class for class:
 *
 *   grid   2 columns (1 below `sm`), 12px gap
 *   card   40px padding, 40px gap, 32px radius, at least 636px tall; the clip
 *          sits under the copy or above it, alternating like a checkerboard,
 *          and always under it on phones
 *   title  42px white mark + 38px/600 Jakarta, 12px apart
 *   body   22px DM Sans at 90% white
 *   clip   574:400, 24px radius, black behind it, pushed to the card's far end
 *
 * No eyebrow, sub-copy or hover state, as in the reference.
 */

/** Card fill and clip position, per assistant, in the reference's pattern. */
const look: Record<string, { bg: string; clip: 'top' | 'bottom' }> = {
  chatgpt: { bg: 'bg-boxThree', clip: 'bottom' },
  claude: { bg: 'bg-boxTwo', clip: 'top' },
  'claude-code': { bg: 'bg-boxOne', clip: 'bottom' },
  'grok-bot': { bg: 'bg-boxFour', clip: 'top' },
  hermes: { bg: 'bg-boxTwo', clip: 'bottom' },
  muse: { bg: 'bg-boxThree', clip: 'top' },
};
const fallbackLook = [
  { bg: 'bg-boxThree', clip: 'bottom' },
  { bg: 'bg-boxTwo', clip: 'top' },
] as const;

/** Hand-drawn loop around the circled word. Our own stroke, in the reference's pink. */
function Circle() {
  return (
    <svg
      width="66"
      height="70"
      viewBox="0 0 66 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:h-[38px] max-sm:w-[51px]"
      aria-hidden
      focusable="false"
    >
      <path
        d="M51.5 6.5C39 0.5 13.5 -1 5 27.5C-5.5 63.5 33 69.5 49.5 64C58.5 60.5 64 51.5 64 39.5C64 26.5 53.5 6 33 9.5"
        stroke="#FC7CFF"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Assistants() {
  return (
    <section id="assistants" className="section-pz text-white">
      <div className="mb-[60px] flex justify-center max-sm:mb-[40px]">
        <h2 className="h2-pz max-w-[768px] whitespace-pre max-sm:whitespace-normal">
          {'Power your content\nfrom the '}
          <span className="relative inline-block">
            AI
            <Circle />
          </span>
          {' you use'}
        </h2>
      </div>

      <ul className="grid w-full grid-cols-2 gap-[12px] max-sm:grid-cols-1">
        {assistants.map((item, index) => {
          const { bg, clip } = look[item.id] ?? fallbackLook[index % fallbackLook.length];
          const title = `Via ${item.via}`;

          return (
            <li
              key={item.id}
              className={cn(
                'flex min-h-[636px] gap-[40px] rounded-[32px] p-[40px] max-sm:min-h-0 max-sm:!flex-col-reverse max-sm:gap-[20px] max-sm:rounded-[24px] max-sm:p-[20px]',
                clip === 'top' ? 'flex-col-reverse' : 'flex-col',
                bg,
              )}
            >
              <div className="flex flex-col gap-[16px] max-sm:gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <AssistantGlyph id={item.id} />
                  <h3 className="font-jakarta text-[38px] font-[600] leading-[1.1] max-sm:text-[22px]">
                    {title}
                  </h3>
                </div>
                <p className="font-dm text-[22px] leading-normal text-white/90 max-sm:text-[18px]">
                  {item.body}
                </p>
              </div>
              <div className="relative mt-auto aspect-[574/400] w-full overflow-hidden rounded-[24px] bg-black max-sm:rounded-[16px]">
                <VideoFrame name={item.clip} fit="cover" label={`${item.via} drafting posts`} />
              </div>
            </li>
          );
        })}

        <li className="col-span-2 flex min-h-[430px] items-center gap-[40px] rounded-[32px] bg-boxOne p-[40px] max-sm:col-span-1 max-sm:min-h-0 max-sm:flex-col-reverse max-sm:items-stretch max-sm:gap-[20px] max-sm:rounded-[24px] max-sm:p-[20px]">
          <div className="flex w-[375px] shrink-0 flex-col gap-[16px] max-sm:w-full max-sm:gap-[12px]">
            <div className="flex flex-col gap-[20px] max-sm:flex-row max-sm:items-center max-sm:gap-[12px]">
              <AutomateGlyph />
              <h3 className="max-w-[329px] font-jakarta text-[38px] font-[600] leading-[1.1] max-sm:text-[22px]">
                {automation.title}
              </h3>
            </div>
            <p className="max-w-[312px] font-dm text-[22px] font-[500] leading-normal text-white/80 max-sm:max-w-none max-sm:text-[18px] max-sm:font-[400] max-sm:text-white/90">
              {automation.body}
            </p>
          </div>
          <div className="relative aspect-[825/350] w-full flex-1 overflow-hidden rounded-[24px] bg-black max-sm:aspect-[574/400] max-sm:rounded-[16px] max-sm:[&_img]:object-left max-sm:[&_video]:object-left">
            <VideoFrame name={automation.clip} fit="cover" label="A workflow calling the public API" />
          </div>
        </li>
      </ul>
    </section>
  );
}
