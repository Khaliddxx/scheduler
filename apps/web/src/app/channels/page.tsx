import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, siteUrl } from '@scheduler/brand';
import { Section } from '@/components/ui/section';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { CtaBandSlim } from '@/components/sections/cta-band';
import {
  sellableChannels as channels,
  channelCount,
  channelGroups,
  integrationCount,
  noReviewChannels,
  type Channel,
} from '@/content/channels';
import { primaryNav } from '@/content/nav';
import { capabilityLabel, orderedSupports } from '@/lib/capabilities';

/**
 * The channel directory.
 *
 * This page exists to be indexed: one crawlable landing page per network is how a
 * publishing tool gets found, and this is the hub that links to all of them.
 *
 * Every number on it is computed from `channels` — the heading count, the
 * connectable-account count, the per-group counts and the no-review count — so a
 * provider added to src/content/channels.ts updates the page and its <title>
 * together. `pnpm brand:verify` checks that list against the pinned provider
 * lock, and a hand-typed number here would sail straight past that check.
 *
 * Channel names are links, not a run of 25 <h3>s: the group labels carry the
 * outline a screen reader reads, and the tiles are reachable through the links
 * rotor, which is what they actually are. Same reasoning as the home page's
 * ChannelGrid section.
 */

/** Reuse the nav's own word for this page rather than inventing a label. */
const navLabel =
  primaryNav.find((group) => group.href === '/channels')?.label ?? 'Channels';

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

const ArrowCorner = () => (
  <svg
    aria-hidden
    viewBox="0 0 14 14"
    width="14"
    height="14"
    fill="none"
    className="mt-1.5 shrink-0 text-dim transition-colors duration-200 group-hover:text-white"
  >
    <path
      d="M4 10 10 4m0 0H5.2M10 4v4.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <li>
      <Link
        href={`/channels/${channel.slug}`}
        className="card group flex h-full flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hairline-strong"
      >
        <span className="flex items-start justify-between gap-3">
          <ChannelIcon channel={channel} size={44} />
          <ArrowCorner />
        </span>

        <span className="flex flex-col gap-1.5">
          <span className="text-body-md font-medium leading-tight text-white">
            {channel.name}
          </span>
          <span className="text-body-xs leading-[1.5] text-dim">{channel.blurb}</span>
        </span>

        {/* Capability chips sit on the baseline of the card so rows line up. */}
        <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {orderedSupports(channel.supports).map((key) => (
            <span
              key={key}
              className="rounded-control bg-white/[0.06] px-2.5 py-1 text-[11px] leading-none text-muted shadow-hairline"
            >
              {capabilityLabel[key]}
            </span>
          ))}
        </span>
      </Link>
    </li>
  );
}

export default function ChannelsPage() {
  return (
    <>
      <Section>
        <div className="shell">
          <span className="eyebrow">{navLabel}</span>

          <h1 className="mt-6 max-w-[22ch] font-display text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-display-sm lg:text-display-md">
            Publish to {channelCount} networks from one calendar
          </h1>

          <p className="mt-6 max-w-[58ch] text-body-md text-muted">
            Grouped by what each network is for. {integrationCount} accounts can be
            connected in all, because a company page and a personal profile on the same
            network connect separately. {noReviewChannels.length} of them publish the
            moment you connect them.
          </p>
        </div>
      </Section>

      {channelGroups.map((group) => {
        const members = channels.filter((channel) => channel.group === group.id);
        if (members.length === 0) return null;

        return (
          <Section key={group.id} id={group.id} tight className="pt-0 sm:pt-0">
            <div className="shell">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-separator pt-8">
                <h2 className="font-display text-heading-sm text-white sm:text-heading-md">
                  {group.label}
                </h2>
                <p className="text-body-xs text-dim">
                  {members.length} {members.length === 1 ? 'network' : 'networks'}
                </p>
              </div>

              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((channel) => (
                  <ChannelCard key={channel.slug} channel={channel} />
                ))}
              </ul>
            </div>
          </Section>
        );
      })}

      <CtaBandSlim />
    </>
  );
}
