import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, siteUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { ContactForm } from '@/components/contact/contact-form';
import { CHANNELS_OF_CONTACT, CONTACT, EXPECTATIONS } from '@/content/contact';

/**
 * /contact
 *
 * The page is a Server Component; only `ContactForm` is client code, because only
 * the form needs state. It posts to `/api/contact`, which another workstream owns.
 *
 * No closing CTA band here on purpose: the page already is the call to action, and
 * a second "start your trial" under a contact form competes with the thing the
 * reader came to do.
 */

export const metadata: Metadata = {
  title: CONTACT.eyebrow,
  description: CONTACT.description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `${CONTACT.title} — ${brand.name}`,
    description: CONTACT.description,
    url: siteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={CONTACT.eyebrow} title={CONTACT.title} body={CONTACT.body} />

      <Section tight>
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="flex min-w-0 flex-col gap-5">
            <ContactForm />

            <div className="card p-6 sm:p-7">
              <h2 className="text-eyebrow uppercase text-dim">What to expect</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {EXPECTATIONS.map((item) => (
                  <li key={item.slice(0, 40)} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-body-sm leading-[1.6] text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            {CHANNELS_OF_CONTACT.map((item) => (
              <div key={item.title} className="card flex flex-col gap-2.5 p-6">
                <h2 className="font-display text-body-lg font-bold leading-[1.3] text-white">
                  {item.title}
                </h2>
                <p className="text-body-sm leading-[1.6] text-muted">{item.body}</p>

                {item.action ? (
                  item.action.href.startsWith('/') ? (
                    <Link
                      href={item.action.href}
                      className="mt-1 text-body-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {item.action.label}
                    </Link>
                  ) : (
                    <a
                      href={item.action.href}
                      className="mt-1 break-words text-body-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {item.action.label}
                    </a>
                  )
                ) : null}
              </div>
            ))}
          </aside>
        </div>
      </Section>
    </>
  );
}
