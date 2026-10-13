import type { ReactNode } from 'react';
import { headerNav, agentsMenu, channelMenuOrder, channelMenuLabels } from '@/content/nav';
import { channelsInDisplayOrder, SocialIcon } from '@/components/ui/social-icon';
import { previewImage } from '@/lib/preview-media';
import { HeaderBar, type HeaderMenuItem } from '@/components/layout/header-bar';

/**
 * Site header.
 *
 * A server component on purpose: the two mega-menus show logo files from
 * public/preview/, and which of those exist is decided on the server. The
 * icons are rendered here and handed to the interactive bar (header-bar.tsx)
 * as ready-made elements, so the client bundle never needs the filesystem
 * lookups.
 *
 * Icons are decorative (the label sits next to each), hence the empty alt.
 */

/* eslint-disable @next/next/no-img-element -- static SVGs from /public need no optimisation pass */

function agentItems(): HeaderMenuItem[] {
  return agentsMenu.map((agent) => {
    const src = previewImage(`agents/${agent.logo}.svg`);
    const icon: ReactNode = src ? (
      <img
        key="icon"
        src={src}
        alt=""
        width={24}
        height={24}
        draggable={false}
        className={
          agent.ownTile
            ? 'h-6 w-6 shrink-0'
            : 'h-6 w-6 shrink-0 select-none rounded-[27%] ring-1 ring-inset ring-white/25'
        }
      />
    ) : (
      <span key="icon" aria-hidden className="h-6 w-6 shrink-0 rounded-[27%] bg-white/10" />
    );
    return { key: `${agent.label}-${agent.href}`, label: agent.label, href: agent.href, icon };
  });
}

const menuRank = (slug: string): number => {
  const i = channelMenuOrder.indexOf(slug);
  return i === -1 ? channelMenuOrder.length : i;
};

function channelItems(): HeaderMenuItem[] {
  return [...channelsInDisplayOrder]
    .sort((a, b) => menuRank(a.slug) - menuRank(b.slug))
    .map((channel) => {
      const src = previewImage(`socials/${channel.slug}.svg`);
      const icon: ReactNode = src ? (
        <img
          key="icon"
          src={src}
          alt=""
          width={70}
          height={70}
          loading="lazy"
          decoding="async"
          className="h-5 w-5"
        />
      ) : (
        <SocialIcon key="icon" channel={channel} className="h-5 w-5" />
      );
      return {
        key: channel.slug,
        label: channelMenuLabels[channel.slug] ?? channel.name,
        href: `/channels/${channel.slug}`,
        icon,
      };
    });
}

export function Header() {
  return <HeaderBar nav={headerNav} agents={agentItems()} channels={channelItems()} />;
}
