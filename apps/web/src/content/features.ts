/**
 * Feature content for the home page: who it is for, the agent integrations,
 * and the capability grid.
 *
 * Copy lives here rather than inside components so the whole site can be
 * re-pitched for a vertical (see docs/05-pricing-and-packaging.md on niching)
 * without touching a single component.
 */

export interface Audience {
  id: string;
  title: string;
  body: string;
  /** Lucide-style icon key resolved by components/ui/icon.tsx. */
  icon: 'sparkles' | 'code' | 'workflow' | 'users';
}

export const audiences: Audience[] = [
  {
    id: 'creators',
    title: 'Creators and founders',
    body:
      'Write once, publish everywhere, and stop losing a morning a week to copying the same post into six apps. Your calendar shows the whole month at a glance.',
    icon: 'sparkles',
  },
  {
    id: 'agencies',
    title: 'Agencies',
    body:
      'Keep every client in its own workspace with its own channels, approvals and reporting. Invite the client to review without giving them the keys.',
    icon: 'users',
  },
  {
    id: 'builders',
    title: 'Developers and automators',
    body:
      'A public REST API, webhooks, an MCP server and a CLI. Drive the whole calendar from n8n, Make, a cron job, or an agent you wrote yourself.',
    icon: 'code',
  },
];

export interface AgentIntegration {
  id: string;
  name: string;
  body: string;
  /** Tailwind gradient classes for the card. */
  tone: string;
  /** Larger cards span two columns in the bento. */
  wide?: boolean;
}

export const agentIntegrations: AgentIntegration[] = [
  {
    id: 'mcp',
    name: 'Any MCP client',
    body:
      'Point Claude, ChatGPT or Cursor at the MCP server and they can draft, queue and reschedule posts directly. No glue code.',
    tone: 'from-[#8217C3] to-[#390053]',
  },
  {
    id: 'cli',
    name: 'From your terminal',
    body:
      'A single command queues a post across every channel you name. Scriptable, so it drops into whatever you already run.',
    tone: 'from-[#164CD9] to-[#002584]',
  },
  {
    id: 'api',
    name: 'Public REST API',
    body:
      'Create, update and publish posts programmatically, and subscribe to webhooks when something goes out or fails.',
    tone: 'from-[#4C27E1] to-[#260091]',
  },
  {
    id: 'automations',
    name: 'n8n, Make and Zapier',
    body:
      'Wire the calendar into the automation tool you already use and let a workflow draft, route for approval and publish.',
    tone: 'from-[#B611B0] to-[#4A0047]',
  },
  {
    id: 'rss',
    name: 'RSS in, posts out',
    body:
      'Point a feed at a channel and every new item becomes a scheduled post, formatted for that network.',
    tone: 'from-[#CE2777] to-[#7D0052]',
  },
  {
    id: 'webhooks',
    name: 'Webhooks both ways',
    body:
      'Fire your own endpoint on publish, failure or approval, so the rest of your stack stays in step.',
    tone: 'from-[#6C10DF] to-[#410093]',
    wide: true,
  },
];

export interface Capability {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Bento span: 'half' is one column of two, 'full' spans both. */
  span: 'half' | 'full';
  /** Which illustration component renders inside the card. */
  visual: 'calendar' | 'agents' | 'editor' | 'team' | 'plugs' | 'analytics';
}

export const capabilities: Capability[] = [
  {
    id: 'schedule',
    eyebrow: 'Planning',
    title: 'Schedule everywhere at once',
    body:
      'Write a post once and publish it to every channel you pick, on the schedule you set. Adjust the wording per network where it matters, and preview the whole week before any of it goes out.',
    span: 'half',
    visual: 'calendar',
  },
  {
    id: 'agents',
    eyebrow: 'AI agents',
    title: 'Let an agent do the first draft',
    body:
      'Connect the assistant you already use and let it propose a week of posts. Everything lands as a draft in your calendar, so nothing publishes until you say so.',
    span: 'half',
    visual: 'agents',
  },
  {
    // LICENCE BLOCKER: the in-app image editor is the proprietary Polotno SDK,
    // which requires a paid commercial licence before this may be offered on a
    // public, paid service. Until that licence is bought, either remove this
    // capability from the site or disable the editor in the build.
    // See docs/04-launch-checklist.md.
    id: 'editor',
    eyebrow: 'Media',
    title: 'Design the image without leaving',
    body:
      'A built-in editor for post images, or generate one from a prompt. Crop per network automatically so a square feed post and a vertical story come from the same asset.',
    span: 'full',
    visual: 'editor',
  },
  {
    id: 'team',
    eyebrow: 'Teams',
    title: 'Built for more than one person',
    body:
      'Invite your team, assign posts, and require approval before anything publishes. Every client or brand gets its own workspace.',
    span: 'half',
    visual: 'team',
  },
  {
    id: 'plugs',
    eyebrow: 'Automation',
    title: 'Act on what performs',
    body:
      'Set a milestone — a hundred likes, say — and have the post automatically repeat, cross-post or pick up a follow-up comment, so your best content keeps working.',
    span: 'half',
    visual: 'plugs',
  },
  {
    id: 'analytics',
    eyebrow: 'Analytics',
    title: 'See what actually travelled',
    body:
      'Per-post and per-channel numbers in one view, so you can tell which hooks worked and double down instead of guessing.',
    span: 'full',
    visual: 'analytics',
  },
];

export interface Stat {
  value: string;
  label: string;
}

/**
 * PLACEHOLDER METRICS. These are illustrative and must be replaced with real,
 * attributable numbers before launch — publishing invented customer results is
 * both a trust problem and, in most jurisdictions, an advertising-standards one.
 * See docs/04-launch-checklist.md.
 */
export const headlineStats: Stat[] = [
  { value: '30+', label: 'networks from one calendar' },
  { value: '1', label: 'place to write the post' },
  { value: '0', label: 'tabs to copy it into' },
];
