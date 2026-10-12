import { cn } from '@/lib/cn';
import { getLogo } from '@/content/logos';
import type { Channel } from '@/content/channels';

/**
 * A network's real mark on a tile.
 *
 * Three things make a grid of these read as one system rather than 24 logos
 * pasted together:
 *
 *  1. Every mark is normalised to the same 24x24 grid and inset to the same
 *     optical size, so a wide mark (Medium) and a tall one (Pinterest) carry
 *     the same visual weight as neighbours.
 *  2. Tiles share one radius, one hairline and one elevation. The brand colour
 *     appears as a low-opacity wash behind the mark rather than flooding the
 *     tile, which would turn the grid into a bag of sweets.
 *  3. Marks that are pure black (X, TikTok, Threads, Medium) would read as a
 *     hole on a dark ground, so they are drawn in white instead. That is why
 *     `mono` exists in the logo data.
 */
export function ChannelIcon({
  channel,
  size = 44,
  className,
  /** Flat marks with no tile, for dense inline rows. */
  bare = false,
}: {
  channel: Pick<Channel, 'name' | 'color'> & { slug?: string; short?: string };
  size?: number;
  className?: string;
  bare?: boolean;
}) {
  const logo = channel.slug ? getLogo(channel.slug) : undefined;

  // Fall back to a lettermark only if a network genuinely has no logo yet.
  if (!logo) {
    const initials =
      channel.short ??
      channel.name
        .replace(/[^A-Za-z0-9 ]/g, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-[11px] font-semibold text-white shadow-hairline',
          className,
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: channel.color,
          fontSize: Math.round(size * (initials.length >= 3 ? 0.26 : 0.36)),
        }}
      >
        {initials}
      </span>
    );
  }

  const tint = logo.mono ? '#FFFFFF' : logo.hex;
  // 54% of the tile. Below this the mark looks lost; above it, crowded.
  const glyph = Math.round(size * 0.54);

  const mark = (
    <svg
      width={glyph}
      height={glyph}
      viewBox="0 0 24 24"
      fill={tint}
      aria-hidden
      focusable="false"
    >
      <path d={logo.d} />
    </svg>
  );

  if (bare) {
    return (
      <span
        className={cn('inline-flex shrink-0 items-center justify-center', className)}
        style={{ width: size, height: size }}
      >
        {mark}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] shadow-hairline',
        'transition-[box-shadow,transform] duration-300',
        className,
      )}
      style={{
        width: size,
        height: size,
        // A wash of the brand colour over the card surface, not the raw hex.
        // Keeps 24 tiles reading as one grid instead of a colour chart.
        backgroundColor: `color-mix(in srgb, ${logo.hex} 16%, var(--bg-inner))`,
      }}
    >
      {mark}
    </span>
  );
}
