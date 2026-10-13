import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { channelCount } from '@/content/channels';
import { homeFaqs } from '@/content/faq';

import { Hero } from '@/components/sections/hero';
import { ShowcasePanel } from '@/components/sections/showcase-panel';
import { StatMarquee } from '@/components/sections/stat-marquee';
import { Audiences } from '@/components/sections/audiences';
import { Assistants } from '@/components/sections/assistants';
import { InAction } from '@/components/sections/in-action';
import { Capabilities } from '@/components/sections/capabilities';
import { ChannelGrid } from '@/components/sections/channel-grid';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { CtaBand } from '@/components/sections/cta-band';

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  alternates: { canonical: siteUrl('/') },
};

/**
 * Home page.
 *
 * Section order, widths and rhythm follow the reference design section for
 * section (see public/preview/README.md for the media each one uses):
 *
 *   Hero           what it is, with the assistant it runs from cycling in the headline
 *   ShowcasePanel  agentic / classic toggle over the product footage
 *   StatMarquee    what each network can be sent, as two counter-scrolling rows
 *   Audiences      who it is for
 *   InAction       the product demo
 *   Assistants     drive it from ChatGPT, Claude, a terminal; and automation
 *   Capabilities   the table stakes, in depth
 *   ChannelGrid    every network, as a browsable directory
 *   CtaBand        the ask, mid-page
 *   Testimonials   proof
 *   Faq            objection handling
 *
 * The footer carries the closing call to action. Sections do not animate in on
 * scroll; only the elements the reference animates move.
 */
export default function HomePage() {
  // Product schema, emitted server-side. Keep the claims here identical to the
  // ones on the page — structured data that disagrees with visible content is
  // worse than none.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: brand.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: brand.description,
    url: siteUrl('/'),
    featureList: [
      `Publish to ${channelCount} social networks`,
      'Visual scheduling calendar',
      'AI-assisted drafting',
      'Team approvals and client workspaces',
      'Public REST API, webhooks and MCP server',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised server-side from a literal we control; no user input reaches it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ShowcasePanel />
      <StatMarquee />
      <Audiences />
      <InAction />
      <Assistants />
      <Capabilities />
      <ChannelGrid />
      <CtaBand />
      <Testimonials />
      <Faq items={homeFaqs} title="Questions, answered" id="faq" />
    </>
  );
}
