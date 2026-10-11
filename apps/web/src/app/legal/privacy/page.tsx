import type { Metadata } from 'next';
import { siteUrl } from '@scheduler/brand';
import { privacy } from '@/content/legal';
import { PageHeader } from '@/components/layout/page-header';
import { LegalDoc } from '@/components/legal/legal-doc';

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
  alternates: { canonical: siteUrl('/legal/privacy') },
  // NOTE: several social platforms require a publicly reachable privacy policy
  // URL during app review. Keep this page live and reachable; flip `index` to
  // true once a lawyer has signed the content off. `noindex` does not stop a
  // reviewer opening the URL, so it does not put app review at risk.
  robots: { index: false, follow: true },
};

/**
 * Section 5 — social account tokens, scopes and platform data — is the section an
 * app reviewer reads. It lives in src/content/legal.ts; this file owns the page's
 * `<h1>` and its metadata.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={privacy.title} />
      <LegalDoc doc={privacy} />
    </>
  );
}
