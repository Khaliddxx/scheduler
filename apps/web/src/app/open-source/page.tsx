import type { Metadata } from 'next';
import { siteUrl } from '@scheduler/brand';
import { OSS, FACTS, SECTIONS } from '@/content/open-source';
import { CompanyHero } from '@/components/pages/company/hero';
import {
  CARD,
  CARD_BODY,
  CARD_LINK,
  CARD_TITLE,
  CardEmoji,
  CompanyPage,
  SECTION,
} from '@/components/pages/company/primitives';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Open source and licence',
  description: OSS.description,
  alternates: { canonical: siteUrl('/open-source') },
};

/** Decorative card icons, in FACTS order. */
const ICONS = ['🧩', '📜', '📌', '📂'];

const TEXT = 'text-[18px] leading-[26px] text-[#d1d1d1]';

/**
 * This page is a compliance artifact as much as a marketing one. The footer
 * links here, and the licence expects the source offer to be reachable rather
 * than produced on request — so the facts and the source link must stay.
 *
 * The reference has no licence page, so this one is built from its about and
 * contact pages: the same centred opener, the contact page's card grid for the
 * four facts (the value is the card's pink link), and the about page's
 * centred-heading text sections for the body.
 */
export default function OpenSourcePage() {
  return (
    <CompanyPage>
      <CompanyHero title={OSS.title} body={OSS.body} bodyClassName="max-w-[760px]" />

      <section className={SECTION}>
        <ul className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 md:grid-cols-2">
          {FACTS.map((f, i) => (
            <li key={f.term} className={cn(CARD, 'flex flex-col gap-3 p-6 sm:p-8')}>
              <CardEmoji>{ICONS[i] ?? '📎'}</CardEmoji>
              <h2 className={cn(CARD_TITLE, 'text-center')}>{f.term}</h2>
              {f.note ? <p className={cn(CARD_BODY, 'flex-1')}>{f.note}</p> : null}
              <p className="[overflow-wrap:anywhere]">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noopener noreferrer" className={CARD_LINK}>
                    {f.value}
                  </a>
                ) : (
                  <span className="font-[600] text-white">{f.value}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.heading} id={s.id} className={cn(SECTION, 'scroll-mt-24')}>
          <div className="mx-auto w-full max-w-[820px] space-y-6">
            <h2 className="h2-pz">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className={TEXT}>
                {p}
              </p>
            ))}
            {s.list ? (
              <>
                {s.list.intro ? <p className={TEXT}>{s.list.intro}</p> : null}
                <ul className={cn(TEXT, 'list-disc space-y-3 pl-6 marker:text-pink')}>
                  {s.list.items.map((item) => (
                    <li key={item.slice(0, 40)} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </section>
      ))}
    </CompanyPage>
  );
}
