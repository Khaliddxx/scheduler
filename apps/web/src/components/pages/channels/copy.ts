import { brand } from '@scheduler/brand';
import {
  sellableChannels,
  channelCount,
  channelGroups,
  type Channel,
} from '@/content/channels';
import { homeFaqs, pricingFaqs } from '@/content/faq';
import { capabilities as homeCapabilities } from '@/content/features';
import { TRIAL_DAYS } from '@/content/pricing';
import {
  capabilityDetail,
  capabilityLabel,
  orderedSupports,
  type ChannelCapability,
} from '@/lib/capabilities';

/**
 * Every line of copy on a /channels/[slug] page, assembled from the channel's
 * own record in src/content/channels.ts.
 *
 * The page follows the reference design's channel template (hero, four
 * feature cards, five gradient panels, a violet band, FAQ), but nothing here
 * is written per channel by hand. A headline only names the formats the
 * channel declares in `supports`, the connection copy follows
 * `requiresAppReview` and `variants`, and the general answers are the home
 * page's own FAQ entries, so a channel page can never promise more than the
 * channel record does.
 */

/* ------------------------------------------------------------------ helpers */

/** "a", "a and b", "a, b and c". */
export const listOf = (items: string[]): string => {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const countWord = (n: number): string =>
  ['zero', 'one', 'two', 'three', 'four', 'five'][n] ?? String(n);

/** Plural noun for each format, as it reads in a headline. */
const formatNoun: Partial<Record<ChannelCapability, string>> = {
  text: 'posts',
  thread: 'threads',
  image: 'images',
  video: 'video',
  link: 'links',
  comment: 'first comments',
};

/** Which formats make the headline when a channel has more than three. */
const HEADLINE_PRIORITY: ChannelCapability[] = ['text', 'thread', 'video', 'image', 'link', 'comment'];

/** The formats a channel can publish, scheduling aside (every channel schedules). */
const formats = (channel: Channel): ChannelCapability[] =>
  orderedSupports(channel.supports).filter((key) => key !== 'schedule');

const groupLabel = (channel: Channel): string =>
  channelGroups.find((group) => group.id === channel.group)?.label ?? 'Channels';

const faqAnswer = (q: string, fallback: string): string =>
  homeFaqs.find((item) => item.q === q)?.a ?? fallback;

/* ---------------------------------------------------------------- the page */

/** Three formats at most, in reading order: "posts, images and video". */
export function headlineFormats(channel: Channel): string {
  const own = formats(channel);
  const picked = HEADLINE_PRIORITY.filter((key) => own.includes(key)).slice(0, 3);
  return listOf(own.filter((key) => picked.includes(key)).map((key) => formatNoun[key] ?? key));
}

/** The page's <h1>, reused as its <title>. */
export const headline = (channel: Channel): string =>
  `${channel.name} scheduler to queue ${headlineFormats(channel)} from one calendar`;

/** The siblings the page links to: the eight channels after this one, wrapping. */
export function siblingsOf(channel: Channel, count = 8): Channel[] {
  const index = sellableChannels.findIndex((c) => c.slug === channel.slug);
  return [
    ...sellableChannels.slice(index + 1),
    ...sellableChannels.slice(0, Math.max(index, 0)),
  ].slice(0, count);
}

export const connectionCopy = (channel: Channel): string =>
  channel.requiresAppReview
    ? `${channel.name} reviews every application that posts on someone's behalf. That approval is ours to hold and keep current — you connect your account with OAuth, the same as any other channel.`
    : `${channel.name} needs no platform review. Connect the account and the first post can go out the same minute.`;

export interface FeatureCardCopy {
  icon: 'bulb' | 'doc' | 'chat' | 'star';
  title: string;
  body: string;
}

export function featureCards(channel: Channel): FeatureCardCopy[] {
  const own = formats(channel);
  const labels = own.map((key, i) => (i === 0 ? capabilityLabel[key] : lower(capabilityLabel[key])));
  const variants = channel.variants ?? [];
  const neighbours = siblingsOf(channel, 3).map((c) => c.name);

  return [
    {
      icon: 'bulb',
      title: `Queue ${channel.name} posts ahead`,
      body: `${channel.blurb} ${capabilityDetail.schedule}`,
    },
    {
      icon: 'doc',
      title: `What a ${channel.name} post can carry`,
      body:
        labels.length > 0
          ? `${listOf(labels)}${labels.length === 1 ? '' : ','} set in the same editor you use for every other network, so ${channel.name} is never a separate job.`
          : `Set in the same editor you use for every other network, so ${channel.name} is never a separate job.`,
    },
    {
      icon: 'chat',
      title: `Connecting ${channel.name}`,
      body:
        variants.length > 0
          ? `${channel.name} connects ${countWord(variants.length)} ways — ${listOf(variants.map(lower))}. Each authorises separately and runs on its own schedule. ${channel.requiresAppReview ? 'The platform review is ours to hold and keep current.' : 'No platform review is needed.'}`
          : connectionCopy(channel),
    },
    {
      icon: 'star',
      title: `One calendar, ${channelCount} networks`,
      body: `Put ${channel.name} on the same calendar as ${listOf(neighbours)} and the rest, and change the wording per network where it should read differently.`,
    },
  ];
}

export interface PanelCopy {
  title: string;
  body: string;
}

const homeCapability = (id: string) => homeCapabilities.find((c) => c.id === id);

export const panelsHeading = (channel: Channel): string =>
  `Run ${channel.name} from the same calendar as every other network`;

export const panelsIntro = (channel: Channel): string =>
  `${brand.name} keeps drafting, scheduling, sign-off and results for ${channel.name} in one window, next to the ${channelCount - 1} other networks it publishes to, instead of one tab per network.`;

export function panels(channel: Channel): PanelCopy[] {
  return [
    {
      title: `Plan the ${channel.name} week at a glance`,
      body:
        homeCapability('schedule')?.body ??
        'Write a post once and publish it to every channel you pick, on the schedule you set.',
    },
    {
      title: `Let an agent draft your ${channel.name} posts`,
      body: 'Point Claude, ChatGPT or Cursor at the MCP server and they can draft, queue and reschedule posts directly. Everything lands as a draft, so nothing publishes until you say so.',
    },
    {
      title: `Cross-post ${channel.name} to ${channelCount - 1} more networks`,
      body: 'Write it once and pick where it goes. Change the wording per network, because what reads well on one rarely reads well on the next.',
    },
    {
      title: `Sign-off before any ${channel.name} post goes out`,
      body: `${homeCapability('team')?.body ?? 'Invite your team, assign posts, and require approval before anything publishes.'} Clients can review without getting the keys.`,
    },
    {
      title: `See which ${channel.name} posts travelled`,
      body: `Per-post and per-channel numbers sit in one view wherever ${channel.name} reports them, so you can double down on what worked instead of guessing.`,
    },
  ];
}

export const bandTitle = (channel: Channel): string =>
  `Take ${channel.name} off your to-do list`;

export const bandBody = (channel: Channel): string =>
  `Queue ${channel.name} posts days or weeks ahead and let them go out on time while you get on with the rest of the week. Every plan starts with a ${TRIAL_DAYS}-day trial.`;

export interface FaqCopy {
  q: string;
  a: string;
}

export function channelFaqs(channel: Channel): FaqCopy[] {
  const own = formats(channel);
  const variants = channel.variants ?? [];
  const items: FaqCopy[] = [];

  items.push({
    q: `Does ${channel.name} need app review before I can post?`,
    a: connectionCopy(channel),
  });

  items.push({
    q: `Can I connect more than one ${channel.name} account?`,
    a:
      variants.length > 0
        ? `Yes. ${channel.name} is one network but ${variants.length} integrations — ${listOf(variants.map(lower))}. Each authorises separately and counts as its own channel against your plan, so you can run them on different schedules.`
        : `Yes. Each ${channel.name} account you connect is its own channel against your plan, and you can swap one for another at any time.`,
  });

  items.push({
    q: `What can a ${channel.name} post include?`,
    a: own.map((key) => `${capabilityLabel[key]}: ${lower(capabilityDetail[key])}`).join(' '),
  });

  items.push({
    q: `Can I schedule ${channel.name} posts in advance?`,
    a: `Yes. ${capabilityDetail.schedule} The post goes out at that time on its own, next to everything else on the calendar.`,
  });

  if (own.includes('thread')) {
    items.push({
      q: `Can I schedule a ${channel.name} thread?`,
      a: `Yes. ${capabilityDetail.thread} Write every part in one draft and schedule it once.`,
    });
  }

  if (own.includes('comment')) {
    items.push({
      q: `Can the first comment go out with the post?`,
      a: `Yes. ${capabilityDetail.comment}`,
    });
  }

  items.push({
    q: `Can I post the same content to ${channel.name} and other networks?`,
    a: faqAnswer(
      'Can I cross-post the same content everywhere?',
      'Yes, and you can override the wording per network.',
    ),
  });

  items.push({
    q: `Can an AI agent schedule ${channel.name} posts for me?`,
    a: faqAnswer(
      'Can an AI agent post for me?',
      'Yes. Agent output arrives as a draft, so nothing publishes without your say-so.',
    ),
  });

  items.push({
    q: `What happens if a ${channel.name} post fails?`,
    a: faqAnswer(
      'What happens to posts if something fails?',
      'A failed publish is retried and then surfaced in the calendar with the platform error attached.',
    ),
  });

  items.push({
    q: 'Is there a free trial?',
    a: faqAnswer('Is there a free trial?', `Every plan starts with a ${TRIAL_DAYS}-day trial.`),
  });

  return items;
}

/* ------------------------------------------------------- the /channels hub */

export function directoryFaqs(): FaqCopy[] {
  const noReview = sellableChannels.filter((c) => !c.requiresAppReview);
  const withVariants = sellableChannels.filter((c) => (c.variants?.length ?? 0) > 0);
  const what = pricingFaqs.find((item) => item.q === 'What counts as a channel?');

  return [
    {
      q: 'Which networks can I publish to?',
      a: `${channelCount} networks: ${listOf(sellableChannels.map((c) => c.name))}.`,
    },
    {
      q: 'Which networks publish as soon as I connect them?',
      a: `${listOf(noReview.map((c) => c.name))} need no platform review, so the first post can go out the minute you connect. The rest review every app that posts for its users; we hold those approvals, so you connect with OAuth like any other channel.`,
    },
    {
      q: 'What counts as a channel?',
      a: what?.a ?? 'One account on one network.',
    },
    {
      q: 'Can one network connect more than one way?',
      a: `Yes: ${listOf(withVariants.map((c) => `${c.name} (${listOf((c.variants ?? []).map(lower))})`))}. Each way authorises separately and counts as its own channel.`,
    },
    {
      q: 'Can I post the same content to several networks?',
      a: faqAnswer('Can I cross-post the same content everywhere?', 'Yes.'),
    },
    {
      q: 'Can an AI agent post for me?',
      a: faqAnswer('Can an AI agent post for me?', 'Yes.'),
    },
    {
      q: 'Is there a free trial?',
      a: faqAnswer('Is there a free trial?', `Every plan starts with a ${TRIAL_DAYS}-day trial.`),
    },
  ];
}

export { groupLabel };
