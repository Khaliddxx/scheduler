/**
 * Supported publishing channels.
 *
 * This list is derived from the providers that actually ship in the pinned
 * application build (libraries/nestjs-libraries/src/integrations/social at
 * v2.11.3). Headline counts elsewhere on the site are computed from this array
 * rather than typed by hand, so the marketing claim cannot drift away from what
 * the product can really do.
 *
 * When you upgrade the pinned tag, re-check this list against the provider
 * directory — `pnpm brand:verify` fails the build if the count here disagrees
 * with infra/overlay/providers.lock.
 */

export interface Channel {
  /** URL segment for /channels/[slug]. */
  slug: string;
  name: string;
  /** Two-character tile label. Explicit, because initials collide (Threads/TikTok, LinkedIn/Lemmy). */
  short: string;
  /** Official brand colour, used for the icon tile. */
  color: string;
  /** Category used to group the channel grid. */
  group: 'social' | 'video' | 'community' | 'blog' | 'business';
  /** One line for the channel grid tile. */
  blurb: string;
  /** Longer copy for the /channels/[slug] landing page. */
  detail: string;
  /** What a post can carry on this network, shown as capability chips. */
  supports: Array<'text' | 'image' | 'video' | 'link' | 'thread' | 'comment' | 'schedule'>;
  /**
   * Separate provider variants that map to the same network (e.g. a personal
   * profile and a company page are two OAuth integrations but one brand).
   */
  variants?: string[];
  /** True where the platform requires app review before it will allow posting. */
  requiresAppReview: boolean;
  /**
   * Set when a platform's own terms or review state prevent us offering it on a
   * PAID service. These channels are excluded from the public list rather than
   * sold and then withdrawn. The string is the reason, kept here so nobody
   * re-adds the channel without reading it.
   */
  commercialBlocker?: string;
}

