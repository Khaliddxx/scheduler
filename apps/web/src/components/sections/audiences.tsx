import type { ComponentType } from 'react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/ui/section';
import { BagIcon, FaceIcon, TerminalIcon } from '@/components/ui/doodles';
import { audiences } from '@/content/features';
import { primaryNav } from '@/content/nav';

/**
 * Who the product is for: three bare columns straight off `audiences`.
 *
 * No card chrome on purpose. The section before and after this one are both
 * boxes, so three more boxes would turn the page into a wall of rectangles;
 * a large hand-drawn mark over centred type gives the eye a rest instead.
 *
 * The marks come from components/ui/doodles so they share one drawing hand
 * with the squiggle and sparkle in the hero. They are picked by position, not
 * by the content entry's `icon` key: the three audiences are a fixed, ordered
 * trio (creators, agencies, builders) and the three marks are drawn for exactly
 * those three ideas, so the index is the honest mapping.
 */

/** One mark per column, in brand order: pink, violet, then the cool blue. */
const marks: ReadonlyArray<{ Icon: ComponentType<{ className?: string }>; tone: string }> = [
  { Icon: FaceIcon, tone: 'text-accent' },
  { Icon: BagIcon, tone: 'text-[color:var(--primary)]' },
  { Icon: TerminalIcon, tone: 'text-[#5B6CFF]' },
];

/** The nav already describes this section; reuse its words instead of new ones. */
const howItWorks = primaryNav
  .flatMap((group) => group.children ?? [])
  .find((link) => link.href === '/#how-it-works');

export function Audiences() {
  return (
    <Section id="how-it-works">
      <div className="shell">
        <SectionHeading
          eyebrow={howItWorks?.label ?? 'How it works'}
          title={howItWorks?.description ?? 'Write once, publish everywhere'}
        />

        <ul className="mt-12 grid grid-cols-1 gap-12 sm:mt-14 md:grid-cols-3 md:gap-10 lg:gap-14">
          {audiences.map((audience, index) => {
            const { Icon, tone } = marks[index % marks.length];

            return (
              <li key={audience.id} className="flex flex-col items-center text-center">
                <Icon className={cn('h-20 w-20', tone)} />
                <h3 className="mt-6 font-display text-heading-md text-white">
                  {audience.title}
                </h3>
                <p className="mt-3 max-w-[36ch] text-body-md text-muted">{audience.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
