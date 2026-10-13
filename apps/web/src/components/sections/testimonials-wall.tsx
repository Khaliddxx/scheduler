'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Testimonial } from '@/content/testimonials';

/**
 * The quote wall: cards dealt into 1, 2 or 3 columns (below 768px, below
 * 1024px, above) so the columns end at roughly the same height.
 *
 * Same method as the reference design: estimate each card's height from its
 * text, deal the tallest first into the shortest column, then try up to 50
 * single moves or swaps between the tallest and shortest column while that
 * narrows the gap. Real heights replace the estimates as soon as a
 * ResizeObserver reports them. One column keeps the content file's order.
 *
 * The server render uses three columns; the grid stacks them on a phone until
 * the client re-deals into one.
 */

const GAP = 12;

const estimate = (t: Testimonial): number =>
  140 +
  22 *
    t.body
      .split('\n')
      .reduce((n, line) => n + Math.max(1, Math.ceil(line.length / 42)), 0);

function deal(
  items: Testimonial[],
  count: number,
  measured: Record<string, number>,
): Testimonial[][] {
  const h = (t: Testimonial) => (measured[t.id] ?? estimate(t)) + GAP;
  const order = count === 1 ? items : [...items].sort((a, b) => h(b) - h(a));
  const cols: Testimonial[][] = Array.from({ length: count }, () => []);
  const heights: number[] = Array<number>(count).fill(0);

  order.forEach((t) => {
    const i = heights.indexOf(Math.min(...heights));
    cols[i].push(t);
    heights[i] += h(t);
  });

  for (let pass = 0; pass < 50 && count > 1; pass++) {
    const hi = heights.indexOf(Math.max(...heights));
    const lo = heights.indexOf(Math.min(...heights));
    const diff = heights[hi] - heights[lo];
    let best: { gain: number; apply: () => void } | null = null;

    cols[hi].forEach((a, ai) => {
      const ha = h(a);
      const moveGain = diff - Math.abs(diff - 2 * ha);
      if (moveGain > 0 && (!best || moveGain > best.gain)) {
        best = {
          gain: moveGain,
          apply: () => {
            cols[hi].splice(ai, 1);
            cols[lo].push(a);
            heights[hi] -= ha;
            heights[lo] += ha;
          },
        };
      }
      cols[lo].forEach((b, bi) => {
        const delta = ha - h(b);
        const swapGain = diff - Math.abs(diff - 2 * delta);
        if (delta > 0 && swapGain > 0 && (!best || swapGain > best.gain)) {
          best = {
            gain: swapGain,
            apply: () => {
              cols[hi][ai] = b;
              cols[lo][bi] = a;
              heights[hi] -= delta;
              heights[lo] += delta;
            },
          };
        }
      });
    });

    if (!best) break;
    (best as { apply: () => void }).apply();
  }

  return cols;
}

function useColumnCount(): number {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w < 768 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

function Initial({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#606060] font-jakarta text-[16px] font-bold leading-none text-white"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  const secondary = item.handle ?? item.role;
  return (
    <figure
      className={cn(
        'block w-full space-y-[16px] rounded-[20px] border border-white/10 bg-[#1A1919]/60 p-[29px]',
        item.placeholder && 'border-dashed border-warn opacity-50 saturate-[0.6]',
      )}
    >
      {item.placeholder ? (
        <span className="inline-flex w-fit items-center rounded-full border border-dashed border-warn px-2.5 py-1 text-[12px] uppercase tracking-[0.08em] text-warn">
          Placeholder
        </span>
      ) : null}
      <blockquote className="whitespace-pre-line text-[18px] leading-[22.23px]">
        {item.body}
      </blockquote>
      <div aria-hidden className="min-h-[1px] bg-white/10" />
      <figcaption className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <Initial name={item.name} />
          <div className="space-y-[3px]">
            <p className="text-[18px] font-bold leading-[20px]">{item.name}</p>
            {secondary ? <p className="text-[12px] leading-[13px]">{secondary}</p> : null}
          </div>
        </div>
        {/* Where the reference shows the source network's icon; these quotes have none. */}
        <span aria-hidden className="h-[24px] w-[24px] rounded-[6px] bg-[#606060]" />
      </figcaption>
    </figure>
  );
}

export function TestimonialsWall({ items }: { items: Testimonial[] }) {
  const count = useColumnCount();
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const observer = useRef<ResizeObserver | null>(null);

  // Created on first use from the ref callback: ref callbacks run before
  // effects, so an observer made in an effect would miss the first render.
  const observe = useCallback((el: HTMLDivElement | null) => {
    if (!el || typeof ResizeObserver === 'undefined') return;
    if (!observer.current) {
      observer.current = new ResizeObserver((entries) => {
        setMeasured((prev) => {
          let changed = false;
          const next = { ...prev };
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.sayId;
            const height = Math.round(entry.contentRect.height);
            if (id && Math.abs((next[id] ?? -1) - height) > 2) {
              next[id] = height;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      });
    }
    observer.current.observe(el);
  }, []);

  useEffect(() => () => observer.current?.disconnect(), []);

  const columns = useMemo(() => deal(items, count, measured), [items, count, measured]);

  return (
    <div className="grid w-full grid-cols-1 items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-3">
          {col.map((item) => (
            <div key={item.id} data-say-id={item.id} ref={observe}>
              <QuoteCard item={item} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
