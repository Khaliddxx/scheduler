import type { Metadata } from 'next';
import { siteUrl } from '@scheduler/brand';
import { terms } from '@/content/legal';
import { LegalDoc } from '@/components/legal/legal-doc';

export const metadata: Metadata = {
  title: terms.title,
  description: terms.description,
  alternates: { canonical: siteUrl('/legal/terms') },
  // A template nobody has reviewed should not be indexed as if it were advice.
  // `follow` stays on, and the page stays publicly reachable, because platform
  // app reviewers need to be able to open it.
  robots: { index: false, follow: true },
};

/**
 * The document itself is data in src/content/legal.ts and is rendered by
 * LegalDoc, which also carries the "no lawyer has read this" notice and
 * substitutes the unset brand placeholders, inside the shared legal page shell
 * (title included). This file owns the route's metadata, nothing else.
 */
export default function TermsPage() {
  return <LegalDoc doc={terms} />;
}
