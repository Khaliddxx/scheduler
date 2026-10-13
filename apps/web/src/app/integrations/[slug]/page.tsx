import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand, siteUrl } from '@scheduler/brand';
import { IntegrationPage } from '@/components/pages/integrations/integration-page';
import { getIntegration, integrations } from '@/content/integrations';

/**
 * One page per integration behind the Integrations menu.
 *
 * Statically rendered, own metadata and canonical. The layout is the shared
 * integration template (components/pages/integrations); every word comes from
 * src/content/integrations.ts.
 */

interface IntegrationPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return integrations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: IntegrationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getIntegration(slug);

  if (!item) {
    return { title: 'Integration not found', robots: { index: false, follow: false } };
  }

  const title = `${item.headline} — ${item.name} + ${brand.name}`;
  return {
    title,
    description: item.summary,
    alternates: { canonical: `/integrations/${item.slug}` },
    openGraph: {
      title,
      description: item.summary,
      url: siteUrl(`/integrations/${item.slug}`),
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description: item.summary },
  };
}

export default async function IntegrationRoute({ params }: IntegrationPageProps) {
  const { slug } = await params;
  const item = getIntegration(slug);

  if (!item) notFound();

  return <IntegrationPage item={item} />;
}
