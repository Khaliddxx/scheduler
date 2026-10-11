import { Section } from '@/components/ui/section';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { sellableChannels as channels, channelCount, integrationCount, type Channel } from '@/content/channels';
import { primaryNav } from '@/content/nav';

/**
 * The band under the hero.
 *
 * Deliberately NOT social proof: there are no customers to name yet, and
 * `headlineStats` is flagged in src/content/features.ts as placeholder. So the
 * marquee shows what is actually true — every network the product publishes to,
 * each with its own one-line blurb from the channel list.
 */

/** Reuse the nav's own description of the channel list rather than writing new copy. */
const channelsNav = primaryNav
  .flatMap((group) => group.children ?? [])
  .find((link) => link.href === '/channels');

const intro = channelsNav?.description ?? `All ${channelCount} networks you can publish to`;

function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <li className="card flex w-[280px] shrink-0 items-start gap-3.5 p-4 sm:w-[330px]">
      <ChannelIcon channel={channel} size={38} />
      <span className="flex min-w-0 flex-col gap-1 text-left">
        <span className="text-body-sm font-semibold text-white">{channel.name}</span>
        <span className="text-body-xs leading-[1.5] text-muted">{channel.blurb}</span>
      </span>
    </li>
  );
}

export function TrustBar() {
  const cards = channels.map((channel) => (
    <ChannelCard key={channel.slug} channel={channel} />
  ));

  return (
    <Section tight className="overflow-hidden">
      <p className="shell text-center text-body-sm text-dim">
        {intro} — {integrationCount} connectable accounts in all
      </p>

      <div className="mask-x mt-10 w-full overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee-slow">
          <ul className="flex shrink-0 items-stretch gap-3 pr-3">{cards}</ul>
          {/* Second copy exists only so translateX(-50%) loops seamlessly. */}
          <ul aria-hidden className="flex shrink-0 items-stretch gap-3 pr-3">
            {cards}
          </ul>
        </div>
      </div>
    </Section>
  );
}
