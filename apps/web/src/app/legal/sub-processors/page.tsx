import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { TemplateNotice } from '@/components/legal/legal-doc';

export const metadata: Metadata = {
  title: 'Sub-processors',
  description: `The third parties that process data on behalf of ${brand.name}, what each one handles, and why.`,
  alternates: { canonical: siteUrl('/legal/sub-processors') },
  robots: { index: false, follow: true },
};

/**
 * A sub-processor list is not optional dressing. Data-protection law in the UK
 * and EU requires a controller to disclose who processes personal data on its
 * behalf, and several social platforms ask to see this during app review.
 *
 * KEEP THIS LIST TRUE. Every row is something you must actually be using, and
 * anything you switch on later — an analytics tool, an email provider, an error
 * tracker — belongs here before it goes live, not after.
 */
const ROWS: Array<{
  name: string;
  purpose: string;
  data: string;
  where: string;
  status: 'in use' | 'planned' | 'not enabled';
}> = [
  {
    name: 'Railway',
    purpose: 'Application hosting, database and file storage',
    data: 'All service data: accounts, posts, media, connected-channel tokens',
    where: 'United States (us-west2)',
    status: 'in use',
  },
  {
    name: 'Commas',
    purpose: 'Payment processing and subscription billing',
    data: 'Name, email, billing details. Card data goes to the processor directly and is never seen by us.',
    where: 'Per processor terms',
    status: 'planned',
  },
  {
    name: 'Social platforms you connect',
    purpose: 'Publishing your content on your instruction',
    data: 'The posts and media you schedule, plus the OAuth token authorising us to publish',
    where: 'Per platform',
    status: 'in use',
  },
  {
    name: 'Email delivery provider',
    purpose: 'Transactional email: sign-in links, failure notices, billing receipts',
    data: 'Email address and message content',
    where: 'To be decided',
    status: 'planned',
  },
  {
    name: 'Product analytics and error tracking',
    purpose: 'Not enabled. The engine ships optional hooks for PostHog, Sentry and others; all are switched off.',
    data: 'None',
    where: '—',
    status: 'not enabled',
  },
];

const TONE: Record<string, string> = {
  'in use': 'text-ok',
  planned: 'text-warn',
  'not enabled': 'text-dim',
};

export default function SubProcessorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Sub-processors"
        body={`The third parties that process data on behalf of ${brand.name}. We keep this current, including the things we have deliberately not switched on.`}
      />

      <Section tight>
        <div className="shell flex flex-col gap-8">
          <TemplateNotice />

          <div className="card-lg overflow-hidden">
            <div className="scrollbar-slim overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <caption className="sr-only">
                  Sub-processors, what each handles and where it operates
                </caption>
                <thead>
                  <tr>
                    {['Processor', 'Purpose', 'Data handled', 'Location', 'Status'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="border-b border-line bg-bgInner px-5 py-4 text-eyebrow uppercase text-dim"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.name}>
                      <th
                        scope="row"
                        className="border-b border-line px-5 py-4 align-top text-body-sm font-medium text-white"
                      >
                        {r.name}
                      </th>
                      <td className="border-b border-line px-5 py-4 align-top text-body-sm text-muted">
                        {r.purpose}
                      </td>
                      <td className="border-b border-line px-5 py-4 align-top text-body-sm text-muted">
                        {r.data}
                      </td>
                      <td className="border-b border-line px-5 py-4 align-top text-body-sm text-muted">
                        {r.where}
                      </td>
                      <td
                        className={`border-b border-line px-5 py-4 align-top text-body-sm ${TONE[r.status]}`}
                      >
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="max-w-prose text-body-sm text-dim">
            Questions about any of these, or a request for a data-processing agreement,
            go to{' '}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="underline underline-offset-4 hover:text-white"
            >
              {brand.supportEmail}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
