import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand, siteUrl } from '@scheduler/brand';
import { Faq } from '@/components/sections/faq';
import {
  sellableChannels as channels,
  channelCount,
  getChannel,
  type Channel,
} from '@/content/channels';
import { plans, popularPlan } from '@/content/pricing';
import { capabilityLabel, orderedSupports } from '@/lib/capabilities';
import { previewImage } from '@/lib/preview-media';
import { ChannelHero, HeroIcon } from '@/components/pages/channels/channel-hero';
import { FeatureCards } from '@/components/pages/channels/feature-cards';
import { FeaturePanels } from '@/components/pages/channels/feature-panels';
import { ChannelBand } from '@/components/pages/channels/channel-band';
import { SiblingLinks } from '@/components/pages/channels/sibling-links';
import {
  AnalyticsIllustration,
  AssistantIllustration,
  CalendarIllustration,
  CrossPostIllustration,
  TeamIllustration,
  type IllustrationChannel,
} from '@/components/pages/channels/illustrations';
import {
  bandBody,
  bandTitle,
  channelFaqs,
  featureCards,
  groupLabel,
  headline,
  panels,
  panelsHeading,
  panelsIntro,
  siblingsOf,
} from '@/components/pages/channels/copy';

/**
 * One indexable landing page per network, laid out as the reference design's
 * channel template: centred hero with floating collages, four feature cards,
 * five gradient panels, a violet band, then the FAQ.
 *
 * These are the pages that answer "schedule <network> posts" in a search, so
 * each one is statically rendered (generateStaticParams), carries its own
 * title, description, canonical URL and JSON-LD (including the breadcrumb
 * trail), and links sideways to eight siblings and up to the directory.
 *
 * All copy comes from the channel's record in src/content/channels.ts through
 * components/pages/channels/copy.ts: a headline names only the formats the
 * channel declares in `supports`, and the connection copy follows
 * `requiresAppReview` and `variants`, so nothing can drift from what the pinned
 * provider build does.
 *
 * Next 15 note: `params` is a Promise and has to be awaited, in the page and in
 * generateMetadata both.
 */

interface ChannelPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return channels.map((channel) => ({ slug: channel.slug }));
}

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const channel = getChannel(slug);

  if (!channel) {
    return { title: 'Channel not found', robots: { index: false, follow: false } };
  }

  const title = headline(channel);
  const description =
    `${channel.blurb} Draft, queue and measure ${channel.name} posts next to ` +
    `${channelCount - 1} other networks in ${brand.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/channels/${channel.slug}` },
    openGraph: {
      title: `${title} — ${brand.name}`,
      description,
      url: siteUrl(`/channels/${channel.slug}`),
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const icon = (channel: Channel) => previewImage(`socials/${channel.slug}.svg`);

const asIllustration = (channel: Channel): IllustrationChannel => ({
  name: channel.name,
  icon: icon(channel),
  chip: groupLabel(channel),
  meta: orderedSupports(channel.supports)
    .filter((key) => key !== 'schedule')
    .slice(0, 3)
    .map((key) => capabilityLabel[key])
    .join(' · '),
});

export default async function ChannelDetailPage({ params }: ChannelPageProps) {
  const { slug } = await params;
  const channel = getChannel(slug);

  if (!channel) notFound();

  const siblings = siblingsOf(channel);
  const copy = panels(channel);
  const lowestMonthly = Math.min(...plans.map((plan) => plan.monthly));
  const supports = orderedSupports(channel.supports);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: `${brand.name} for ${channel.name}`,
        description: channel.detail,
        url: siteUrl(`/channels/${channel.slug}`),
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Social media management',
        operatingSystem: 'Web',
        featureList: supports.map((key) => capabilityLabel[key]),
        offers: {
          '@type': 'Offer',
          price: String(lowestMonthly),
          priceCurrency: popularPlan.currency,
          url: siteUrl('/pricing'),
          availability: 'https://schema.org/InStock',
        },
        publisher: {
          '@type': 'Organization',
          name: brand.legalName,
          url: siteUrl(),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Channels', item: siteUrl('/channels') },
          {
            '@type': 'ListItem',
            position: 2,
            name: channel.name,
            item: siteUrl(`/channels/${channel.slug}`),
          },
        ],
      },
    ],
  };

  const [first, second, third] = siblings;

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the channel record above, so there is no user input in it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ChannelHero
        icon={<HeroIcon src={icon(channel)} />}
        label={channel.name}
        title={headline(channel)}
        sub={channel.detail}
        badges={[icon(channel), icon(first)]}
      />

      <FeatureCards items={featureCards(channel)} />

      <FeaturePanels
        heading={panelsHeading(channel)}
        intro={panelsIntro(channel)}
        panels={[
          {
            ...copy[0],
            illustration: (
              <CalendarIllustration
                posts={[asIllustration(channel), asIllustration(first), asIllustration(second)]}
              />
            ),
          },
          { ...copy[1], illustration: <AssistantIllustration channelName={channel.name} /> },
          {
            ...copy[2],
            illustration: (
              <CrossPostIllustration
                channels={[asIllustration(first), asIllustration(second), asIllustration(third)]}
              />
            ),
            extra: <SiblingLinks siblings={siblings} />,
          },
          { ...copy[3], illustration: <TeamIllustration /> },
          { ...copy[4], illustration: <AnalyticsIllustration /> },
        ]}
      />

      <ChannelBand title={bandTitle(channel)} body={bandBody(channel)} />

      <Faq items={channelFaqs(channel)} />
    </>
  );
}
