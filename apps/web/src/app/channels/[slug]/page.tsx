import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/cn';
import { brand, registerUrl, siteUrl } from '@scheduler/brand';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { CalendarMock } from '@/components/visuals';
import { CtaBandSlim } from '@/components/sections/cta-band';
import {
  sellableChannels as channels,
  channelCount,
  channelGroups,
  getChannel,
  type Channel,
} from '@/content/channels';
import { plans, popularPlan, TRIAL_DAYS } from '@/content/pricing';
import { capabilityDetail, capabilityLabel, orderedSupports } from '@/lib/capabilities';

/**
 * One indexable landing page per network.
 *
 * These are the pages that answer "schedule <network> posts" in a search result,
 * so each one is statically rendered at build time (generateStaticParams below),
 * carries its own title, description, canonical URL and JSON-LD, and links
 * sideways to its siblings so the whole directory is crawlable from any of them.
 *
 * All copy is the channel's own `detail`/`blurb` from src/content/channels.ts plus
 * the capability lines in src/lib/capabilities.ts. Nothing here claims a feature a
 * channel has not declared in `supports`, and the app-review note is driven by
 * `requiresAppReview` rather than written per page — so none of it can drift from
 * what the pinned provider build actually does.
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

const groupLabel = (channel: Channel): string =>
  channelGroups.find((group) => group.id === channel.group)?.label ?? 'Channels';

/** The page's own <h1>, reused as the <title> so both frame the same benefit. */
const headline = (channel: Channel): string =>
  `Schedule ${channel.name} posts from one calendar`;

export async function generateMetadata({
  params,
}: ChannelPageProps): Promise<Metadata> {
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

const Tick = () => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    className="mt-0.5 shrink-0 text-accent"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeOpacity="0.35" />
    <path
      d="M6.2 10.3l2.5 2.5 5.1-5.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default async function ChannelDetailPage({ params }: ChannelPageProps) {
  const { slug } = await params;
  const channel = getChannel(slug);

  if (!channel) notFound();

  const supports = orderedSupports(channel.supports);
  const variants = channel.variants ?? [];

  /**
   * Eight siblings, taken as the window that follows this channel in the content
   * file and wrapping round the end. Deterministic, so the strip is stable across
   * builds, and different on every page, which is the point of linking sideways.
   */
  const index = channels.findIndex((c) => c.slug === channel.slug);
  const siblings = [
    ...channels.slice(index + 1),
    ...channels.slice(0, Math.max(index, 0)),
  ].slice(0, 8);

  const lowestMonthly = Math.min(...plans.map((plan) => plan.monthly));

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
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Channels',
            item: siteUrl('/channels'),
          },
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

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the channel record above, so there is no user input in it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <div className="shell">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-body-xs text-dim">
              <li>
                <Link
                  href="/channels"
                  className="transition-colors hover:text-white"
                >
                  Channels
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-muted">{channel.name}</li>
            </ol>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <ChannelIcon channel={channel} size={60} />
                <span className="eyebrow">{groupLabel(channel)}</span>
              </div>

              <h1 className="mt-7 max-w-[20ch] font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-display-sm lg:text-display-md">
                {headline(channel)}
              </h1>

              <p className="mt-6 max-w-[56ch] text-body-md text-muted">
                {channel.detail}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  href={registerUrl()}
                  external
                  size="lg"
                  withChevron
                  className="w-full sm:w-auto"
                >
                  {popularPlan.cta}
                </Button>
                <Button
                  href="/pricing"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  See pricing
                </Button>
              </div>

              <p className="mt-5 text-body-xs text-dim">
                {TRIAL_DAYS}-day trial on every plan. No card to start.
              </p>
            </div>

            {/* Decorative: the mock carries aria-hidden on its own frame. */}
            <CalendarMock className="lg:justify-self-end" />
          </div>
        </div>
      </Section>

      <Section tight className="pt-0 sm:pt-0">
        <div className="shell">
          <h2 className="font-display text-heading-sm text-white sm:text-heading-md">
            What a {channel.name} post can carry
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {supports.map((key) => (
              <li key={key} className="card flex gap-4 p-5">
                <Tick />
                <div className="min-w-0">
                  <span className="block text-body-sm font-medium text-white">
                    {capabilityLabel[key]}
                  </span>
                  <span className="mt-2 block text-body-xs leading-[1.6] text-dim">
                    {capabilityDetail[key]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tight className="pt-0 sm:pt-0">
        <div className="shell">
          <h2 className="font-display text-heading-sm text-white sm:text-heading-md">
            Connecting {channel.name}
          </h2>

          <div
            className={cn(
              'mt-8 grid gap-4',
              variants.length > 0 ? 'lg:grid-cols-2' : 'max-w-[60ch]',
            )}
          >
            {variants.length > 0 ? (
              <div className="card p-6 sm:p-7">
                <span className="block text-body-sm font-medium text-white">
                  {variants.length} ways to connect
                </span>
                <p className="mt-3 text-body-xs leading-[1.7] text-dim">
                  {channel.name} is one network but more than one integration. Each of
                  these authorises separately and counts as its own channel against
                  your plan, so you can run them on different schedules.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <li
                      key={variant}
                      className="rounded-control bg-white/[0.06] px-3 py-1.5 text-body-xs text-muted shadow-hairline"
                    >
                      {variant}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="card p-6 sm:p-7">
              <span className="block text-body-sm font-medium text-white">
                {channel.requiresAppReview ? 'Platform approval' : 'Live when you connect it'}
              </span>
              <p className="mt-3 text-body-xs leading-[1.7] text-dim">
                {channel.requiresAppReview
                  ? `${channel.name} reviews every application that posts on someone's behalf. That approval is ours to hold and keep current — you connect your account with OAuth, the same as any other channel.`
                  : `${channel.name} needs no platform review. Connect the account and the first post can go out the same minute.`}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tight className="pt-0 sm:pt-0">
        <div className="shell">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-separator pt-10">
            <h2 className="font-display text-heading-sm text-white">
              Also publishes to
            </h2>
            <Link
              href="/channels"
              className="text-body-xs text-muted underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              All {channelCount} channels
            </Link>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {siblings.map((sibling) => (
              <li key={sibling.slug}>
                <Link
                  href={`/channels/${sibling.slug}`}
                  className="card flex h-full items-center gap-3 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hairline-strong"
                >
                  <ChannelIcon channel={sibling} size={34} />
                  <span className="min-w-0 truncate text-body-sm font-medium text-white">
                    {sibling.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBandSlim title={`Put ${channel.name} on the same calendar as everything else`} />
    </>
  );
}
