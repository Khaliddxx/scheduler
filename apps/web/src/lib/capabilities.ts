import type { Channel } from '@/content/channels';

/**
 * Human labels for the `supports` keys on a channel.
 *
 * The keys themselves live in src/content/channels.ts as a union type; this file
 * is the single place that turns one into words. It sits in lib/ rather than
 * content/ on purpose: it is a lookup keyed off a type, not a page's copy, and
 * both /channels and /channels/[slug] render from the same two maps so a chip on
 * the directory can never disagree with the list on the detail page.
 *
 * Nothing here claims a capability a channel does not declare — `supports` is the
 * only source of truth for that, and it is derived from the pinned provider build.
 */

export type ChannelCapability = Channel['supports'][number];

/** Chip-length label. Short enough to sit four-across in a card. */
export const capabilityLabel: Record<ChannelCapability, string> = {
  text: 'Text',
  image: 'Images',
  video: 'Video',
  link: 'Links',
  thread: 'Threads',
  comment: 'Comments',
  schedule: 'Scheduling',
};

/** One explanatory line, used on the channel detail pages. */
export const capabilityDetail: Record<ChannelCapability, string> = {
  text: 'Write the body in the editor and publish it as a native text post.',
  image: 'Attach images, and build a carousel where the network accepts more than one.',
  video: 'Upload native video with its caption and cover frame set before it goes out.',
  link: 'Include a URL and let the network render its own preview card.',
  thread: 'Chain several posts so a multi-part thread lands in the right order.',
  comment: 'Queue the first comment to publish with the post, not minutes after it.',
  schedule: 'Pick an exact time, or drop the post into a repeating slot on the calendar.',
};

/**
 * Display order. Channels declare `supports` in whatever order reads best in the
 * content file; sorting through one list keeps every card and every detail page
 * consistent with each other.
 */
const ORDER: ChannelCapability[] = [
  'text',
  'image',
  'video',
  'link',
  'thread',
  'comment',
  'schedule',
];

export const orderedSupports = (
  supports: readonly ChannelCapability[],
): ChannelCapability[] => ORDER.filter((key) => supports.includes(key));
