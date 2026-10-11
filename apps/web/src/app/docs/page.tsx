import type { Metadata } from 'next';
import Link from 'next/link';
import { brand, siteUrl, registerUrl } from '@scheduler/brand';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { CtaBandSlim } from '@/components/sections/cta-band';
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

export default function DocsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documentation"
        title="Getting started"
        body={`Four steps to your first scheduled post. Deeper reference lives inside your workspace, where it can describe your actual plan and channels.`}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={registerUrl()} external withChevron>
            Open your workspace
          </Button>
          <Button href="/contact" variant="secondary">
            Ask us something
          </Button>
        </div>
      </PageHeader>

      <Section tight>
        <div className="shell grid gap-4 md:grid-cols-2">
          {START.map((s) => (
            <div key={s.step} className="card flex gap-5 p-7">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-display text-body-sm font-bold text-white"
              >
                {s.step}
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <h2 className="font-display text-body-xl font-bold text-white">{s.title}</h2>
                <p className="text-body-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="shell">
          <SectionHeading eyebrow="Reference" title="Where to look next" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="card flex flex-col gap-2 p-7 transition-shadow hover:shadow-hairline-strong"
              >
                <h3 className="font-display text-body-xl font-bold text-white">{t.title}</h3>
                <p className="text-body-sm leading-relaxed text-muted">{t.body}</p>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-body-sm text-dim">
            Looking for a specific network? Every one has its own page —{' '}
            {channels.slice(0, 4).map((c, i) => (
              <span key={c.slug}>
                {i > 0 ? ', ' : ''}
                <Link href={`/channels/${c.slug}`} className="underline underline-offset-4 hover:text-white">
                  {c.name}
                </Link>
              </span>
            ))}
            , and{' '}
            <Link href="/channels" className="underline underline-offset-4 hover:text-white">
              {channelCount - 4} more
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBandSlim />
    </>
  );
}
