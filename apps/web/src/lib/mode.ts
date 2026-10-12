'use client';

import { useSyncExternalStore } from 'react';

/**
 * The hero's "agentic / classic" switch, shared with the showcase under it.
 *
 * A module-level store rather than React context: the toggle and the showcase
 * are siblings rendered by a server component, so there is no common client
 * ancestor to hang a provider on. `useSyncExternalStore` keeps the server
 * snapshot fixed at the default, which is what stops a hydration mismatch.
 */
export type Mode = 'agentic' | 'classic';

const DEFAULT: Mode = 'agentic';

let current: Mode = DEFAULT;
const listeners = new Set<() => void>();

export const setMode = (next: Mode): void => {
  if (next === current) return;
  current = next;
  listeners.forEach((notify) => notify());
};

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
};

export const useMode = (): Mode =>
  useSyncExternalStore(subscribe, () => current, () => DEFAULT);
