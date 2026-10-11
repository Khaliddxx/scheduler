/**
 * Copy for /about.
 *
 * The position this page takes is deliberate and should not be softened: we say
 * plainly that the scheduling engine is someone else's open-source project and
 * that what we sell is running it properly. The licence obliges us to offer the
 * source anyway (see docs/06-agpl-compliance.md), a prospect can find the repo in
 * thirty seconds, and "managed deployment of an open-source engine" is a category
 * buyers already understand and pay for. Hiding it would buy nothing and cost the
 * only thing this page is for.
 */
import { brand } from '@scheduler/brand';
import { channelCount, integrationCount } from '@/content/channels';
import { TRIAL_DAYS } from '@/content/pricing';

export const ABOUT = {
  eyebrow: 'About',
  title: 'We did not write the scheduler. We run it properly.',
  body: `${brand.name} is a managed deployment of ${brand.upstream.project}, an open-source publishing engine licensed ${brand.upstream.licence}. We host it, keep it current, back it up, hold the platform app registrations it needs to publish, and answer when something breaks. You get a calendar that works on Monday morning. We get the pager.`,
  description: `${brand.name} is a managed, supported deployment of the open-source ${brand.upstream.project} engine — hosting, upgrades, backups, platform app registration and support, run so you do not have to.`,
} as const;

export interface AboutSection {
  heading: string;
  paragraphs: string[];
}

export const STORY: AboutSection[] = [
  {
    heading: 'What this actually is',
    paragraphs: [
      `The software that stores your drafts, holds your channel connections and pushes a post to ${channelCount} networks at the right minute is ${brand.upstream.project}. It is open source, it is good, and its authors are not us. We deploy a pinned version of it, configure it, brand it, watch it, upgrade it, and wrap it in the operational work it needs to be a service rather than a repository.`,
      'So the honest framing is this: you are not buying software. You are buying the operation of software — the uptime, the backups, the upgrade path, the platform approvals, and a person to write to when a post does not go out. If that sounds like a thin thing to sell, it is worth knowing how much of it there is.',
    ],
  },
  {
    heading: 'Why that is worth paying for',
    paragraphs: [
      'Self-hosting this engine means running a Postgres database, a Redis instance, a queue worker and a web app, then keeping them patched, monitored and backed up — with restores actually tested, because an untested backup is a rumour. That is the easy half.',
      `The hard half is that you cannot publish to a social platform without a registered developer application, and for most of the networks here that application has to pass review before it will post on a user's behalf. Reviews take weeks, ask for screencasts and policy pages, and are refused for reasons that are not always explained. We have done that work, and ${integrationCount} connectable account types sit behind it.`,
      'Platforms also break things. An endpoint is deprecated, a scope is renamed, a token lifetime is halved, a review is reopened. Someone has to notice and fix it before your Tuesday post silently fails. On the shared plans, that someone is us, for everyone at once.',
    ],
  },
  {
    heading: 'What we are not',
    paragraphs: [
      `We are not affiliated with the ${brand.upstream.project} project, its maintainers or its company, and nothing here is endorsed by them. We are a separate operator running their software under the licence it is published with, with our modifications published in turn.`,
      'We are also not the cheapest way to do this, and we are not pretending that we built every line underneath. If the work above is work you would rather do yourself, our open source page tells you exactly how, with the repository, the pinned version and an honest list of what you would be taking on.',
    ],
  },
  {
    heading: 'How we intend to behave',
    paragraphs: [
      `No invented numbers on this site. No fabricated testimonials. No competitor named in a comparison we cannot substantiate. A ${TRIAL_DAYS}-day trial instead of a demo call, and an export you can take with you instead of a lock-in you discover on the way out.`,
      'If something on this site turns out to be wrong, we would rather hear it and fix it than defend it.',
    ],
  },
];

export interface Duty {
  title: string;
  body: string;
}

/** The "what we actually do for you" list. Five concrete operational duties. */
export const DUTIES: {
  eyebrow: string;
  title: string;
  body: string;
  items: Duty[];
} = {
  eyebrow: 'The job',
  title: 'What we actually do for you',
  body: 'Not features — these are the things that stop being your problem the moment you have an account.',
  items: [
    {
      title: 'Hosting and monitoring',
      body: 'The application, its database, its Redis instance and its queue worker, provisioned, monitored and sized for your plan. Nothing for you to install, scale or patch.',
    },
    {
      title: 'Upgrades and platform drift',
      body: `We track the upstream project, test a new version before moving to it, and keep the pinned build (currently ${brand.upstream.pinnedTag}) moving forward. When a network changes an API, the fix lands for everyone without you reading a changelog.`,
    },
    {
      title: 'Backups and recovery',
      body: 'Nightly encrypted backups of the database and your media, with restores exercised rather than assumed, so a bad week is recoverable and not a rebuild.',
    },
    {
      title: 'Platform app registration and review',
      body: 'We hold and maintain the developer applications each network requires, including the review submissions, policy pages and renewals. On a dedicated instance we do the same work against your own credentials.',
    },
    {
      title: 'Support from the people who run it',
      body: `Email support from whoever is on the pager, not a tier-one script. When a publish fails, you get the platform's actual error and what to do about it. Write to ${brand.supportEmail}.`,
    },
  ],
};

export const FACTS_TITLE = 'Under the hood';

/** The three-line summary strip under the duties. Facts, not metrics. */
export const FACTS: Array<{ label: string; value: string }> = [
  { value: brand.upstream.project, label: 'the engine underneath' },
  { value: brand.upstream.licence, label: 'the licence it carries' },
  { value: brand.upstream.pinnedTag, label: 'the version we run' },
];
