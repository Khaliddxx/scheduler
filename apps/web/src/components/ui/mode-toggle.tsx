'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Two-state switch with a label either side.
 *
 * Built as a real `role="switch"` button rather than a styled checkbox, so the
 * state is announced and both labels stay clickable. The labels are part of
 * the control: a bare switch between two words leaves a reader guessing which
 * side is on, so the active one brightens and the inactive one dims.
 */
export function ModeToggle({
  left,
  right,
  defaultRight = false,
  onChange,
  className,
}: {
  left: string;
  right: string;
  defaultRight?: boolean;
  onChange?: (isRight: boolean) => void;
  className?: string;
}) {
  const [isRight, setIsRight] = useState(defaultRight);
  const id = useId();

  const set = (next: boolean) => {
    setIsRight(next);
    onChange?.(next);
  };

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
      <button
        type="button"
        onClick={() => set(false)}
        className={cn(
          'text-body-sm transition-colors',
          isRight ? 'text-dim hover:text-muted' : 'text-white',
        )}
      >
        {left}
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={isRight}
        aria-labelledby={id}
        onClick={() => set(!isRight)}
        className={cn(
          'relative inline-flex h-[26px] w-[48px] shrink-0 items-center rounded-control px-[3px]',
          'transition-colors duration-300 shadow-hairline',
          isRight ? 'bg-accent' : 'bg-primary',
        )}
      >
        <span
          className={cn(
            'block h-5 w-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isRight ? 'translate-x-[22px]' : 'translate-x-0',
          )}
        />
      </button>

      <button
        type="button"
        onClick={() => set(true)}
        className={cn(
          'text-body-sm transition-colors',
          isRight ? 'text-white' : 'text-dim hover:text-muted',
        )}
      >
        {right}
      </button>

      {/* Names the switch for assistive tech without printing a third label. */}
      <span id={id} className="sr-only">
        {left} or {right}
      </span>
    </div>
  );
}
