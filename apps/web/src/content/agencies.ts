/**
 * Copy for /agencies.
 *
 * The channel arithmetic in CAPS is computed from the Agency plan in
 * src/content/pricing.ts, not typed. An agency reads a cap and immediately does
 * this sum in their head; getting it wrong on the page — or letting it drift when
 * the plan changes — is worse than not showing it.
 */
import { channelCount } from '@/content/channels';
import { plans } from '@/content/pricing';

const agencyPlan = plans.find((p) => p.id === 'agency') ?? plans[plans.length - 1];
const studioPlan = plans.find((p) => p.id === 'studio') ?? plans[0];

/** A typical client footprint: profile, page, Instagram, TikTok, YouTube. */
export const CHANNELS_PER_CLIENT = 5;

/** How many such clients the Agency plan's cap covers. */
export const CLIENTS_AT_CAP = Math.floor(agencyPlan.channels / CHANNELS_PER_CLIENT);

export const AGENCIES = {
  eyebrow: 'For agencies',
  title: 'Every client in one calendar, not one tab each',
  body: 'Every client in its own workspace with its own channels, approvals and reporting. Invite the client to review their own posts without giving them the keys to anyone else’s. One bill, one login, one place where the whole book of business is visible.',
  description: `Run many client accounts from one place: separate client workspaces, approval workflows, per-client and white-labelled reporting, and ${agencyPlan.channels} connected channels on the ${agencyPlan.name} plan.`,
} as const;

export interface AgencyCapability {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  /** Which shared visual sits beside this block. */
  visual: 'team' | 'calendar' | 'analytics' | 'plugs';
}

export const CAPABILITIES: AgencyCapability[] = [
  {
    id: 'workspaces',
    eyebrow: 'Client workspaces',
    title: 'One workspace per client, not one folder per client',
    body: 'A workspace is a real boundary: its own connected channels, its own calendar, its own team membership, its own analytics. Nothing leaks across it, which matters the first time two clients are competitors.',
    points: [
      'Switch clients from one menu, with no second login and no second subscription.',
      'Scope a team member to the clients they work on, so a freelancer sees one account and not forty.',
      'Invite the client themselves as a reviewer or a read-only viewer of their own workspace.',
      'Offboard cleanly: disconnect the channels, export the history, free the capacity for the next client.',
    ],
    visual: 'team',
  },
  {
    id: 'approvals',
    eyebrow: 'Approvals',
    title: 'Nothing goes out before the person who signs it off has seen it',
    body: 'Drafts route to an approver, who approves or sends back with a comment. The post keeps its schedule while it waits, so an approval at 08:50 still publishes at 09:00 — and an unapproved one does not quietly go out anyway.',
    points: [
      'Required approval per workspace, so a nervous client gets a gate and a trusting one does not.',
      'Comment threads on the draft itself rather than in an email chain nobody can find later.',
      'The same gate applies to anything an AI agent or automation drafts.',
      'A visible audit trail of who approved what, and when, for the conversation that follows a bad post.',
    ],
    visual: 'calendar',
  },
  {
    id: 'reporting',
    eyebrow: 'Reporting',
    title: 'Per-client numbers, and reports with your name on them',
    body: 'Per-post and per-channel performance for each client, exportable as a report you can send on. White-labelled on the Agency plan: your logo, your colours, your domain, no mention of us.',
    points: [
      'Per-client reporting that only ever draws on that client’s workspace.',
      'White-labelled exports, so the monthly report looks like something your studio made.',
      'A month-on-month view, because a single month of numbers tells a client almost nothing.',
      'Platform-reported figures shown as what they are, with the gaps a platform leaves visible rather than invented.',
    ],
    visual: 'analytics',
  },
  {
    id: 'volume',
    eyebrow: 'Volume',
    title: 'Built for the boring half of the work',
    body: 'Most agency hours go on the mechanical part: reformatting the same post for six networks, queueing a month of evergreen content, chasing the approval. That part is automatable, and this is the automation.',
    points: [
      'Bulk schedule from a spreadsheet, or import a content calendar a client already keeps.',
      'Cross-post once with per-network wording, instead of six near-identical drafts.',
      'Auto-repeat and evergreen recycling so a good post keeps earning after week one.',
      'A public API, CLI and MCP server, in case your studio would rather generate the queue than click it.',
    ],
    visual: 'plugs',
  },
];

export const CAPS = {
  eyebrow: 'Channel caps',
  title: 'Why the channel number is the number that matters',
  paragraphs: [
    `Every plan here is priced on connected channels, where one channel is one account on one network. For a single brand that distinction is academic. When you run many accounts it is the whole bill, because a typical client is not one channel — it is a LinkedIn company page, an X account, an Instagram professional account, a TikTok account and a YouTube channel. That is ${CHANNELS_PER_CLIENT} before anyone mentions a second region or the founder's personal profile.`,
    `So the arithmetic that matters is: ${agencyPlan.channels} channels on the ${agencyPlan.name} plan covers about ${CLIENTS_AT_CAP} clients of that shape. The ${studioPlan.name} plan's ${studioPlan.channels} channels covers three. A tool that advertises a low per-seat price and counts channels quietly will cost you more than one that puts the cap on the front page.`,
    'Only channels connected at a given moment count, so a finished engagement frees its capacity the moment you disconnect it. If a client churns mid-month you are not paying for their ghost until renewal.',
  ],
  /** Rendered as a small worked example beside the prose. */
  example: {
    title: 'One client, counted honestly',
    rows: [
      { label: 'LinkedIn company page', value: '1 channel' },
      { label: 'X account', value: '1 channel' },
      { label: 'Instagram professional account', value: '1 channel' },
      { label: 'TikTok account', value: '1 channel' },
      { label: 'YouTube channel', value: '1 channel' },
    ],
    totalLabel: 'Per client',
    totalValue: `${CHANNELS_PER_CLIENT} channels`,
    footnote: `${agencyPlan.name} includes ${agencyPlan.channels}, so roughly ${CLIENTS_AT_CAP} clients — across all ${channelCount} networks, with no per-network surcharge.`,
  },
} as const;

export const FAQS = [
  {
    q: 'Can a client see only their own workspace?',
    a: 'Yes. Invite them to their workspace as a reviewer or viewer and that is the only account they can reach. They never see your client list, your other calendars or your team.',
  },
  {
    q: 'Can we white-label the whole thing, not just reports?',
    a: 'Reports and a custom domain are included on the Agency plan. Full white-labelling of the application itself — your domain, your branding throughout, isolated infrastructure — is what a dedicated instance is for.',
  },
  {
    q: 'What happens when we take on client fifty?',
    a: 'You move up a plan, or disconnect the channels of a finished engagement to free capacity. Upgrades are immediate and prorated, so there is no gap where you cannot onboard someone.',
  },
  {
    q: 'Do you charge per seat?',
    a: 'No. Team members are unlimited from the Studio plan up. You are charged for connected channels, which is the thing that actually scales with the work.',
  },
];
