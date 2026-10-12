'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Scroll-triggered entrance.
 *
 * Two rules this follows that most scroll-reveal implementations break:
 *
 *  1. **The page is complete at rest.** Content starts VISIBLE and is only
 *     hidden once JavaScript has confirmed it can animate it back in. A page
 *     built the other way round — everything at `opacity: 0` waiting for an
 *     observer — shows a blank screen to anyone with JS disabled, to a crawler,
 *     and in the split second before hydration.
 *
 *  2. **It respects `prefers-reduced-motion`.** Checked here in JS rather than
 *     only in CSS, so the element never enters the hidden state at all for
 *     someone who has asked for less motion.
 *
 * Movement is small on purpose: 14px and a short ease. Anything larger reads as
 * a template, and this site already carries its weight through type and colour.
 */
export function Reveal({
  children,
  className,
  /** Stagger within a group, in milliseconds. Keep under ~240ms total. */
  delay = 0,
  /** How far it travels. 'none' fades only — right for large blocks. */
  distance = 14,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number | 'none';
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'rest' | 'hidden' | 'shown'>('rest');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    // Already on screen at load: skip the animation rather than flash it.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setState('shown');
      return;
    }

    setState('hidden');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('shown');
            io.disconnect();
          }
        }
      },
      // Fire a little before the element reaches the fold, so the motion has
      // finished by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const travel = distance === 'none' ? 0 : distance;

  return (
    <Tag
      ref={ref as never}
      className={cn('motion-safe:transition-[opacity,transform]', className)}
      style={{
        opacity: state === 'hidden' ? 0 : 1,
        transform:
          state === 'hidden' && travel ? `translate3d(0, ${travel}px, 0)` : 'none',
        transitionDuration: '620ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: state === 'shown' ? `${delay}ms` : '0ms',
        willChange: state === 'hidden' ? 'opacity, transform' : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
