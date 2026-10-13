'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The gradient pill at the top of the reference's comparison index: the
 * subject's logo and name with a chevron that flips when the menu is open. A
 * click outside or Escape closes it.
 *
 * The reference uses it to switch which product is being compared; we have
 * one, so the menu jumps to the sections of this page instead.
 */
export function ComparePicker({
  logo,
  name,
  items,
}: {
  logo: ReactNode;
  name: string;
  items: Array<{ label: string; href: string }>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${name}: jump to a comparison`}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-gradient-to-br from-[#24005E] to-[#5608D5] px-5 py-3 transition-all hover:border-white/30 sm:px-6 sm:py-4"
      >
        {logo}
        <span className="font-jakarta text-[20px] font-bold leading-[26px] sm:text-[28px] sm:leading-[36px]">
          {name}
        </span>
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          aria-hidden="true"
          className={cn('ml-1 transition-transform', open && 'rotate-180')}
        >
          <path d="M1 1L7 7L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          id={menuId}
          className="absolute left-0 top-full z-50 mt-2 max-h-[320px] w-full min-w-[220px] overflow-y-auto rounded-2xl border border-white/10 bg-[#1A1919] py-2"
        >
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-all hover:bg-white/5 focus-visible:bg-white/5"
              >
                <span className="truncate text-[16px] font-semibold sm:text-[18px]">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
