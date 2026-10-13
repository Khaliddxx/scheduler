import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import {
  LEGAL_LINK,
  LEGAL_P,
  LegalShell,
  TemplateNotice,
} from '@/components/legal/legal-doc';
import { cn } from '@/lib/cn';

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
  'not enabled': 'text-[rgba(255,255,255,0.55)]',
};

/*
 * Table treatment of the reference's legal/content template: hairline frame
 * with 12px radius, faint header band, uppercase 14px column labels, white
 * semibold first column, row hover. Below 768px it scrolls inside itself, so
 * the page never scrolls sideways.
 */
const CELL =
  'px-3 py-[0.65rem] text-left align-top min-w-[150px] md:min-w-0 md:px-4 md:py-[0.8rem]';
const BODY_CELL = cn(CELL, 'border-t border-[rgba(255,255,255,0.1)]');

export default function SubProcessorsPage() {
  return (
    <LegalShell title="Sub-processors">
      <p className={LEGAL_P}>
        The third parties that process data on behalf of {brand.name}. We keep this current,
        including the things we have deliberately not switched on.
      </p>

      <TemplateNotice />

      <table className="my-8 block w-full overflow-x-auto rounded-[12px] border border-[rgba(255,255,255,0.1)] text-[15px] leading-[1.5] [-webkit-overflow-scrolling:touch] md:table md:border-separate md:border-spacing-0 md:overflow-hidden md:text-[16px]">
        <caption className="sr-only">
          Sub-processors, what each handles and where it operates
        </caption>
        <thead className="bg-[rgba(255,255,255,0.06)]">
          <tr>
            {['Processor', 'Purpose', 'Data handled', 'Location', 'Status'].map((h) => (
              <th
                key={h}
                scope="col"
                className={cn(CELL, 'text-[14px] font-[600] uppercase tracking-[0.01em] text-white')}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.name} className="[&>*]:transition-colors hover:[&>*]:bg-[rgba(255,255,255,0.04)]">
              <th scope="row" className={cn(BODY_CELL, 'font-[600] text-white')}>
                {r.name}
              </th>
              <td className={BODY_CELL}>{r.purpose}</td>
              <td className={BODY_CELL}>{r.data}</td>
              <td className={BODY_CELL}>{r.where}</td>
              <td className={cn(BODY_CELL, TONE[r.status])}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={LEGAL_P}>
        Questions about any of these, or a request for a data-processing agreement, go to{' '}
        <a href={`mailto:${brand.supportEmail}`} className={LEGAL_LINK}>
          {brand.supportEmail}
        </a>
        .
      </p>
    </LegalShell>
  );
}
