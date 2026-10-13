import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { ContactForm } from '@/components/contact/contact-form';
import { CompanyHero } from '@/components/pages/company/hero';
import {
  CARD,
  CARD_BODY,
  CARD_LINK,
  CARD_TITLE,
  CardEmoji,
  CompanyPage,
  PillLink,
  SECTION,
} from '@/components/pages/company/primitives';
import { cn } from '@/lib/cn';
import { CHANNELS_OF_CONTACT, CONTACT, EXPECTATIONS } from '@/content/contact';

/**
 * /contact
 *
 * The page is a Server Component; only `ContactForm` is client code, because only
 * the form needs state. It posts to `/api/contact`, which another workstream owns.
 *
 * Laid out like the reference's contact page: centred opener, then a two-column
 * grid of dark cards (emoji, centred heading, grey body, pink link). The
 * reference has no form; ours sits straight under the opener, in the same card
 * and field treatment the reference uses elsewhere, because writing to us is
 * what most people come here for. The reference's "company details" block
 * (legal entities, registered addresses) has no equivalent in our content and
 * is left out.
 *
 * No closing CTA band here on purpose: the page already is the call to action.
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

/** Decorative card icons, in CHANNELS_OF_CONTACT order. */
const ICONS = ['✉️', '🛠️', '🧭'];

export default function ContactPage() {
  return (
    <CompanyPage>
      <CompanyHero title={CONTACT.title} body={CONTACT.body} />

      <section className={SECTION}>
        <ContactForm />
      </section>

      <section className={cn(SECTION, '!pt-0 sm:!pt-0')}>
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 md:grid-cols-2">
          {CHANNELS_OF_CONTACT.map((item, i) => (
            <div key={item.title} className={cn(CARD, 'flex flex-col gap-3 p-6 sm:p-8')}>
              <CardEmoji>{ICONS[i] ?? '💬'}</CardEmoji>
              <h2 className={cn(CARD_TITLE, 'text-center')}>{item.title}</h2>
              <p className={cn(CARD_BODY, 'flex-1')}>{item.body}</p>
              {item.action ? (
                <PillLink href={item.action.href} className={cn(CARD_LINK, 'break-words')}>
                  {item.action.label}
                </PillLink>
              ) : null}
            </div>
          ))}

          <div className={cn(CARD, 'flex flex-col gap-3 p-6 sm:p-8')}>
            <CardEmoji>⏱️</CardEmoji>
            <h2 className={cn(CARD_TITLE, 'text-center')}>What to expect</h2>
            <ul className="flex-1 list-disc space-y-2 pl-5 marker:text-pink">
              {EXPECTATIONS.map((item) => (
                <li key={item.slice(0, 40)} className={CARD_BODY}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </CompanyPage>
  );
}
