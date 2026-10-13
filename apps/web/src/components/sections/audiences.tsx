import type { ComponentType } from 'react';
import { brand } from '@scheduler/brand';
import { BagIcon, FaceIcon, TerminalIcon } from '@/components/ui/doodles';
import { audiences } from '@/content/features';

/**
 * "Who is it for?": three bare, centred columns straight off `audiences`, laid
 * out to the reference design's spec (one column below `lg`, three from it;
 * 104px mark, 30px title, 19px body capped at 420px).
 *
 * No card chrome and no hover state, as in the reference: the sections either
 * side are boxes, so this one gives the eye a rest.
 *
 * The marks are our own doodles (components/ui/doodles), drawn in the same hand
 * as the hero's squiggle, in the reference's three stroke colours. They are
 * picked by position: the audiences are a fixed, ordered trio (creators,
 * agencies, builders) and the marks are drawn for exactly those three ideas.
 */

const marks: ReadonlyArray<{ Icon: ComponentType<{ className?: string }>; color: string }> = [
  { Icon: FaceIcon, color: '#F583FF' },
  { Icon: BagIcon, color: '#AB77FF' },
  { Icon: TerminalIcon, color: '#657DFF' },
];

export function Audiences() {
  return (
    // `id` is the target of the nav's "How it works" link.
    <section
      id="how-it-works"
      className="section-pz space-y-[40px] py-[64px] text-white sm:space-y-[60px] sm:py-[120px]"
    >
      <h2 className="h2-pz">Who is {brand.name} for?</h2>

      <ul className="grid w-full grid-cols-1 gap-x-[40px] gap-y-[40px] lg:grid-cols-3">
        {audiences.map((audience, index) => {
          const { Icon, color } = marks[index % marks.length];

          return (
            <li key={audience.id} className="flex h-full flex-col items-center text-center">
              {/* The doodles fill their viewBox edge to edge; at 74% of the box they
                  sit at the same drawn size as the reference's 104px marks. */}
              <span
                aria-hidden
                className="-mt-[8px] mb-[8px] flex h-[88px] w-[88px] items-center justify-center sm:mb-[10px] sm:h-[104px] sm:w-[104px]"
                style={{ color }}
              >
                <Icon className="h-[74%] w-[74%]" />
              </span>
              <h3 className="mb-[10px] font-jakarta text-[22px] font-[700] leading-[28px] sm:mb-[12px] sm:text-[30px] sm:leading-[38px]">
                {audience.title}
              </h3>
              <p className="max-w-[420px] text-[17px] font-[400] leading-[25px] text-white sm:text-[19px] sm:leading-[28px]">
                {audience.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
