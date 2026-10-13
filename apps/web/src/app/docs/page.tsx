import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, siteUrl, registerUrl } from '@scheduler/brand';
import { CompanyHero } from '@/components/pages/company/hero';
import {
  CARD,
  CARD_BODY,
  CARD_TITLE,
  CompanyPage,
  OUTLINE_PILL,
  PillLink,
  SECTION,
  WHITE_PILL_PLAIN,
} from '@/components/pages/company/primitives';
import { cn } from '@/lib/cn';
import { sellableChannels as channels, channelCount, noReviewChannels } from '@/content/channels';

export const metadata: Metadata = {
  title: 'Documentation',
  description: `Getting started with ${brand.name}: connecting channels, scheduling your first post, inviting your team, and driving everything from the API.`,
  alternates: { canonical: siteUrl('/docs') },
};

const START = [
  {
    step: '1',
    title: 'Connect a channel',
    body: `Open your workspace and pick a network. You will be sent to that platform to authorise ${brand.name}, then returned with the account connected. Start with one of the ${noReviewChannels.length} networks that need no platform review — they connect immediately.`,
  },
  {
    step: '2',
    title: 'Write a post once',
    body: 'Write it in the composer, select every channel it should go to, and adjust the wording per network where it matters. The preview shows how each one will render before anything is scheduled.',
  },
  {
    step: '3',
    title: 'Put it on the calendar',
    body: 'Pick a time, or drop it into the queue and let it take the next free slot. The calendar shows the whole week or month, and a post can be dragged to a new time.',
  },
  {
    step: '4',
    title: 'Invite whoever approves it',
    body: 'On team plans, invite your colleagues and set who can publish. Drafts route to an approver and nothing goes out until they say so.',
  },
];

const TOPICS = [
  { title: 'Channels', body: `What each of the ${channelCount} networks supports and how to connect it.`, href: '/channels' },
  { title: 'API, webhooks and CLI', body: 'Driving the calendar from your own code or an AI agent.', href: '/developers' },
  { title: 'Plans and limits', body: 'What counts as a channel, and what each plan includes.', href: '/pricing' },
  { title: 'Licence and source', body: 'The open-source engine underneath, and your rights over it.', href: '/open-source' },
];

/**
 * The reference has no docs landing page, so this one uses the shell of its
 * enterprise and contact pages: centred opener with a button pair, the contact
 * page's card grid for the four steps (a numbered chip in place of the emoji),
 * and the comparison index's link cards for "where to look next".
 */
export default function DocsPage() {
  return (
    <CompanyPage>
      <CompanyHero
        title="Getting started"
        body="Four steps to your first scheduled post. Deeper reference lives inside your workspace, where it can describe your actual plan and channels."
      >
        <PillLink href={registerUrl()} className={cn(WHITE_PILL_PLAIN, '!w-full sm:!w-fit')}>
          Open your workspace
        </PillLink>
        <PillLink href="/contact" className={cn(OUTLINE_PILL, '!w-full sm:!w-fit')}>
          Ask us something
        </PillLink>
      </CompanyHero>

      <section className={SECTION}>
        <ol className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-6 md:grid-cols-2">
          {START.map((s) => (
            <li key={s.step} className={cn(CARD, 'flex flex-col gap-3 p-6 sm:p-8')}>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#682EE1] to-[#2A0772] font-jakarta text-[22px] font-bold sm:h-14 sm:w-14 sm:text-[26px]"
              >
                {s.step}
              </span>
              <h2 className={cn(CARD_TITLE, 'text-center')}>
                <span className="sr-only">Step {s.step}: </span>
                {s.title}
              </h2>
              <p className={CARD_BODY}>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={cn(SECTION, 'space-y-[40px] sm:space-y-[60px]')}>
        <h2 className="h2-pz">Where to look next</h2>
        <ul className="grid w-full max-w-[1100px] grid-cols-1 gap-3 md:grid-cols-2">
          {TOPICS.map((t) => (
            <li key={t.href} className="flex">
              <Link
                href={t.href}
                className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-[#1A1919] p-5 transition-all hover:border-white/20 sm:rounded-[20px] sm:p-6"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[18px] font-bold leading-[23px] sm:text-[22px] sm:leading-[28px]">
                    {t.title}
                  </span>
                  <span className="text-[16px] leading-[22px] text-[#d1d1d1]">{t.body}</span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-[20px] text-[#a070e8]">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="max-w-[820px] text-center text-[18px] leading-[26px] text-[#d1d1d1]">
          Looking for a specific network? Every one has its own page —{' '}
          {channels.slice(0, 4).map((c, i) => (
            <span key={c.slug}>
              {i > 0 ? ', ' : ''}
              <Link href={`/channels/${c.slug}`} className="font-[600] text-pink hover:underline">
                {c.name}
              </Link>
            </span>
          ))}
          , and{' '}
          <Link href="/channels" className="font-[600] text-pink hover:underline">
            {channelCount - 4} more
          </Link>
          .
        </p>
      </section>
    </CompanyPage>
  );
}
