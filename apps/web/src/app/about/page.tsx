import type { Metadata } from 'next';
import { brand, siteUrl } from '@scheduler/brand';
import { CompanyHero } from '@/components/pages/company/hero';
import {
  CARD,
  CARD_BODY,
  CARD_TITLE,
  CardEmoji,
  CompanyPage,
  LEAD,
  LinkChips,
  SECTION,
} from '@/components/pages/company/primitives';
import { cn } from '@/lib/cn';
import { ABOUT, DUTIES, FACTS, FACTS_TITLE, STORY } from '@/content/about';

/**
 * /about
 *
 * A Server Component with no client code on the route.
 *
 * Laid out like the reference's about page: centred opener, a strip of four
 * fact tiles, a card grid ("what we actually do"), then the narrative as plain
 * centred-heading text sections, and a row of link chips. The reference's
 * "company behind" block (legal entities and registered addresses) has no
 * equivalent in our content, so it is left out rather than invented.
 *
 * The page's whole argument is that being a managed deployment of an
 * open-source engine is a selling point rather than something to bury, so the
 * duties sit above the narrative. Copy lives in src/content/about.ts.
 */

export const metadata: Metadata = {
  title: ABOUT.eyebrow,
  description: ABOUT.description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `${ABOUT.title} — ${brand.name}`,
    description: ABOUT.description,
    url: siteUrl('/about'),
    type: 'website',
  },
};

/** Decorative card icons, one per duty, in DUTIES order. */
const DUTY_ICONS = ['🖥️', '🔄', '💾', '📝', '🛟'];

const EXPLORE = [
  { label: 'See what that costs', href: '/pricing' },
  { label: 'Read the licence page', href: '/open-source' },
  { label: 'For agencies', href: '/agencies' },
  { label: 'How we compare', href: '/compare' },
  { label: 'Developers', href: '/developers' },
  { label: 'Contact', href: '/contact' },
];

export default function AboutPage() {
  return (
    <CompanyPage>
      <CompanyHero title={ABOUT.title} body={ABOUT.body} bodyClassName="max-w-[760px]" />

      {/* Fact tiles. */}
      <section className={cn(SECTION, 'py-[40px] sm:py-[60px]')} aria-labelledby="about-facts">
        <h2 id="about-facts" className="sr-only">
          {FACTS_TITLE}
        </h2>
        <dl className="mx-auto grid w-full max-w-[1000px] grid-cols-2 gap-4 lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className={cn(CARD, 'flex flex-col-reverse justify-end p-6 text-center')}>
              <dt className="mt-2 text-[14px] text-[#d1d1d1] sm:text-[16px]">{fact.label}</dt>
              <dd className="font-jakarta text-[22px] font-[700] leading-tight [overflow-wrap:anywhere] sm:text-[28px]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What we actually do. */}
      <section className={cn(SECTION, 'space-y-[40px] sm:space-y-[60px]')}>
        <div className="space-y-3 text-center">
          <h2 className="h2-pz">{DUTIES.title}</h2>
          <p className={cn(LEAD, 'mx-auto max-w-[700px]')}>{DUTIES.body}</p>
        </div>
        {/* Five cards: a centred flex wrap so the last row sits in the middle,
            with each card the width of a cell in the reference's 3-column grid. */}
        <ul className="mx-auto flex w-full max-w-[1100px] flex-wrap justify-center gap-6">
          {DUTIES.items.map((duty, i) => (
            <li
              key={duty.title}
              className={cn(
                CARD,
                'w-full space-y-3 p-6 sm:p-8 md:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]',
              )}
            >
              <CardEmoji>{DUTY_ICONS[i] ?? '✳️'}</CardEmoji>
              <h3 className={CARD_TITLE}>{duty.title}</h3>
              <p className={CARD_BODY}>{duty.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* The narrative, one text section per heading. */}
      {STORY.map((section) => (
        <section key={section.heading} className={SECTION}>
          <div className="mx-auto w-full max-w-[820px] space-y-6">
            <h2 className="h2-pz">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-[18px] leading-[26px] text-[#d1d1d1]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      <LinkChips title="Where to next" links={EXPLORE} />
    </CompanyPage>
  );
}