export const channels: Channel[] = [
  {
    slug: 'x',
    name: 'X',
    short: 'X',
    color: '#000000',
    group: 'social',
    blurb: 'Post, thread and reply on X from your calendar.',
    detail:
      'Publish single posts or full threads, attach images and video, and schedule replies to your own posts so a thread lands in order. Analytics come back per post so you can see which hooks actually travelled.',
    supports: ['text', 'image', 'video', 'thread', 'comment', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn',
    short: 'in',
    color: '#0A66C2',
    group: 'business',
    blurb: 'Publish to a personal profile or a company page.',
    detail:
      'Connect a personal profile, a company page, or both as separate channels. Long-form text, documents, images and native video are all supported, and posts can be scheduled into working-hours windows.',
    supports: ['text', 'image', 'video', 'link', 'comment', 'schedule'],
    variants: ['Personal profile', 'Company page'],
    requiresAppReview: true,
  },
  {
    slug: 'instagram',
    name: 'Instagram',
    short: 'IG',
    color: '#E1306C',
    group: 'social',
    blurb: 'Feed posts, carousels and Reels on a schedule.',
    detail:
      'Publish feed images, multi-image carousels and Reels to a Professional account. Connect through a linked Facebook page, or stand-alone where your account allows it.',
    supports: ['image', 'video', 'comment', 'schedule'],
    variants: ['Via Facebook page', 'Standalone'],
    requiresAppReview: true,
  },
  {
    slug: 'facebook',
    name: 'Facebook',
    short: 'f',
    color: '#1877F2',
    group: 'social',
    blurb: 'Schedule page posts, photos and video.',
    detail:
      'Publish to the Facebook pages you administer: text updates, photos, links and native video, with first comments scheduled alongside the post.',
    supports: ['text', 'image', 'video', 'link', 'comment', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'tiktok',
    name: 'TikTok',
    short: 'TT',
    color: '#FE2C55',
    group: 'video',
    blurb: 'Queue vertical video with captions and privacy settings.',
    detail:
      'Upload vertical video with its caption, cover frame and privacy level set in advance. Posts can be queued days out and published automatically.',
    supports: ['video', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    short: 'YT',
    color: '#FF0000',
    group: 'video',
    blurb: 'Upload videos and Shorts with full metadata.',
    detail:
      'Upload long-form video and Shorts with title, description, tags, thumbnail, visibility and scheduled publish time — all set from the same calendar as the rest of your posts.',
    supports: ['video', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'threads',
    name: 'Threads',
    short: '@',
    color: '#000000',
    group: 'social',
    blurb: 'Text posts and threads alongside your other channels.',
    detail:
      'Publish text, images and video to Threads, including chained replies so a multi-part thread posts in sequence.',
    supports: ['text', 'image', 'video', 'thread', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'bluesky',
    name: 'Bluesky',
    short: 'BS',
    color: '#0085FF',
    group: 'social',
    blurb: 'Post to the AT Protocol network.',
    detail:
      'Connect with an app password and publish text, images and link cards. No review process and no API fee, which makes Bluesky the fastest channel to get live.',
    supports: ['text', 'image', 'link', 'thread', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'mastodon',
    name: 'Mastodon',
    short: 'Ma',
    color: '#6364FF',
    group: 'social',
    blurb: 'Any instance, including your own.',
    detail:
      'Post to mastodon.social or to any self-hosted instance by pointing at its URL. Supports text, media, content warnings and visibility levels.',
    supports: ['text', 'image', 'video', 'schedule'],
    variants: ['mastodon.social', 'Custom instance'],
    requiresAppReview: false,
  },
  {
    slug: 'pinterest',
    name: 'Pinterest',
    short: 'P',
    color: '#E60023',
    group: 'social',
    blurb: 'Schedule pins to the right boards.',
    detail:
      'Create pins with an image or video, title, description and destination link, published to whichever board you choose.',
    supports: ['image', 'video', 'link', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'reddit',
    name: 'Reddit',
    short: 'R',
    color: '#FF4500',
    group: 'community',
    blurb: 'Submit to subreddits with per-sub rules.',
    detail:
      'Submit text, link or image posts to the subreddits you choose, with a separate title and body per subreddit so each one reads as if it were written for it.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: true,
    commercialBlocker:
      "Reddit's Data API Terms prohibit deriving revenue from the API without " +
      'express written approval from Reddit. A paid scheduler does exactly that, ' +
      'so this channel cannot be offered until that approval is granted.',
  },
  {
    slug: 'discord',
    name: 'Discord',
    short: 'Dc',
    color: '#5865F2',
    group: 'community',
    blurb: 'Announce to channels in your server.',
    detail:
      'Post announcements into the channels of any server where you can add a bot — useful for shipping release notes and community updates on the same schedule as everything else.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'slack',
    name: 'Slack',
    short: 'Sl',
    color: '#4A154B',
    group: 'community',
    blurb: 'Push updates into a workspace channel.',
    detail:
      'Deliver scheduled messages into a Slack channel. Commonly used to mirror a public announcement into an internal channel at the same moment.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'telegram',
    name: 'Telegram',
    short: 'TG',
    color: '#26A5E4',
    group: 'community',
    blurb: 'Broadcast to channels and groups.',
    detail:
      'Publish to a Telegram channel or group through a bot you control. Text, media and link previews all work, and there is no approval queue.',
    supports: ['text', 'image', 'video', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'warpcast',
    name: 'Farcaster',
    short: 'FC',
    color: '#8A63D2',
    group: 'social',
    blurb: 'Cast to Farcaster channels.',
    detail:
      'Publish casts with text, images and embeds to Farcaster, including into specific channels.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'nostr',
    name: 'Nostr',
    short: 'No',
    color: '#8E44AD',
    group: 'social',
    blurb: 'Publish notes to relays you choose.',
    detail:
      'Sign and broadcast notes to the Nostr relays you configure. Keys stay in your workspace.',
    supports: ['text', 'image', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'lemmy',
    name: 'Lemmy',
    short: 'Le',
    color: '#00BC8C',
    group: 'community',
    blurb: 'Post to communities across instances.',
    detail:
      'Submit posts to Lemmy communities on any instance, with title, body and optional link.',
    supports: ['text', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'vk',
    name: 'VK',
    short: 'VK',
    color: '#0077FF',
    group: 'social',
    blurb: 'Publish to VK walls and groups.',
    detail: 'Post text, images and video to a VK profile wall or community page.',
    supports: ['text', 'image', 'video', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'dribbble',
    name: 'Dribbble',
    short: 'Dr',
    color: '#EA4C89',
    group: 'social',
    blurb: 'Publish shots to your portfolio.',
    detail: 'Upload shots with title, description and tags on a schedule.',
    supports: ['image', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'medium',
    name: 'Medium',
    short: 'Me',
    color: '#000000',
    group: 'blog',
    blurb: 'Publish long-form articles and drafts.',
    detail:
      'Push a full article to Medium as a draft or a published post, with canonical URL and tags set so it does not cannibalise your own site.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'devto',
    name: 'DEV.to',
    short: 'DEV',
    color: '#0A0A0A',
    group: 'blog',
    blurb: 'Cross-post articles to the DEV community.',
    detail:
      'Publish markdown articles with tags, cover image and canonical URL, scheduled like any other post.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'hashnode',
    name: 'Hashnode',
    short: 'Hn',
    color: '#2962FF',
    group: 'blog',
    blurb: 'Publish to your developer blog.',
    detail:
      'Send markdown posts to a Hashnode publication with tags, cover image and canonical URL.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    short: 'WP',
    color: '#21759B',
    group: 'blog',
    blurb: 'Draft or publish straight to your site.',
    detail:
      'Connect a self-hosted WordPress site and create posts as drafts or publish them outright, with categories and a featured image.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
  {
    slug: 'google-my-business',
    name: 'Google Business Profile',
    short: 'GBP',
    color: '#4285F4',
    group: 'business',
    blurb: 'Keep your listing posts current.',
    detail:
      'Publish updates, offers and events to a Google Business Profile so a local listing stays active without someone remembering to do it.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: true,
  },
  {
    slug: 'listmonk',
    name: 'Listmonk',
    short: 'LM',
    color: '#0055D4',
    group: 'blog',
    blurb: 'Send the same update to your mailing list.',
    detail:
      'Push a campaign to a self-hosted Listmonk instance so your newsletter goes out on the same schedule as your social posts.',
    supports: ['text', 'image', 'link', 'schedule'],
    requiresAppReview: false,
  },
];

/**
 * Channels we may actually sell. A channel with a `commercialBlocker` is
 * excluded everywhere customer-facing — the marketing count, the grid, the
 * directory — because advertising a network we are not permitted to serve is
 * the kind of thing that gets noticed after someone has paid.
 */
export const sellableChannels = channels.filter((c) => !c.commercialBlocker);

/** Blocked channels, kept visible to us so the reason is not lost. */
export const blockedChannels = channels.filter((c) => c.commercialBlocker);

/** Distinct networks shown to a customer. */
export const channelCount = sellableChannels.length;

/**
 * Total connectable integrations, counting variants such as a LinkedIn company
 * page separately from a personal profile — this is the number the application
 * itself exposes as connectable channels.
 */
export const integrationCount = sellableChannels.reduce(
  (n, c) => n + (c.variants?.length ?? 1),
  0,
);

/** Channels that are live on day one because they need no platform review. */
export const noReviewChannels = sellableChannels.filter((c) => !c.requiresAppReview);

export const channelGroups: Array<{ id: Channel['group']; label: string }> = [
  { id: 'social', label: 'Social' },
  { id: 'video', label: 'Video' },
  { id: 'community', label: 'Community' },
  { id: 'blog', label: 'Blogging' },
  { id: 'business', label: 'Business' },
];

export const getChannel = (slug: string): Channel | undefined =>
  sellableChannels.find((c) => c.slug === slug);
