import { sellableChannels, type Channel } from './channels';

/**
 * The two drifting rows of cards under the hero (the reference design's
 * "trusted by" stats band).
 *
 * The reference fills these cards with customer outcomes ("+15% engagement",
 * a named person, their network). We are pre-launch and have no customers to
 * quote, so the same card shape carries something that is true today instead:
 * one thing each network can be sent from the calendar, worded from that
 * channel's own entry in ./channels.ts. Big word on top, one short line under
 * it, the network's mark and name at the foot.
 *
 * Keep `label` to about 24 characters: the card clamps it to one line.
 * Only sellable channels resolve; an entry naming anything else is dropped.
 */

export interface ProofStat {
  /** The big word or figure at the top of the card. */
  value: string;
  /** One line under it, clamped to a single line on the card. */
  label: string;
  /** The network the card is about; renders its mark and name at the foot. */
  channel: Channel;
  /** Card face: `linear-gradient(to left, from, to)`, as in the reference. */
  from: string;
  to: string;
}

/** Gradient stops per card position, row by row, as in the reference band. */
const TONES: Array<Array<[string, string]>> = [
  [
    ['#1457DB', '#002EA6'],
    ['#1427DB', '#002991'],
    ['#4714DB', '#260091'],
    ['#5F14DB', '#260091'],
    ['#6C10DF', '#410093'],
    ['#9110DF', '#4B0086'],
    ['#8D00BF', '#5E008A'],
  ],
  [
    ['#6C10DF', '#410093'],
    ['#9110DF', '#4B0086'],
    ['#8D00BF', '#5E008A'],
    ['#AE19D7', '#62007D'],
    ['#CE27C6', '#780072'],
    ['#DD1499', '#7D0069'],
    ['#CE2777', '#7D0052'],
  ],
];

/** [value, label, channel slug], one array per row. */
const RAW: Array<Array<[string, string, string]>> = [
  [
    ['Reels', 'Queued with feed posts', 'instagram'],
    ['Shorts', 'Uploaded with metadata', 'youtube'],
    ['Pages', 'Profile or company page', 'linkedin'],
    ['Video', 'Captions and privacy set', 'tiktok'],
    ['Photos', 'Page posts and video', 'facebook'],
    ['Pins', 'Sent to the right board', 'pinterest'],
    ['Replies', 'Threads land in order', 'x'],
  ],
  [
    ['Threads', 'Text, image and video', 'threads'],
    ['Posts', 'Text, images and links', 'bluesky'],
    ['Servers', 'Posts to your channels', 'discord'],
    ['Groups', 'Channels and groups', 'telegram'],
    ['Drafts', 'Or publish straight away', 'wordpress'],
    ['Articles', 'Long-form, on a schedule', 'medium'],
    ['Instances', 'Including your own', 'mastodon'],
  ],
];

const bySlug = (slug: string): Channel | undefined =>
  sellableChannels.find((c) => c.slug === slug);

export const proofRows: ProofStat[][] = RAW.map((row, r) =>
  row.flatMap(([value, label, slug], i) => {
    const channel = bySlug(slug);
    if (!channel) return [];
    const [from, to] = TONES[r][i % TONES[r].length];
    return [{ value, label, channel, from, to }];
  }),
);
