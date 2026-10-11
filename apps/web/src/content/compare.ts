/**
 * Copy for /compare.
 *
 * DELIBERATELY NO COMPETITORS BY NAME. This page compares against three
 * *categories* of alternative, not against named products, for three reasons:
 *
 *  1. A specific claim about a named competitor is an advertising claim. In the
 *     US, UK and EU it has to be substantiated, and "their pricing page said so
 *     in 2026" is not substantiation anyone wants to produce later.
 *  2. It ages badly. Competitors ship. A comparison table naming them is wrong
 *     within a quarter and reads as sour from then on.
 *  3. Categories are more useful to the reader. Nobody is choosing between us and
 *     one product; they are choosing between classes of answer.
 *
 * The other rule here: every alternative gets a section saying where it genuinely
 * wins, including the option of not buying anything from us. A comparison where we
 * win every row persuades nobody and insults the reader.
 */
import { brand } from '@scheduler/brand';
import { channelCount } from '@/content/channels';
import { plans } from '@/content/pricing';

const entry = plans.find((p) => p.monthly > 0) ?? plans[0];

export const COMPARE = {
  eyebrow: 'Compare',
  title: 'How this compares to the other ways of solving it',
  body: `Three honest alternatives: an incumbent enterprise suite, a lightweight creator tool, or running an open-source scheduler yourself. Each is the right answer for somebody. This page says where, including where that somebody is you.`,
  description: `An honest comparison of ${brand.name} against big incumbent suites, lightweight creator tools, and self-hosting an open-source scheduler — including where each alternative is the better choice.`,
} as const;

export type ColumnId = 'us' | 'suite' | 'light' | 'self';

export const columns: Array<{ id: ColumnId; name: string; note: string; emphasis?: boolean }> = [
  {
    id: 'us',
    name: brand.name,
    note: 'Managed open-source engine',
    emphasis: true,
  },
  { id: 'suite', name: 'Big incumbent suites', note: 'Enterprise social platforms' },
  { id: 'light', name: 'Lightweight creator tools', note: 'Single-purpose schedulers' },
  { id: 'self', name: 'Running it yourself', note: 'Self-hosted open source' },
];

/**
 * How a cell reads. `strong` is a tick-level answer, `mixed` is "yes, with a
 * condition", `weak` is a real limitation. Nothing is rendered as a cross: every
 * column here is a legitimate choice for some reader.
 */
export type Verdict = 'strong' | 'mixed' | 'weak';

/**
 * What each verdict means, read out to assistive technology in place of the
 * coloured dot. The dot is decoration; this is the content.
 */
export const VERDICT_LABELS: Record<Verdict, string> = {
  strong: 'Strength',
  mixed: 'Depends',
  weak: 'Limitation',
};

export interface CompareRow {
  dimension: string;
  hint?: string;
  cells: Record<ColumnId, { verdict: Verdict; text: string }>;
}

export const rows: CompareRow[] = [
  {
    dimension: 'What you are buying',
    cells: {
      us: { verdict: 'strong', text: 'The operation of an open-source engine: hosting, upgrades, backups, platform approvals, support' },
      suite: { verdict: 'strong', text: 'A large proprietary product plus the organisation around it' },
      light: { verdict: 'strong', text: 'One well-made feature, usually scheduling for a few networks' },
      self: { verdict: 'mixed', text: 'Nothing. You own the running of it, and the licence is free' },
    },
  },
  {
    dimension: 'Entry price',
    hint: 'List price for a small team, before negotiation.',
    cells: {
      us: { verdict: 'strong', text: `From ${entry.currency} ${entry.monthly} a month, published, no call required` },
      suite: { verdict: 'weak', text: 'Typically a multiple of that, often annual and quoted after a demo' },
      light: { verdict: 'strong', text: 'Usually the cheapest option, sometimes free at low volume' },
      self: { verdict: 'mixed', text: 'Infrastructure cost only — plus your time, which is the real bill' },
    },
  },
  {
    dimension: 'Time to first published post',
    cells: {
      us: { verdict: 'strong', text: 'Minutes. The platform apps are already registered and approved' },
      suite: { verdict: 'mixed', text: 'Fast once you are through procurement and onboarding' },
      light: { verdict: 'strong', text: 'Minutes, for the networks it supports' },
      self: { verdict: 'weak', text: 'Weeks. Every platform needs its own developer app reviewed before it will post for you' },
    },
  },
  {
    dimension: 'Network coverage',
    cells: {
      us: { verdict: 'strong', text: `${channelCount} networks, including blogging and community destinations` },
      suite: { verdict: 'strong', text: 'Broad on the major networks, thinner on the newer and smaller ones' },
      light: { verdict: 'weak', text: 'Often a handful, chosen around one audience' },
      self: { verdict: 'mixed', text: 'The same engine supports them all — once you are approved on each' },
    },
  },
  {
    dimension: 'Teams, roles and approvals',
    cells: {
      us: { verdict: 'strong', text: 'Unlimited members, roles and an approval gate from the second tier up' },
      suite: { verdict: 'strong', text: 'Deep workflow, governance and compliance tooling — the thing they are best at' },
      light: { verdict: 'weak', text: 'Usually single-user, or seats priced per person' },
      self: { verdict: 'mixed', text: 'Present in the engine; configuring and supporting it is on you' },
    },
  },
  {
    dimension: 'Many client accounts',
    cells: {
      us: { verdict: 'strong', text: 'Separate client workspaces, per-client reporting and white-labelled exports' },
      suite: { verdict: 'strong', text: 'Strong multi-brand support, usually priced accordingly' },
      light: { verdict: 'weak', text: 'Rarely designed for it; agencies end up with one account per client' },
      self: { verdict: 'mixed', text: 'Possible, but you are now the hosting provider for your clients’ tokens' },
    },
  },
  {
    dimension: 'API, webhooks and agent access',
    cells: {
      us: { verdict: 'strong', text: 'REST API, webhooks, MCP server and CLI on every plan' },
      suite: { verdict: 'mixed', text: 'Capable APIs, often gated behind the top tier or a partner agreement' },
      light: { verdict: 'weak', text: 'Limited or absent; automation usually means a third-party connector' },
      self: { verdict: 'strong', text: 'Complete access — it is your instance' },
    },
  },
  {
    dimension: 'Who handles platform drift',
    hint: 'Deprecated endpoints, renamed scopes, reopened app reviews.',
    cells: {
      us: { verdict: 'strong', text: 'We do, once, for every customer at the same time' },
      suite: { verdict: 'strong', text: 'They do, with the leverage of a formal platform partnership' },
      light: { verdict: 'mixed', text: 'They do, for the networks they chose to support' },
      self: { verdict: 'weak', text: 'You do, on the evening it breaks' },
    },
  },
  {
    dimension: 'Data control and exit',
    cells: {
      us: { verdict: 'strong', text: 'Export on request, and the engine is open source — there is a documented path out' },
      suite: { verdict: 'weak', text: 'Export varies; the format and the workflow are usually theirs' },
      light: { verdict: 'mixed', text: 'Export is common, but there is nowhere equivalent to migrate to' },
      self: { verdict: 'strong', text: 'Total. It is your database' },
    },
  },
  {
    dimension: 'Isolation and data residency',
    cells: {
      us: { verdict: 'mixed', text: 'Shared tenancy by default; a dedicated instance in a region of your choice is a plan' },
      suite: { verdict: 'strong', text: 'Regional hosting and compliance paperwork are table stakes for them' },
      light: { verdict: 'weak', text: 'Shared, with little choice offered' },
      self: { verdict: 'strong', text: 'Wherever you put it' },
    },
  },
  {
    dimension: 'Who you reach for support',
    cells: {
      us: { verdict: 'strong', text: 'Email to the people who operate the deployment' },
      suite: { verdict: 'mixed', text: 'A support organisation; a named contact usually costs extra' },
      light: { verdict: 'mixed', text: 'Email or chat, often one person doing their best' },
      self: { verdict: 'weak', text: 'A community issue tracker, and yourself' },
    },
  },
  {
    dimension: 'Ongoing effort from you',
    cells: {
      us: { verdict: 'strong', text: 'None operationally. Write the posts' },
      suite: { verdict: 'mixed', text: 'Low operationally, higher administratively — seats, renewals, governance' },
      light: { verdict: 'strong', text: 'None, within its limits' },
      self: { verdict: 'weak', text: 'Permanent: upgrades, backups, restores, approvals, being on call' },
    },
  },
];

