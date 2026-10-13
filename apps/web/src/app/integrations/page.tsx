import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { IntegrationsIndexPage } from '@/components/pages/integrations/index-page';

export const metadata: Metadata = {
  title: 'Integrations',
  description: `Every assistant, automation tool and content source that can drive the ${brand.name} calendar.`,
  alternates: { canonical: siteUrl('/integrations') },
};

export default function IntegrationsRoute() {
  return (
    <IntegrationsIndexPage
      title="Drive the calendar from wherever you already work"
      body="Assistants connect over the MCP server, automation tools over the public API, and feeds are read directly. Pick one to see the setup."
    />
  );
}
