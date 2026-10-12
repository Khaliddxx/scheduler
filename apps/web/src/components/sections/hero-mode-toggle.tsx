'use client';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { setMode } from '@/lib/mode';

/** The hero's switch, wired to the shared mode so the showcase follows it. */
export function HeroModeToggle() {
  return (
    <ModeToggle
      left="I need agentic scheduling"
      right="I need classic scheduling"
      onChange={(isRight) => setMode(isRight ? 'classic' : 'agentic')}
    />
  );
}