export interface Honest {
  columnId: ColumnId;
  title: string;
  body: string;
  /** Who should pick this one. */
  bullets: string[];
}

export const CHOOSE_INSTEAD = {
  eyebrow: 'Being fair about it',
  title: 'When one of the others is the better choice',
  body: 'This is not a page where we win every row. Three situations where we would tell you to buy something else.',
  items: [
    {
      columnId: 'suite',
      title: 'Choose a big incumbent suite when governance is the product',
      body: 'If you are a regulated enterprise, a listed company or a public body, the thing you are buying is not a calendar. It is audit trails that satisfy your compliance team, a signed DPA with a legal department behind it, SSO and SCIM provisioning, a security questionnaire someone will actually complete, regional hosting commitments and a contract with an SLA and a named account manager.',
      bullets: [
        'Procurement requires an SLA, SOC 2 or ISO 27001 evidence, and a vendor security review.',
        'You need SSO, SCIM and enterprise-grade role governance across hundreds of users.',
        'Social listening, paid campaign management and a unified inbox matter as much as publishing.',
        'A formal platform partnership, with the escalation path it brings, is worth the premium.',
      ],
    },
    {
      columnId: 'light',
      title: 'Choose a lightweight creator tool when you have one account and one network',
      body: 'If you post to a single platform from a single account, a focused tool built around that platform will beat a general scheduler. It will know that platform’s quirks better, it will cost less, and you will not be paying for workspaces, approvals and an API you never open.',
      bullets: [
        'You publish to one or two networks and no one else touches the account.',
        'You want a thread composer or an analytics view designed specifically for that platform.',
        'Nobody needs to approve anything before it goes out.',
        'Price is the deciding factor and your volume is low.',
      ],
    },
    {
      columnId: 'self',
      title: 'Self-host when you have the skills and the appetite',
      body: `The engine under this service is open source, and we publish the source and the pinned version we run. If you already operate infrastructure, publish to a small number of networks, and would rather own the stack than rent its operation, self-hosting is a legitimate and cheaper answer — and we would rather say so here than have you work it out afterwards.`,
      bullets: [
        'You are comfortable running Postgres, Redis and a queue worker, with tested backups.',
        'You publish to a few networks, so the app-review burden is bounded.',
        'Data residency or isolation requirements rule out shared tenancy, and a dedicated plan is not worth it to you.',
        'You want to modify the engine itself rather than ask someone to.',
      ],
    },
  ] satisfies Honest[],
};

export const OUR_CASE = {
  eyebrow: 'And when we are the right answer',
  title: 'Pick us when you want the capability without the operations',
  bullets: [
    `You publish to several networks — more than a focused tool covers, fewer than an enterprise suite's price makes sense for.`,
    'You want publishing to start today, not after a platform review queue clears.',
    'More than one person touches the content, and somebody needs to approve it.',
    'You want an API, webhooks and agent access without it being an enterprise line item.',
    'You would like the exit to be real: an export, and an open-source engine you could run yourself.',
  ],
} as const;
