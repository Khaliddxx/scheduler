import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { IntegrationGlyph } from '@/components/ui/integration-glyph';
import { CtaBandSlim } from '@/components/sections/cta-band';
import { previewImage } from '@/lib/preview-media';
import { agentMenu } from '@/content/nav';
import { integrations, kindLabel, type IntegrationKind } from '@/content/integrations';

export const metadata: Metadata = {
  title: 'Integrations',
  description: `Every assistant, automation tool and content source that can drive the ${brand.name} calendar.`,
  alternates: { canonical: siteUrl('/integrations') },
};

const order: IntegrationKind[] = ['assistant', 'automation', 'feed'];

const glyphFor = (slug: string): string | undefined =>
  agentMenu.find((entry) => entry.href === `/integrations/${slug}`)?.glyph;

export default function IntegrationsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Integrations"
        title="Drive the calendar from wherever you already work"
        body="Assistants connect over the MCP server, automation tools over the public API, and feeds are read directly. Pick one to see the setup."
      />

      {order.map((kind) => {
        const items = integrations.filter((item) => item.kind === kind);
        if (!items.length) return null;

        return (
          <Section key={kind} tight className="pt-0 sm:pt-0">
            <div className="shell">
              <h2 className="font-display text-heading-sm text-white">{kindLabel[kind]}s</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const logo = item.logo ? previewImage(`agents/${item.logo}.svg`) : null;
                  const glyph = glyphFor(item.slug);
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/integrations/${item.slug}`}
                        className="card flex h-full items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hairline-strong"
                      >
                        {logo ? (
                          // Static SVG with its own tile background; no optimisation pass needed.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logo} alt="" width={40} height={40} className="shrink-0 rounded-input shadow-hairline" />
                        ) : (
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-input bg-white/[0.07] text-white shadow-hairline">
                            {glyph ? <IntegrationGlyph name={glyph} /> : item.name[0]}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block text-body-sm font-semibold text-white">{item.name}</span>
                          <span className="mt-1 block text-body-xs leading-[1.6] text-dim">{item.headline}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        );
      })}

      <CtaBandSlim title="Connect one today; the rest take minutes each" />
    </>
  );
}
