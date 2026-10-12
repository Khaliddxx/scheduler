import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brand, registerUrl, siteUrl } from '@scheduler/brand';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { VideoFrame } from '@/components/ui/video-frame';
import { IntegrationGlyph } from '@/components/ui/integration-glyph';
import { CtaBandSlim } from '@/components/sections/cta-band';
import { previewImage } from '@/lib/preview-media';
import { agentMenu } from '@/content/nav';
import { popularPlan, TRIAL_DAYS } from '@/content/pricing';
import { getIntegration, integrations, kindLabel, type Integration } from '@/content/integrations';

/**
 * One page per integration behind the Integrations menu.
 *
 * Same shape as the channel pages: statically rendered, own metadata and
 * canonical, three concrete setup steps, and a sibling strip so every page
 * links to the rest. Copy comes from src/content/integrations.ts only.
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

/** The menu's glyph key for a slug, so the sibling strip matches the menu. */
const glyphFor = (slug: string): string | undefined =>
  agentMenu.find((entry) => entry.href === `/integrations/${slug}`)?.glyph;

function Mark({ item, size }: { item: Integration; size: number }) {
  const logo = item.logo ? previewImage(`agents/${item.logo}.svg`) : null;

  if (logo) {
    // The SVGs carry their own tile background. Static file, no optimisation pass needed.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" width={size} height={size} className="shrink-0 rounded-input shadow-hairline" />;
  }

  const glyph = glyphFor(item.slug);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-input bg-white/[0.07] text-white shadow-hairline"
      style={{ width: size, height: size }}
    >
      {glyph ? <IntegrationGlyph name={glyph} /> : <span className="font-display font-bold">{item.name[0]}</span>}
    </span>
  );
}

export default async function IntegrationPage({ params }: IntegrationPageProps) {
  const { slug } = await params;
  const item = getIntegration(slug);

  if (!item) notFound();

  const siblings = integrations.filter((other) => other.slug !== item.slug);

  return (
    <>
      <Section>
        <div className="shell">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-body-xs text-dim">
              <li>
                <Link href="/integrations" className="transition-colors hover:text-white">
                  Integrations
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-muted">{item.name}</li>
            </ol>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <Mark item={item} size={56} />
                <span className="eyebrow">{kindLabel[item.kind]}</span>
              </div>

              <h1 className="mt-7 max-w-[18ch] font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-display-sm lg:text-display-md">
                {item.headline}
              </h1>

              <p className="mt-6 max-w-[56ch] text-body-md text-muted">{item.summary}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button href={registerUrl()} external size="lg" withChevron className="w-full sm:w-auto">
                  {popularPlan.cta}
                </Button>
                <Button href="/developers" variant="secondary" size="lg" className="w-full sm:w-auto">
                  Developer docs
                </Button>
              </div>

              <p className="mt-5 text-body-xs text-dim">
                {TRIAL_DAYS}-day trial on every plan. No card to start.
              </p>
            </div>

            {item.clip ? (
              <div className="panel-brand overflow-hidden p-3 sm:p-4 lg:justify-self-end">
                <div className="overflow-hidden rounded-card">
                  <VideoFrame name={item.clip} ratio={item.ratio} label={`${item.name} scheduling posts`} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      <Section tight className="pt-0 sm:pt-0">
        <div className="shell">
          <h2 className="font-display text-heading-sm text-white sm:text-heading-md">
            How it connects
          </h2>

          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {item.steps.map((step, index) => (
              <li key={step.title} className="card flex flex-col gap-3 p-6">
                <span className="font-display text-[28px] font-extrabold leading-none text-accent">
                  {index + 1}
                </span>
                <span className="text-body-sm font-semibold text-white">{step.title}</span>
                <p className="text-body-xs leading-[1.7] text-dim">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tight className="pt-0 sm:pt-0">
        <div className="shell">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-separator pt-10">
            <h2 className="font-display text-heading-sm text-white">Also works with</h2>
            <Link
              href="/developers"
              className="text-body-xs text-muted underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              API, MCP, CLI and webhooks
            </Link>
          </div>

          <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {siblings.map((sibling) => (
              <li key={sibling.slug}>
                <Link
                  href={`/integrations/${sibling.slug}`}
                  className="card flex h-full items-center gap-3 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hairline-strong"
                >
                  <Mark item={sibling} size={34} />
                  <span className="min-w-0 truncate text-body-sm font-medium text-white">
                    {sibling.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBandSlim title={`Let ${item.name} fill the calendar, and keep the final say`} />
    </>
  );
}
