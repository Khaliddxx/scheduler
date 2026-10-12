import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { channelCount } from '@/content/channels';
import { homeFaqs } from '@/content/faq';

import { Hero } from '@/components/sections/hero';
import { ShowcasePanel } from '@/components/sections/showcase-panel';
import { TrustBar } from '@/components/sections/trust-bar';
import { StatMarquee } from '@/components/sections/stat-marquee';
import { Audiences } from '@/components/sections/audiences';
import { Assistants } from '@/components/sections/assistants';
import { Integrations } from '@/components/sections/integrations';
import { Capabilities } from '@/components/sections/capabilities';
import { ChannelGrid } from '@/components/sections/channel-grid';
import { Testimonials } from '@/components/sections/testimonials';
import { Faq } from '@/components/sections/faq';
import { CtaBand } from '@/components/sections/cta-band';
import { Reveal } from '@/components/ui/reveal';

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  alternates: { canonical: siteUrl('/') },
};

/**
 * Home page.
 *
 * Section order follows the argument the page is making, which is worth
 * stating because it is easy to reorder these into incoherence:
 *
 *   Hero          what it is, in one sentence, with the proof visible
 *   TrustBar      the breadth claim, shown rather than asserted
 *   Audiences     who it is for — lets a visitor self-select in or out fast
 *   Assistants    the differentiator: drive it from ChatGPT, Claude, a terminal
 *   Integrations  the plumbing behind that — API, MCP, webhooks, automations
 *   Capabilities  the table stakes, in depth, for someone now evaluating
 *   ChannelGrid   the breadth claim again, now as a browsable directory
 *   Testimonials  proof, once there is something to be persuaded of
 *   Faq           objection handling, last, for the people still hesitating
 *   CtaBand       the ask
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
      {/*
        The hero animates itself on load; everything below enters on scroll.
        `distance="none"` on the wide bento sections because a large block
        sliding upward reads as a template — they fade only.
      */}
      <Hero />
      <ShowcasePanel />
      <StatMarquee />
      <TrustBar />
      <Reveal>
        <Audiences />
      </Reveal>
      <Reveal distance="none">
        <Assistants />
      </Reveal>
      <Reveal distance="none">
        <Integrations />
      </Reveal>
      <Reveal distance="none">
        <Capabilities />
      </Reveal>
      <Reveal>
        <ChannelGrid />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Faq items={homeFaqs} title="Questions, answered" id="faq" />
      </Reveal>
      <Reveal>
        <CtaBand />
      </Reveal>
    </>
  );
}
