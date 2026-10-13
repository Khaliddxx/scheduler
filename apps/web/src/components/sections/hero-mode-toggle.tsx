'use client';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { setMode, useMode } from '@/lib/mode';

/**
 * The agentic / classic switch over the showcase panel. It publishes to
 * lib/mode.ts; the hero headline, the hero subtitle and the showcase media all
 * read that store, so one flip changes all three at once, as on the reference.
 */
export function HeroModeToggle() {
  const mode = useMode();
  return (
    <ModeToggle
      left="I need agentic scheduling"
      right="I need classic scheduling"
      isRight={mode === 'classic'}
      onChange={(isRight) => setMode(isRight ? 'classic' : 'agentic')}
      className="mb-[18px]"
    />
  );
}
