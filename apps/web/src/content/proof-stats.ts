import { sellableChannels } from './channels';

/**
 * The scrolling band of outcome cards.
 *
 * ── These figures are PLACEHOLDERS, same as the testimonials. ──────────
 * They are shaped like real customer outcomes so the band has the right
 * rhythm and card widths while the product is pre-launch. Replace them with
 * measured results before the site goes live, or drop the section — an
 * invented percentage attributed to a named person is the easiest claim for
 * a prospect to test and the hardest to defend.
 * ──────────────────────────────────────────────────────────────────────
 */

export interface ProofStat {
  /** The big number. Kept as a string so "+15%", "2x" and "3k" all work. */
  value: string;
  label: string;
  name: string;
  /** Channel slug — renders that network's real mark on the card. */
  channel: string;
  /** Tailwind gradient stops for the card face. */
  tone: string;
}

const TONES = [
  'from-[#6C10DF] to-[#410093]',
  'from-[#8217C3] to-[#4A0047]',
  'from-[#B611B0] to-[#62007D]',
  'from-[#CE2777] to-[#7D0052]',
  'from-[#4C27E1] to-[#260091]',
  'from-[#164CD9] to-[#002584]',
  'from-[#D82D7E] to-[#7D0052]',
  'from-[#612BD3] to-[#2F007B]',
];

const RAW: Array<[string, string, string, string]> = [
  ['+15%', 'Increase in engagement', 'Jason S.', 'linkedin'],
  ['2×', 'Boost in reach', 'Sherry P.', 'x'],
  ['3×', 'Increase in traffic', 'Betty M.', 'instagram'],
  ['3k', 'Saved per month', 'Jonathan T.', 'facebook'],
  ['+10%', 'Increase in impressions', 'Joel J.', 'tiktok'],
  ['+42%', 'More posts shipped', 'Dana R.', 'youtube'],
  ['6h', 'Saved every week', 'Marcus R.', 'threads'],
  ['+28%', 'Follower growth', 'Priya N.', 'bluesky'],
  ['4×', 'Faster approvals', 'Tom H.', 'mastodon'],
  ['+19%', 'Click-through rate', 'Sofia L.', 'pinterest'],
  ['12', 'Clients on one calendar', 'Amara O.', 'telegram'],
  ['+33%', 'Reply rate', 'Daniel K.', 'discord'],
];

export const proofStats: ProofStat[] = RAW.map(([value, label, name, channel], i) => ({
  value,
  label,
  name,
  channel,
  tone: TONES[i % TONES.length],
}));

export const statChannel = (slug: string) =>
  sellableChannels.find((c) => c.slug === slug);

/** Flip to false once these are real, measured numbers. */
export const statsArePlaceholder = true;
