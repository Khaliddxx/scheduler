import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { DevelopersPage } from '@/components/pages/developers/developers-page';
import { DEV } from '@/content/developers';

/**
 * /developers
 *
 * The REST API, webhooks, MCP server and CLI on one page, in the layout of the
 * integration pages (components/pages/integrations). Words come from
 * src/content/developers.ts; every code sample there is labelled illustrative,
 * and none of them asserts an exact endpoint path as a published contract.
 *
 * Anchors #api, #webhooks, #mcp and #cli are linked from the header menu.
 */

export const metadata: Metadata = {
  title: 'API, webhooks and automation',
  description: DEV.description,
  alternates: { canonical: '/developers' },
  openGraph: {
    title: `${DEV.title} — ${brand.name}`,
    description: DEV.description,
    url: siteUrl('/developers'),
    type: 'website',
  },
};

export default function DevelopersRoute() {
  return <DevelopersPage />;
}
