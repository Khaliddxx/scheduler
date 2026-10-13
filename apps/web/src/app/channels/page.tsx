import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { Faq } from '@/components/sections/faq';
import {
  sellableChannels as channels,
  channelCount,
  channelGroups,
  integrationCount,
  noReviewChannels,
} from '@/content/channels';
import { primaryNav } from '@/content/nav';
import { previewImage } from '@/lib/preview-media';
import { ChannelHero } from '@/components/pages/channels/channel-hero';
import { ChannelDirectory } from '@/components/pages/channels/directory';
import { ChannelBand } from '@/components/pages/channels/channel-band';
import { directoryFaqs } from '@/components/pages/channels/copy';
import { TRIAL_DAYS } from '@/content/pricing';

/**
 * The channel directory.
 *
 * This page exists to be indexed: one crawlable landing page per network is how a
 * publishing tool gets found, and this is the hub that links to all of them.
 *
 * The reference design has no directory page, so this one is built from its
 * channel-page template (components/pages/channels/): the same centred hero with
 * floating collages, the feature-card surface for the channel cards, the violet
 * band and the FAQ, so the section reads as one design.
 *
 * Every number on it is computed from `channels` — the heading count, the
 * connectable-account count, the per-group counts and the no-review count — so a
 * provider added to src/content/channels.ts updates the page and its <title>
 * together. `pnpm brand:verify` checks that list against the pinned provider
 * lock, and a hand-typed number here would sail straight past that check.
 */

/** Reuse the nav's own word for this page rather than inventing a label. */
const navLabel = primaryNav.find((group) => group.href === '/channels')?.label ?? 'Channels';

const title = `All ${channelCount} publishing channels`;

const description =
  `Every network ${brand.name} publishes to: ${channelCount} networks and ` +
  `${integrationCount} connectable accounts, including ` +
  `${channels.slice(0, 4).map((c) => c.name).join(', ')}. ` +
  `${noReviewChannels.length} publish as soon as you connect them.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/channels' },
  openGraph: {
    title: `${title} — ${brand.name}`,
    description,
    url: siteUrl('/channels'),
    type: 'website',
  },
};

/** Three overlapping app icons in place of the single icon a channel page shows. */
function IconStack() {
  const icons = ['instagram', 'linkedin', 'x']
    .map((slug) => previewImage(`socials/${slug}.svg`))
    .filter((src): src is string => Boolean(src));
  if (icons.length === 0) return null;
  return (
    <span aria-hidden className="flex -space-x-2">
      {icons.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          width={70}
          height={70}
          className="h-6 w-6 rounded-[6px] ring-2 ring-[#0e0e0e] sm:h-8 sm:w-8 sm:rounded-[8px]"
        />
      ))}
    </span>
  );
}

export default function ChannelsPage() {
  const groups = channelGroups
    .map((group) => ({
      ...group,
      members: channels.filter((channel) => channel.group === group.id),
    }))
    .filter((group) => group.members.length > 0);

  return (
    <>
      <ChannelHero
        icon={<IconStack />}
        label={navLabel}
        title={`Publish to ${channelCount} networks from one calendar`}
        sub={
          <>
            Grouped by what each network is for. {integrationCount} accounts can be connected
            in all, because a company page and a personal profile on the same network connect
            separately. {noReviewChannels.length} of them publish the moment you connect them.
          </>
        }
        badges={[previewImage('socials/instagram.svg'), previewImage('socials/youtube.svg')]}
      />

      <ChannelDirectory groups={groups} />

      <ChannelBand
        title={`Take all ${channelCount} off your to-do list`}
        body={`Write once, queue it for every network you pick, and let it go out on time while you get on with the week. Every plan starts with a ${TRIAL_DAYS}-day trial.`}
      />

      <Faq items={directoryFaqs()} />
    </>
  );
}
