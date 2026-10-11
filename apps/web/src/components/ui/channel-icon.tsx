import { cn } from '@/lib/cn';
import type { Channel } from '@/content/channels';

/**
 * Channel tile.
 *
 * Renders the network's initial on a tile in its brand colour rather than
 * shipping the platforms' own logo files. That is deliberate: platform logos
 * are trademarks with their own brand guidelines, and most forbid use that
 * implies endorsement or partnership. Swap in licensed marks per platform once
 * you have read each one's brand terms — docs/03-oauth-app-registration.md
 * tracks which platforms allow what.
 */
export function ChannelIcon({
  channel,
  size = 44,
  className,
}: {
  channel: Pick<Channel, 'name' | 'color'> & { short?: string };
  size?: number;
  className?: string;
}) {
  // Prefer the explicit label from the channel data. Derived initials collide
  // badly here — Threads and TikTok both give "T", LinkedIn and Lemmy both "L"
  // — which reads as a rendering bug when the tiles sit side by side in a grid.
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
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[11px] font-semibold text-white shadow-hairline',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: channel.color,
        // Scale down for longer labels so a three-character mark such as "GBP"
        // still fits inside the tile instead of spilling past its edges.
        fontSize: Math.round(size * (initials.length >= 3 ? 0.26 : 0.36)),
        letterSpacing: initials.length >= 3 ? '-0.02em' : undefined,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
