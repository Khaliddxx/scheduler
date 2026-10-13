import { sellableChannels, type Channel } from '@/content/channels';
import { previewImage } from '@/lib/preview-media';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { cn } from '@/lib/cn';

/**
 * Full-colour square app icon for a channel, as the reference design shows them
 * in the hero and the channel grid.
 *
 * The SVGs live in public/preview/socials/<slug>.svg (reference media; see that
 * folder's README). When one is missing the tinted ChannelIcon tile stands in,
 * so a channel never renders as a hole.
 */
export function SocialIcon({
  channel,
  className,
}: {
  channel: Channel;
  /** Size classes. Defaults to the hero's 24px / 32px from `sm`. */
  className?: string;
}) {
  const src = previewImage(`socials/${channel.slug}.svg`);
  const size = className ?? 'h-6 w-6 sm:h-8 sm:w-8';

  if (!src) return <ChannelIcon channel={channel} size={32} />;

  return (
    // Plain <img>: a static SVG from /public needs no optimisation pass.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={channel.name}
      width={70}
      height={70}
      loading="lazy"
      decoding="async"
      className={cn('shrink-0', size)}
    />
  );
}

/**
 * Sellable channels in the reference design's display order. Anything we sell
 * that the reference does not list goes at the end, in catalogue order; nothing
 * we cannot sell is shown.
 */
const DISPLAY_ORDER = [
  'instagram', 'youtube', 'google-my-business', 'dribbble', 'linkedin', 'reddit',
  'tiktok', 'facebook', 'pinterest', 'threads', 'x', 'slack', 'discord',
  'mastodon', 'bluesky', 'lemmy', 'warpcast', 'telegram', 'nostr', 'vk',
  'devto', 'medium', 'hashnode', 'wordpress', 'listmonk',
];

const rank = (slug: string): number => {
  const i = DISPLAY_ORDER.indexOf(slug);
  return i === -1 ? DISPLAY_ORDER.length : i;
};

export const channelsInDisplayOrder: Channel[] = [...sellableChannels].sort(
  (a, b) => rank(a.slug) - rank(b.slug),
);
