import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/section';
import { ChannelIcon } from '@/components/ui/channel-icon';
import {
  sellableChannels as channels,
  channelCount,
  noReviewChannels,
  type Channel,
} from '@/content/channels';
import { primaryNav } from '@/content/nav';

/**
 * The channel showcase: every network, each one a link to its own page.
 *
 * Both numbers in this section are computed from `channels` rather than typed —
 * the heading count and the "no platform review" count — so adding a provider to
 * src/content/channels.ts updates the claim everywhere it appears. That matters
 * here more than elsewhere: `pnpm brand:verify` fails the build when the channel
 * list disagrees with infra/overlay/providers.lock, and a hand-typed number in a
 * component would sail straight past it.
 *
 * The tiles are a plain list of links, not a run of <h3>s. Twenty-five headings
 * would bury the page's real outline in a screen reader's heading list, whereas a
 * list of links is exactly what this is and is reachable by the links rotor.
 */

/** Reuse the nav's own word for this section instead of inventing a label. */
const channelsNav = primaryNav.find((group) => group.href === '/channels');

function ChannelTile({ channel }: { channel: Channel }) {
  return (
    <li>
      <Link
        href={`/channels/${channel.slug}`}
        className="card flex h-full flex-col gap-3.5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hairline-strong sm:gap-4 sm:p-5"
      >
        <ChannelIcon channel={channel} size={38} className="tile-hover" />
        <span className="flex flex-col gap-1.5">
          <span className="text-body-sm font-medium text-white">{channel.name}</span>
          {/* Two lines, so a long blurb cannot make one tile taller than its row. */}
          <span className="line-clamp-2 text-body-xs leading-[1.45] text-dim">
            {channel.blurb}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function ChannelGrid() {
  return (
    <Section id="channels">
      <div className="shell">
        <SectionHeading
          eyebrow={channelsNav?.label ?? 'Channels'}
          title={`Publish to ${channelCount} networks from one calendar`}
        />

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {channels.map((channel) => (
            <ChannelTile key={channel.slug} channel={channel} />
          ))}
        </ul>

        <p className="mt-9 text-center text-body-sm text-dim sm:mt-11">
          {noReviewChannels.length} of them need no platform review, so they publish as
          soon as you connect them.{' '}
          <Link
            href="/channels"
            className="text-muted underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
          >
            Browse all networks
          </Link>
        </p>
      </div>
    </Section>
  );
}
