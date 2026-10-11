/**
 * Copy for /open-source.
 *
 * This page is a compliance artifact first and a marketing page second.
 *
 * The engine is AGPL-3.0. Section 13 obliges an operator who modifies the
 * software and offers it over a network to give its users the Corresponding
 * Source of the modified version. The footer carries a permanent link here, and
 * this page carries the repository, the pinned version and the offer. That is what
 * discharges the obligation — see docs/06-agpl-compliance.md.
 *
 * Tone rule: unembarrassed. No hedging, no "powered by" in six-point grey. A page
 * that reads as a confession invites the reader to treat it as one.
 *
 * Do not delete the non-affiliation section. Running someone's AGPL project does
 * not entitle us to imply their endorsement, and a trademark complaint is a much
 * worse week than a paragraph of plain English.
 */
import { brand } from '@scheduler/brand';
import { channelCount } from '@/content/channels';

export const OSS = {
  eyebrow: 'Open source',
  title: 'The engine is open source, and we would rather you knew',
  body: `${brand.name} is a managed deployment of ${brand.upstream.project}, licensed under ${brand.upstream.licence}. The licence gives you rights over that software — including the right to run it yourself — and this page sets out those rights, the source we build from, and what self-hosting would actually involve.`,
  description: `${brand.name} runs ${brand.upstream.project}, licensed ${brand.upstream.licence}. The source we deploy, your rights under the licence, how to self-host it yourself, and our non-affiliation statement.`,
} as const;

/** The three facts a licence page has to state, rendered as a definition list. */
export const FACTS: Array<{ term: string; value: string; href?: string; note?: string }> = [
  {
    term: 'Upstream project',
    value: brand.upstream.project,
    href: brand.upstream.repo,
    note: 'The scheduling engine this service runs, written and maintained by its own authors.',
  },
  {
    term: 'Licence',
    value: brand.upstream.licence,
    href: 'https://www.gnu.org/licenses/agpl-3.0.en.html',
    note: 'A strong copyleft licence. Its section 13 covers software offered over a network, which is exactly this.',
  },
  {
    term: 'Version we deploy',
    value: brand.upstream.pinnedTag,
    note: 'A pinned tag, not a moving branch, so what you are using is a known build we have tested.',
  },
  {
    term: 'Our source',
    value: brand.upstream.sourceOfferUrl.replace(/^https?:\/\//, ''),
    href: brand.upstream.sourceOfferUrl,
    note: 'Our deployment configuration and any modifications to the engine, published as the licence requires.',
  },
];

export interface OssSection {
  id?: string;
  heading: string;
  paragraphs?: string[];
  list?: { intro?: string; items: string[] };
}

export const RIGHTS: OssSection = {
  heading: 'What the licence gives you',
  paragraphs: [
    `${brand.upstream.licence} is a copyleft licence written for exactly this situation: software run as a network service. Because you interact with a modified version of ${brand.upstream.project} over a network when you use ${brand.name}, section 13 of that licence entitles you to the Corresponding Source of the version we run.`,
    'We do not make you ask. The repository above is public, the version we deploy is pinned and labelled, and the link sits permanently in the footer of every page on this site rather than being produced on request.',
  ],
  list: {
    intro: 'Concretely, you may:',
    items: [
      'Read the source of the engine we run, and of our modifications and deployment configuration.',
      'Copy it, modify it and run your own instance, for yourself or for others.',
      'Redistribute it, including modified versions, under the same licence and with the same source obligation.',
      'Do all of that without asking us, paying us, or telling us.',
    ],
  },
};

export const MODIFICATIONS: OssSection = {
  heading: 'What we changed',
  paragraphs: [
    'Our changes are operational rather than clever: branding and palette applied from a single configuration file, provisioning and plan-limit enforcement around the application, our platform application credentials, and the deployment manifests, backup schedule and monitoring that turn a repository into a service.',
    'Those changes are in the repository linked above, against the pinned upstream tag, so a reader can see precisely what sits between the upstream project and what you log into.',
  ],
};

export const SELF_HOST: OssSection = {
  id: 'self-host',
  heading: 'Running it yourself',
  paragraphs: [
    'You are entitled to, and for some people it is the right answer. If you are technical, run infrastructure already, and publish to one or two networks, self-hosting may cost you less than a subscription and leave you in complete control. We would rather tell you that than have you discover it later and feel sold to.',
    'What follows is an honest list of what you would be taking on. None of it is hard in isolation; the cost is that it is permanent.',
  ],
  list: {
    intro: 'Self-hosting means you own:',
    items: [
      'The stack. A Postgres database, a Redis instance, a queue worker and the web application, deployed somewhere and kept running.',
      'Upgrades. Tracking upstream releases, reading migration notes, and taking the outage when a major version moves.',
      'Backups, and restores. An untested backup is a rumour. Testing one is a recurring chore, not a one-off task.',
      `Developer applications on every platform you want to publish to. Each one needs registering, and most need review before they will post on a user's behalf: screencasts, policy URLs, a reachable legal entity, and weeks of waiting. This is the part people underestimate, and it is most of what a subscription here buys.`,
      'Platform drift. Deprecated endpoints, renamed scopes, shortened token lifetimes, reopened reviews. Each one silently stops posts going out until someone notices.',
      'Secrets and tokens. You will be holding OAuth access tokens for real social accounts. That is a security responsibility with a blast radius.',
      'Compliance. Your own privacy policy and terms, your own lawful basis for processing, your own answers to data subject requests.',
      'Being on call. A queue worker that dies at 23:00 means a campaign that did not publish.',
    ],
  },
};

export const WHAT_YOU_PAY_FOR: OssSection = {
  heading: 'So what are we charging for?',
  paragraphs: [
    `Everything in the list above, done once and shared. The registrations and reviews for ${channelCount} networks, the upgrades tested before they reach you, the backups someone actually restores, the monitoring, and a human to write to when a post fails. Not the code — the code is free, and we say so on the pricing page too.`,
    'If that trade looks wrong for your situation, self-host. The link is above, the licence permits it, and nothing on this page is designed to talk you out of it.',
  ],
};

export const AFFILIATION: OssSection = {
  heading: 'Non-affiliation',
  paragraphs: [
    `${brand.name} is an independent service. We are not affiliated with, endorsed by, sponsored by or otherwise connected to the ${brand.upstream.project} project, its maintainers or any company behind it. We did not write the engine, and we do not speak for the people who did.`,
    `${brand.upstream.project} and any other product names, logos and trademarks on this site belong to their respective owners, and are used only to identify the software we run or the networks we publish to. Their use implies no partnership or endorsement. Support requests about ${brand.name} come to us, not to the upstream project — its maintainers are not responsible for this deployment.`,
  ],
};

/** The ordered page body after the facts panel. */
export const SECTIONS: OssSection[] = [
  RIGHTS,
  MODIFICATIONS,
  SELF_HOST,
  WHAT_YOU_PAY_FOR,
  AFFILIATION,
];
