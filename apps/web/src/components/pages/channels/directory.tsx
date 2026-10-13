import Link from 'next/link';
import type { Channel } from '@/content/channels';
import { capabilityLabel, orderedSupports } from '@/lib/capabilities';
import { previewImage } from '@/lib/preview-media';

/**
 * The channel directory's body: one block per group, each a heading row and a
 * grid of channel cards. The cards are the channel template's feature cards
 * (same surface, border, radius and padding), sized down to sit three across,
 * and every card links to its channel page.
 *
 * Channel names are links inside list items, not headings: the group headings
 * carry the outline a screen reader reads, and the cards are reachable through
 * the links rotor, which is what they are.
 */

const Arrow = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    className="shrink-0 text-white/40 transition-colors duration-200 group-hover:text-white"
  >
    <path
      d="M7 17 17 7m0 0H8.5M17 7v8.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ChannelCard({ channel }: { channel: Channel }) {
  const icon = previewImage(`socials/${channel.slug}.svg`);
  return (
    <li>
      <Link
        href={`/channels/${channel.slug}`}
        className="group flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-[#1A1919] p-6 pb-8 transition-colors duration-200 hover:border-white/20 sm:rounded-[20px] sm:p-8 sm:pb-10"
      >
        <span className="flex items-start justify-between gap-3">
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={icon}
              alt=""
              width={70}
              height={70}
              loading="lazy"
              className="h-12 w-12 rounded-[12px] sm:h-14 sm:w-14"
            />
          ) : (
            <span aria-hidden className="h-12 w-12 sm:h-14 sm:w-14" />
          )}
          <Arrow />
        </span>
        <span className="mt-2 text-[22px] font-bold leading-[28.64px] sm:text-[26px] sm:leading-[33.85px]">
          {channel.name}
        </span>
        <span className="text-[18px] font-normal leading-[23.44px] text-[#d1d1d1]">
          {channel.blurb}
        </span>
        <span className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {orderedSupports(channel.supports).map((key) => (
            <span
              key={key}
              className="rounded-full bg-white/[0.07] px-3 py-1 text-[13px] leading-[18px] text-[#d1d1d1]"
            >
              {capabilityLabel[key]}
            </span>
          ))}
        </span>
      </Link>
    </li>
  );
}

export function ChannelDirectory({
  groups,
}: {
  groups: Array<{ id: string; label: string; members: Channel[] }>;
}) {
  return (
    <section className="section-pz space-y-[50px] sm:space-y-[70px]">
      {groups.map((group) => (
        <div key={group.id} id={group.id} className="w-full scroll-mt-24 space-y-5 sm:space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="font-jakarta text-[22px] font-semibold leading-[24.2px] text-white sm:text-[38px] sm:leading-[41.8px]">
              {group.label}
            </h2>
            <p className="text-[18px] leading-[23.44px] text-[#d1d1d1]">
              {group.members.length} {group.members.length === 1 ? 'network' : 'networks'}
            </p>
          </div>
          <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {group.members.map((channel) => (
              <ChannelCard key={channel.slug} channel={channel} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
