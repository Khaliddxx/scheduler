'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Two-state switch with a label either side, styled after the reference:
 * a 36x20 pill track (2px inset) with a 16px white knob that slides on `left`,
 * pink (#FC69FF) on the left state and blue (#618DFF) on the right, both
 * eased over Tailwind's default 150ms. Labels are plain white 16px (12px on
 * phones) and do not change weight or colour with the state.
 *
 * Built as a real `role="switch"` button so the state is announced, and both
 * labels are buttons too, so either side can be picked directly. Controlled
 * when `isRight` is passed; otherwise it keeps its own state.
 */
export function ModeToggle({
  left,
  right,
  isRight: controlled,
  defaultRight = false,
  onChange,
  className,
}: {
  left: string;
  right: string;
  isRight?: boolean;
  defaultRight?: boolean;
  onChange?: (isRight: boolean) => void;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultRight);
  const isRight = controlled ?? own;
  const id = useId();

  const set = (next: boolean) => {
    if (controlled === undefined) setOwn(next);
    onChange?.(next);
  };

  const label =
    'rounded-[4px] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div
      className={cn(
        'flex h-[53px] items-center justify-center gap-[8px] p-[6px] text-[16px] leading-[1.5] max-sm:!text-[12px]',
        className,
      )}
    >
      <button type="button" onClick={() => set(false)} className={label}>
        {left}
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={isRight}
        aria-labelledby={id}
        onClick={() => set(!isRight)}
        className="relative h-[20px] w-[36px] shrink-0 rounded-[100px] p-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{ backgroundColor: isRight ? '#618DFF' : '#FC69FF' }}
      >
        <span className="relative block h-full w-full">
          <span
            className="absolute top-0 h-[16px] w-[16px] rounded-full bg-white transition-[left]"
            style={{ left: isRight ? 'calc(100% - 16px)' : 0 }}
          />
        </span>
      </button>

      <button type="button" onClick={() => set(true)} className={label}>
        {right}
      </button>

      {/* Names the switch for assistive tech without printing a third label. */}
      <span id={id} className="sr-only">
        {left} or {right}
      </span>
    </div>
  );
}
