'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ScribbleUnderline } from '@/components/ui/doodles';
import { useMode } from '@/lib/mode';

/**
 * The hero's headline and subtitle. Both follow the agentic / classic switch
 * under the hero (lib/mode.ts): agentic shows the rotating assistant line,
 * classic the plain tagline with a pink underline.
 *
 * Rotating slot, timed as the reference does it:
 * - a column of rows, one per item plus a copy of the first at the end, slides
 *   up by one row pitch (1.5em) per step: 600ms, cubic-bezier(0.65, 0, 0.35, 1);
 * - the first item holds for 4000ms, every other for 2800ms;
 * - after landing on the trailing copy, it waits 600ms, then snaps back to the
 *   real first row with transitions off, so the loop has no visible seam;
 * - the slot is clipped to one row (1.1em, plus 0.24em of padding top and
 *   bottom so tiles and descenders are not cut) under a vertical fade mask;
 * - from 1280px the slot sits inline, and its width animates to the width of
 *   the incoming item over the same 600ms, so the line re-centres smoothly;
 * - the underline shows only while the first item is up, fading in step.
 * Reduced motion: nothing cycles, the first item stays.
 */

export interface HeadlineAgent {
  id: string;
  name: string;
  /** Public path of the logo tile, or null to show the name alone. */
  logo: string | null;
}

const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const STEP_MS = 600;
const FIRST_HOLD_MS = 4000;
const HOLD_MS = 2800;
const ROW = '1.1em';
const PAD = '0.24em';
const PITCH = '1.5em';
const MASK =
  'linear-gradient(to bottom, transparent 0, #000 0.12em, #000 calc(100% - 0.12em), transparent 100%)';

function Row({ name, logo }: HeadlineAgent) {
  return (
    <span
      className="flex items-center justify-center gap-[0.17em] whitespace-nowrap xl:justify-start"
      style={{ height: ROW }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          width={24}
          height={24}
          draggable={false}
          className="h-[0.93em] w-[0.93em] shrink-0 select-none rounded-[27%] ring-1 ring-inset ring-white/25"
        />
      ) : null}
      {name}
    </span>
  );
}

function AgentSlot({ items }: { items: HeadlineAgent[] }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const measures = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);

  // Measure every item's natural width, and again whenever fonts or the
  // viewport change it, so the inline slot can size to the item that is up.
  useEffect(() => {
    const read = () => setWidths(measures.current.map((el) => el?.offsetWidth ?? 0));
    const observer = new ResizeObserver(read);
    measures.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (index === items.length) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setAnimate(true);
        setIndex((i) => i + 1);
      },
      index === 0 ? FIRST_HOLD_MS : HOLD_MS,
    );
    return () => clearTimeout(t);
  }, [index, items.length]);

  const showUnderline = index % items.length === 0;
  const transition = (prop: string) => (animate ? `${prop} ${STEP_MS}ms ${EASE}` : 'none');

  return (
    <span aria-hidden className="relative block xl:inline-block xl:align-top">
      <span
        className="relative block overflow-hidden text-left xl:inline-block xl:w-[var(--slot-w)] xl:align-top"
        style={
          {
            '--slot-w': widths.length ? `${widths[index % items.length]}px` : undefined,
            height: ROW,
            padding: `${PAD} 0`,
            margin: `-${PAD} 0`,
            boxSizing: 'content-box',
            transition: transition('width'),
            maskImage: MASK,
            WebkitMaskImage: MASK,
          } as CSSProperties
        }
      >
        {/* Invisible copies: the first gives the slot its height, all are measured. */}
        {items.map((item, i) => (
          <span
            key={item.id}
            ref={(el) => {
              measures.current[i] = el;
            }}
            className={i === 0 ? 'invisible block w-max' : 'invisible absolute left-0 w-max'}
          >
            <Row {...item} />
          </span>
        ))}

        <span
          className="absolute inset-x-0 flex flex-col xl:right-auto"
          style={{
            top: PAD,
            rowGap: `calc(${PITCH} - ${ROW})`,
            transform: `translateY(calc(-${PITCH} * ${index}))`,
            transition: transition('transform'),
          }}
        >
          {[...items, items[0]].map((item, i) => (
            <Row key={i} {...item} />
          ))}
        </span>
      </span>

      <ScribbleUnderline
        className="absolute left-1/2 top-full h-auto w-[3.76em] max-w-none -translate-x-1/2"
        style={{ opacity: showUnderline ? 1 : 0, transition: transition('opacity') }}
      />
    </span>
  );
}

export function HeroHeadline({
  agents,
  lead,
  joiner,
  tagline,
  agenticSubtitle,
  classicSubtitle,
}: {
  /** First entry is the generic phrase ("any AI agent"), shown with the underline. */
  agents: HeadlineAgent[];
  /** First line of the agentic headline. */
  lead: string;
  /** The words kept together right before the slot. */
  joiner: string;
  /** The classic headline. */
  tagline: string;
  agenticSubtitle: string;
  classicSubtitle: string;
}) {
  const mode = useMode();
  const agentic = mode === 'agentic';

  return (
    <>
      {agentic ? (
        <div className="max-w-[350px] sm:max-w-[1054px] xl:max-w-none">
          <h1 className="h1-pz text-white">
            {lead} <br className="max-sm:hidden" />
            <span className="xl:whitespace-nowrap">
              <span className="whitespace-nowrap">{joiner}</span> <AgentSlot items={agents} />
            </span>
            <span className="sr-only">{agents[0]?.name}</span>
          </h1>
        </div>
      ) : (
        <div className="relative max-w-[315px] sm:max-w-[900.82px]">
          <h1 className="h1-pz whitespace-pre text-balance text-white">{tagline}</h1>
          <div className="translate-x-[650px]">
            <ScribbleUnderline className="absolute hidden lg:block" />
          </div>
        </div>
      )}

      <div className="min-h-[32px] sm:min-h-[44px]" />

      <p className="max-w-[335px] whitespace-pre text-balance text-center text-[18px] font-[400] leading-[23.44px] text-[#d1d1d1] sm:max-w-[771px] sm:text-[22px] sm:leading-[28.64px]">
        {agentic ? agenticSubtitle : classicSubtitle}
      </p>
    </>
  );
}
