import type { CSSProperties } from 'react';

/**
 * Colour themes for the integration and developer pages.
 *
 * Each page picks one accent. `hero` paints the top band and the closing
 * band, `orbit` paints the full-width channel band, and `soft` is the light
 * tint the rest of the page uses for step numbers, links, icon chips and the
 * FAQ toggle (exposed as CSS variables by `accentVars`, so nested blocks pick
 * it up without prop drilling).
 */
export type Accent = 'purple' | 'blue' | 'teal' | 'orange' | 'pink' | 'slate' | 'green';

export const accents: Record<Accent, { hero: string; orbit: string; soft: string }> = {
  purple: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #8a4dff 0%, #5a1fd9 32%, #3a0fa0 62%, #22065e 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #6a2ee8 0%, #3b109f 45%, #1d0552 100%)',
    soft: '#b69cff',
  },
  blue: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #4f8dff 0%, #2456e6 32%, #1433a3 62%, #0b1b5e 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #3b6ff0 0%, #1d3fb0 45%, #0a1650 100%)',
    soft: '#8fb3ff',
  },
  teal: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #2fd3b0 0%, #128f7a 32%, #0b5c53 62%, #063632 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #1aa88f 0%, #0d6b5f 45%, #04302c 100%)',
    soft: '#5fe3c6',
  },
  orange: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #ff9a5c 0%, #e2622a 32%, #9c3a12 62%, #521c07 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #f0703a 0%, #a8411a 45%, #4a1a08 100%)',
    soft: '#ffac85',
  },
  pink: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #ff7ae9 0%, #d61fb5 32%, #8a0f75 62%, #47063e 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #e63bc6 0%, #9a1483 45%, #44073a 100%)',
    soft: '#ff9aef',
  },
  slate: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #6b7a99 0%, #3d4a66 32%, #232c40 62%, #12172a 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #55638a 0%, #2d3752 45%, #11162a 100%)',
    soft: '#a9b8d8',
  },
  green: {
    hero: 'radial-gradient(110% 80% at 88% 12%, #6ee07a 0%, #22a03a 32%, #14662a 62%, #083a18 100%)',
    orbit: 'radial-gradient(60% 70% at 50% 45%, #33b34c 0%, #1a7030 45%, #072f14 100%)',
    soft: '#8de59a',
  },
};

const rgba = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/** CSS variables for the accent's tint, ring and underline colours. */
export const accentVars = (accent: Accent): CSSProperties => {
  const soft = accents[accent].soft;
  return {
    '--pz-accent': soft,
    '--pz-accent-tint': rgba(soft, 0.08),
    '--pz-accent-ring': rgba(soft, 0.3),
    '--pz-accent-line': rgba(soft, 0.45),
  } as CSSProperties;
};
