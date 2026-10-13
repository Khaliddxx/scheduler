/**
 * One record per integration landing page (/integrations/<slug>), plus the
 * copy for every block of those pages.
 *
 * These are the destinations behind the Integrations menu. The assistants
 * connect over the MCP server, the automation tools over the public REST API,
 * and feeds are read directly — the copy on each page says which, and the
 * three steps are the real shape of the setup rather than marketing filler.
 *
 * ACCURACY. Every block below restates what src/content/developers.ts,
 * pricing.ts and faq.ts already say about the product (workspace-scoped keys,
 * drafts by default, signed webhooks, idempotency keys, the audit trail, every
 * plan). Nothing here names an endpoint, a package or a limit; the code windows
 * show placeholders or the illustrative samples from developers.ts.
 *
 * `logo` names a tile in public/preview/agents/, `hero` a mascot clip and still
 * in public/preview/integrations/ (see that folder's README); both optional.
 */
import { brand } from '@scheduler/brand';
import { channelCount } from '@/content/channels';
import { plans, TRIAL_DAYS } from '@/content/pricing';
import { cliName, envPrefix } from '@/content/developers';

export type IntegrationKind = 'assistant' | 'automation' | 'feed';

export interface IntegrationStep {
  title: string;
  body: string;
}

/** Colour theme of the page (same names as the page template's accents). */
export type IntegrationAccent = 'purple' | 'blue' | 'teal' | 'orange' | 'pink' | 'slate' | 'green';

export interface Integration {
  slug: string;
  name: string;
  kind: IntegrationKind;
  headline: string;
  summary: string;
  steps: [IntegrationStep, IntegrationStep, IntegrationStep];
  /** Three short points under the hero heading. */
  bullets: [string, string, string];
  /** One line for cards and menus. */
  blurb: string;
  /** Where the connection is made, for the setup table on /developers. */
  setupWhere: string;
  /** Two sibling pages offered in the "which one fits" block. */
  related: [string, string];
  accent: IntegrationAccent;
  logo?: string;
  /** Line glyph for a tile when there is no logo file. */
  glyph?: string;
  /** Mascot still and clip in public/preview/integrations/<hero>-hero.*. */
  hero?: string;
}

export const kindLabel: Record<IntegrationKind, string> = {
  assistant: 'AI assistant',
  automation: 'Automation',
  feed: 'Content source',
};

const mcpKeyStep: IntegrationStep = {
  title: 'Create an API key',
  body: 'In Settings → API, generate a key. It is scoped to your workspace, so an assistant can only see the channels you can.',
};

const approveStep: IntegrationStep = {
  title: 'Ask, then approve',
  body: 'Ask for a week of posts. Each one lands in the calendar as a draft, where you edit, approve or discard it before anything publishes.',
};

const apiKeyStep: IntegrationStep = {
  title: 'Create an API key',
  body: 'In Settings → API, generate a key and keep it in the tool\'s credential store rather than in the workflow itself.',
};

export const integrations: Integration[] = [
  {
    slug: 'claude',
    name: 'Claude',
    kind: 'assistant',
    headline: 'Schedule from Claude',
    summary:
      'Connect the MCP server once and Claude can read your channels, draft posts in your voice and place them on the calendar — all from the conversation you already have open.',
    steps: [
      mcpKeyStep,
      {
        title: 'Add the MCP server to Claude',
        body: 'Paste the server URL and your key into Claude\'s connectors (desktop or web). Claude lists the tools it now has: channels, drafts, schedule.',
      },
      approveStep,
    ],
    bullets: [
      'Add the MCP server to Claude\'s connectors once',
      'Ask for a week of posts in the conversation you have open',
      'Every post waits in the calendar as a draft for you',
    ],
    blurb: 'Draft and schedule from a Claude conversation',
    setupWhere: 'Claude\'s connectors, desktop or web',
    related: ['claude-code', 'chatgpt'],
    accent: 'orange',
    logo: 'claude',
    hero: 'claude',
  },
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    kind: 'assistant',
    headline: 'Schedule from ChatGPT',
    summary:
      'Add the MCP server as a connector and ChatGPT can turn a brief into a run of posts, each formatted for its network and queued at the time you choose.',
    steps: [
      mcpKeyStep,
      {
        title: 'Add the connector in ChatGPT',
        body: 'Under Settings → Connectors, add a custom MCP connector with the server URL and your key. Enable it in the chat where you want to use it.',
      },
      approveStep,
    ],
    bullets: [
      'Add the MCP server as a custom connector',
      'Turn a brief into posts formatted for each network',
      'Every post waits in the calendar as a draft for you',
    ],
    blurb: 'Turn a brief into a run of posts',
    setupWhere: 'Settings → Connectors, custom MCP connector',
    related: ['codex', 'claude'],
    accent: 'teal',
    logo: 'chatgpt',
    hero: 'chatgpt',
  },
  {
    slug: 'claude-code',
    name: 'Claude Code',
    kind: 'assistant',
    headline: 'Publish from the terminal',
    summary:
      'Install the command line and one command queues a post across every channel you name. Claude Code can run it for you, or you can wire it into any script.',
    steps: [
      mcpKeyStep,
      {
        title: 'Install and log in',
        body: 'Install the CLI with your package manager, then authenticate with the key. It stores the key in your user config, not in the project.',
      },
      {
        title: 'Create posts from the prompt',
        body: 'Ask Claude Code to publish an announcement to three networks; it runs the create command with per-network copy and shows you the scheduled result.',
      },
    ],
    bullets: [
      'Install the command line and log in with your key',
      'One command queues a post across every channel you name',
      'Claude Code runs it for you, or wire it into any script',
    ],
    blurb: 'Queue posts from the terminal or a script',
    setupWhere: 'The command line, logged in with the key',
    related: ['claude', 'codex'],
    accent: 'orange',
    logo: 'claude-code',
    hero: 'claude-code',
  },
  {
    slug: 'codex',
    name: 'Codex',
    kind: 'assistant',
    headline: 'Schedule from Codex',
    summary:
      'Point Codex at the MCP server and it can draft and queue posts as part of any task — a release note becomes a thread, a changelog becomes a week of updates.',
    steps: [
      mcpKeyStep,
      {
        title: 'Register the MCP server',
        body: 'Add the server URL and key to Codex\'s MCP configuration. The scheduling tools appear alongside the rest of its toolset.',
      },
      approveStep,
    ],
    bullets: [
      'Register the MCP server in Codex\'s configuration',
      'A release note becomes a thread, a changelog a week of updates',
      'Every post waits in the calendar as a draft for you',
    ],
    blurb: 'Draft posts as part of any coding task',
    setupWhere: 'Codex\'s MCP configuration',
    related: ['chatgpt', 'cursor'],
    accent: 'slate',
    logo: 'codex',
    hero: 'codex',
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    kind: 'assistant',
    headline: 'Schedule from Cursor',
    summary:
      'Add the MCP server to Cursor and the agent that just shipped your feature can write the post about it, in the same session.',
    steps: [
      mcpKeyStep,
      {
        title: 'Add the server in Cursor settings',
        body: 'Under MCP servers, add the URL and key. Cursor shows the available tools; the agent uses them when a task calls for publishing.',
      },
      approveStep,
    ],
    bullets: [
      'Add the MCP server under Cursor\'s MCP settings',
      'The agent that shipped the feature writes the post about it',
      'Every post waits in the calendar as a draft for you',
    ],
    blurb: 'Write the post in the session that shipped it',
    setupWhere: 'Cursor settings → MCP servers',
    related: ['claude-code', 'codex'],
    accent: 'blue',
    logo: 'cursor',
    hero: 'cursor',
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    kind: 'assistant',
    headline: 'Schedule from Gemini',
    summary:
      'Any Gemini surface that supports MCP — the CLI included — can connect to the server and schedule posts from a plain-language brief.',
    steps: [
      mcpKeyStep,
      {
        title: 'Configure the MCP server',
        body: 'Add the server URL and key to the Gemini CLI settings file. The tools are available in the next session.',
      },
      approveStep,
    ],
    bullets: [
      'Works on any Gemini surface that supports MCP',
      'Add the server to the Gemini CLI settings file',
      'Schedule posts from a plain-language brief',
    ],
    blurb: 'Schedule from a plain-language brief',
    setupWhere: 'The Gemini CLI settings file',
    related: ['chatgpt', 'claude'],
    accent: 'blue',
    logo: 'gemini',
    hero: 'gemini',
  },
  {
    slug: 'n8n',
    name: 'n8n',
    kind: 'automation',
    headline: 'Drive the calendar from n8n',
    summary:
      'Every workflow that ends in "and then post about it" can end in a scheduled post instead. The public API accepts a post from an HTTP Request node, and webhooks tell n8n when it went out.',
    steps: [
      apiKeyStep,
      {
        title: 'Call the API from an HTTP Request node',
        body: 'POST the post body, channels and time to the public API with the key in the header. The response carries the scheduled post\'s id.',
      },
      {
        title: 'Listen for the result',
        body: 'Add a webhook endpoint in n8n and register it; publish, failure and approval events arrive there so the workflow can continue.',
      },
    ],
    bullets: [
      'Create posts from an HTTP Request node',
      'Webhooks tell the workflow when a post went out',
      'Public API and webhooks on every plan',
    ],
    blurb: 'End any workflow in a scheduled post',
    setupWhere: 'An HTTP Request node and a webhook',
    related: ['make', 'zapier'],
    accent: 'pink',
    glyph: 'workflow',
  },
  {
    slug: 'make',
    name: 'Make',
    kind: 'automation',
    headline: 'Drive the calendar from Make',
    summary:
      'Use an HTTP module against the public API to create posts from any scenario, and a custom webhook to react when they publish.',
    steps: [
      apiKeyStep,
      {
        title: 'Create the post with an HTTP module',
        body: 'Send the post as JSON to the public API with the key in the header. Map the scenario\'s fields to channels, copy and schedule time.',
      },
      {
        title: 'React with a custom webhook',
        body: 'Register a Make webhook URL and the publish or failure event triggers the next scenario.',
      },
    ],
    bullets: [
      'Create posts from any scenario with an HTTP module',
      'A custom webhook reacts when posts publish',
      'Public API and webhooks on every plan',
    ],
    blurb: 'Create posts from any scenario',
    setupWhere: 'An HTTP module and a custom webhook',
    related: ['n8n', 'zapier'],
    accent: 'purple',
    glyph: 'workflow',
  },
  {
    slug: 'zapier',
    name: 'Zapier',
    kind: 'automation',
    headline: 'Drive the calendar from Zapier',
    summary:
      'Webhooks by Zapier on both ends: a Zap creates a post through the public API, and a catch hook receives the publish event.',
    steps: [
      apiKeyStep,
      {
        title: 'Create the post with Webhooks by Zapier',
        body: 'A POST action to the public API with the key in a custom header. Fields from the trigger map straight onto the post body.',
      },
      {
        title: 'Catch the result',
        body: 'A catch hook URL registered as a webhook receives publish, failure and approval events to start further Zaps.',
      },
    ],
    bullets: [
      'A Zap creates posts through the public API',
      'A catch hook receives publish and failure events',
      'Public API and webhooks on every plan',
    ],
    blurb: 'Webhooks by Zapier on both ends',
    setupWhere: 'Webhooks by Zapier: a POST action and a catch hook',
    related: ['n8n', 'make'],
    accent: 'orange',
    glyph: 'bolt',
  },
  {
    slug: 'rss',
    name: 'RSS feeds',
    kind: 'feed',
    headline: 'Turn a feed into posts',
    summary:
      'Point a feed at a channel and every new item becomes a scheduled post, formatted for that network — your blog, newsletter or podcast keeps the calendar full on its own.',
    steps: [
      {
        title: 'Add the feed',
        body: 'Paste the feed URL and choose the channels it should post to. The feed is checked on a schedule you set.',
      },
      {
        title: 'Shape the post',
        body: 'Choose which fields become the post — title, excerpt, link, image — and whether items publish straight away or wait as drafts.',
      },
      {
        title: 'Review in the calendar',
        body: 'Each item appears in the calendar like any other post, so you can edit the copy or move the time before it goes out.',
      },
    ],
    bullets: [
      'Every new feed item becomes a scheduled post',
      'Formatted for each network it posts to',
      'Publish straight away, or hold items as drafts',
    ],
    blurb: 'Every new item becomes a scheduled post',
    setupWhere: `Inside ${brand.name}: paste the feed URL`,
    related: ['n8n', 'zapier'],
    accent: 'green',
    glyph: 'rss',
  },
];

export const getIntegration = (slug: string): Integration | undefined =>
  integrations.find((item) => item.slug === slug);

/* ------------------------------------------------------------------ */
/* Page copy                                                           */
/* ------------------------------------------------------------------ */

/** Which developer surface an integration uses: the MCP server, the CLI, the API, or none (feeds). */
export type Surface = 'mcp' | 'cli' | 'api' | 'feed';

export const surfaceOf = (item: Integration): Surface =>
  item.kind === 'feed' ? 'feed' : item.kind === 'automation' ? 'api' : item.slug === 'claude-code' ? 'cli' : 'mcp';

const starter = plans.find((p) => p.monthly > 0) ?? plans[0];

/** Text with optional links, rendered by the page: [label](href) segments. */
export type Rich = string;

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Prompt {
  category: string;
  title: string;
  prompt: string;
  icons: string[];
}

export interface Chat {
  user: string;
  reply: string;
  via: string[];
  alsoTry: string[];
}

export interface QAItem {
  question: string;
  answer: string;
}

export interface IntegrationCopy {
  connectTitle: string;
  /** Label, meta line, and the code window of the first step card. */
  connectCard: { label: string; meta: string; title: string; body: string; codeTitle: string; code: string; notes: Rich[] };
  /** Second step card: a chat, or a code window when there is no conversation (automation). */
  askCard: { label: string; meta: string; title: string; body: string; chat?: Chat; codeTitle?: string; code?: string };
  afterNote: Rich;
  orbitTitle: string;
  orbitBody: string;
  /** The MCP / API / CLI comparison; absent for feeds. */
  table?: { title: string; intro: string; highlight: number; note: string };
  featuresTitle: string;
  featuresIntro: string;
  features: Feature[];
  explainTitle: string;
  explainIntro: string;
  explainBoxTitle: string;
  explainBoxBody: string;
  explainList: string[];
  /** Code window beside the list: `sample` picks one from developers.ts, `code` is literal. */
  explainCode?: { title: string; sample?: 'mcp' | 'cli' | 'curl'; code?: string };
  explainNote: Rich;
  promptsTitle: string;
  promptsIntro: string;
  prompts: Prompt[];
  channelsTitle: string;
  channelsIntro: string;
  compareTitle: string;
  compareIntro: string;
  costTitle: string;
  cost: string;
  security: string;
  troubleshooting: string[];
  faqTitle: string;
  faq: QAItem[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  footnote: Rich;
}

/** The comparison of the three ways in, shared by every non-feed page and the index. */
export const surfaceTable = {
  head: ['', 'MCP server', 'Public API', 'Command line'],
  rows: [
    [
      'Best for',
      'Asking an assistant in plain language',
      'Automation tools and your own code',
      'Terminals, scripts and CI jobs',
    ],
    [
      'Connects from',
      'Any MCP client: desktop assistants, editors or your own agent loop',
      'Anything that can send JSON over HTTPS',
      'A terminal, a Makefile, a CI job or a release script',
    ],
    [
      'Authentication',
      'A workspace API key',
      'A workspace API key, sent as a bearer token',
      'An API key read from an environment variable',
    ],
    [
      'What it creates',
      'Drafts; nothing publishes until a person approves, unless you turn that off',
      'Drafts, unless a post is explicitly scheduled',
      'Drafts, unless a post is explicitly scheduled',
    ],
    [
      'Good to know',
      'Every agent action is labelled in the workspace audit trail',
      'Idempotency keys, cursor pagination, rate limits in response headers',
      'A dry-run flag renders each channel\'s post without publishing',
    ],
    ['Plans', 'Every plan', 'Every plan', 'Every plan'],
  ],
} as const;

const assistantPrompts = (item: Integration): Prompt[] => {
  const first: Prompt =
    item.slug === 'codex'
      ? {
          category: 'Release notes',
          title: 'Turn the changelog into a thread',
          prompt: 'Turn CHANGELOG.md into a short thread for X and a LinkedIn post, both for tomorrow at 9am.',
          icons: ['x', 'linkedin'],
        }
      : item.slug === 'cursor'
        ? {
            category: 'Launch',
            title: 'Post about what you shipped',
            prompt: 'Write the post about the feature we just shipped and queue it for LinkedIn and X on Thursday.',
            icons: ['x', 'linkedin'],
          }
        : {
            category: 'Announcement',
            title: 'Announce a release',
            prompt: 'Turn these release notes into a post for X and LinkedIn and queue it for Tuesday at 9am.',
            icons: ['x', 'linkedin'],
          };
  return [
    first,
    {
      category: 'Content calendar',
      title: 'Plan a whole week',
      prompt: 'Draft a week of posts about our launch, one each weekday, across my channels.',
      icons: ['linkedin', 'instagram', 'threads'],
    },
    {
      category: 'Rescheduling',
      title: 'Move what underperformed',
      prompt: 'Find last week\'s posts that underperformed and reschedule reworked versions for next week.',
      icons: ['x', 'bluesky'],
    },
    {
      category: 'Channels',
      title: 'Check what is connected',
      prompt: 'List the channels in this workspace and tell me which ones have nothing scheduled this week.',
      icons: ['mastodon', 'facebook'],
    },
  ];
};

const cliPrompts: Prompt[] = [
  {
    category: 'Release',
    title: 'Announce a version',
    prompt: 'Announce v4.2 on X, LinkedIn and Mastodon tomorrow at 9am using release-notes.md.',
    icons: ['x', 'linkedin', 'mastodon'],
  },
  {
    category: 'Preview',
    title: 'Dry-run it first',
    prompt: 'Show me exactly what each channel would publish for this announcement, without publishing it.',
    icons: ['linkedin', 'bluesky'],
  },
  {
    category: 'Pipeline',
    title: 'Post from CI',
    prompt: 'Add a step to the release workflow that queues the announcement after the deploy succeeds.',
    icons: ['x', 'discord'],
  },
  {
    category: 'From a file',
    title: 'Post a written draft',
    prompt: 'Read announcement.md and queue it for our LinkedIn page and X on Friday morning.',
    icons: ['linkedin', 'x'],
  },
];

const automationPrompts = (item: Integration): Prompt[] => [
  {
    category: 'New article',
    title: 'Share every new post',
    prompt: 'When an article is published in the CMS, create LinkedIn and X drafts with its title and link.',
    icons: ['linkedin', 'x'],
  },
  {
    category: 'Spreadsheet',
    title: 'Schedule from a sheet',
    prompt: 'When a row is added to the content sheet, schedule its copy for the date and channels in the row.',
    icons: ['instagram', 'facebook', 'threads'],
  },
  {
    category: 'Failures',
    title: 'Tell the team when it fails',
    prompt: 'When a failed event arrives, alert the team chat with a link to the post so someone can requeue it.',
    icons: ['slack'],
  },
  {
    category: 'Approvals',
    title: `Continue after approval`,
    prompt: `When a draft is approved, log it to the campaign tracker and carry on with the rest of the ${item.name === 'Zapier' ? 'Zap' : item.name === 'Make' ? 'scenario' : 'workflow'}.`,
    icons: ['linkedin'],
  },
];

const feedPrompts: Prompt[] = [
  {
    category: 'Blog',
    title: 'Share every article',
    prompt: 'New article → a LinkedIn post with the excerpt and link, and a shorter one for X.',
    icons: ['linkedin', 'x'],
  },
  {
    category: 'Newsletter',
    title: 'Promote each issue',
    prompt: 'New issue → a post with the issue title and link, held as a draft for review.',
    icons: ['linkedin', 'mastodon'],
  },
  {
    category: 'Podcast',
    title: 'Announce new episodes',
    prompt: 'New episode → a post with the episode title, cover image and link.',
    icons: ['instagram', 'facebook'],
  },
  {
    category: 'Release notes',
    title: 'Mirror the changelog',
    prompt: 'New release in the feed → a short post with the version and a link to the notes.',
    icons: ['x', 'bluesky'],
  },
];

const mcpPlaceholders = () =>
  [
    `Name:   ${cliName}`,
    'URL:    <your MCP server URL>',
    'Key:    <workspace API key from Settings → API>',
  ].join('\n');

const httpRequest = [
  'POST    <public API URL for posts>',
  'Header  Authorization: Bearer <API key>',
  'Body    {',
  '          "channels": [ … ],',
  '          "content":  { "text": "…" },',
  '          "publishAt": "…"',
  '        }',
].join('\n');

const webhookEvents = [
  '# Events a registered webhook receives',
  'published',
  'failed',
  'approval requested',
  'approved',
  'rejected',
  'channel disconnected',
  'token expiring',
].join('\n');

const feedSettings = [
  'Feed URL   https://example.com/feed.xml',
  'Channels   LinkedIn, X, Mastodon',
  'Checked    on the schedule you set',
  'Post with  title · excerpt · link · image',
  'Then       publish straight away, or wait as drafts',
].join('\n');

export function copyFor(item: Integration): IntegrationCopy {
  const surface = surfaceOf(item);
  const n = item.name;
  const b = brand.name;

  const cost =
    surface === 'feed'
      ? `RSS auto-posting has no separate charge: it is on every plan. Plans start at $${starter.monthly} a month for ${starter.channels} channels, after a ${TRIAL_DAYS}-day trial.`
      : `${n} access has no separate charge: the MCP server, public API, command line and webhooks are on every plan. Plans start at $${starter.monthly} a month for ${starter.channels} channels, after a ${TRIAL_DAYS}-day trial.`;

  const commonFaqTail: QAItem[] = [
    {
      question: `Which networks can ${n} post to?`,
      answer: `Every network ${b} publishes to, ${channelCount} in total, including X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Threads, Bluesky, Mastodon, Pinterest, Discord, Slack and Telegram, plus Medium, DEV.to, Hashnode and WordPress. Connect the accounts in ${b} once.`,
    },
    {
      question: `Does it cost extra to use ${n}?`,
      answer: cost,
    },
    {
      question: 'What happens if a post fails to publish?',
      answer:
        'A failed publish is retried and then surfaced in the calendar with the platform error attached, so you can fix and requeue it rather than discovering a silent gap a week later.',
    },
  ];

  if (surface === 'feed') {
    return {
      connectTitle: 'Turn a feed into posts in three steps',
      connectCard: {
        label: 'Add',
        meta: 'any RSS feed',
        title: item.steps[0].title,
        body: item.steps[0].body,
        codeTitle: 'Feed settings (example)',
        code: feedSettings,
        notes: [
          `Your blog, newsletter or podcast feed works. Each channel gets a post formatted for that network.`,
          `RSS auto-posting is on every plan. [Compare plans](/pricing).`,
        ],
      },
      askCard: {
        label: 'Review',
        meta: 'lands in the calendar',
        title: item.steps[2].title,
        body: item.steps[2].body,
        chat: {
          user: 'New on the blog: How we cut our release cycle to one week',
          reply: 'Queued for LinkedIn and X at 9:00 tomorrow, with the excerpt and link. Edit the copy or move the time in the calendar.',
          via: ['linkedin', 'x'],
          alsoTry: ['Hold items as drafts', 'Add the image', 'Post to Mastodon too'],
        },
      },
      afterNote: `Prefer to wire feeds into a bigger workflow? [n8n](/integrations/n8n), [Make](/integrations/make) and [Zapier](/integrations/zapier) can create posts through the public API.`,
      orbitTitle: 'One feed can reach every channel you run',
      orbitBody: `Connect your accounts in ${b} once. Point a feed at any of them, and ${b} posts each new item in that network's format.`,
      featuresTitle: `What can ${b} do with a feed?`,
      featuresIntro: item.summary,
      features: [
        { icon: 'rss', title: 'Any feed you publish', description: 'A blog, a newsletter, a podcast or a changelog: if it has a feed, its new items can become posts.' },
        { icon: 'clock', title: 'Checked on your schedule', description: 'The feed is checked on a schedule you set, so new items turn up in the calendar without anyone copying them over.' },
        { icon: 'sliders', title: 'Choose the fields', description: 'Pick what becomes the post — title, excerpt, link, image — for each feed.' },
        { icon: 'shield', title: 'Publish or hold', description: 'Let items publish straight away, or have them wait as drafts until someone approves them.' },
        { icon: 'layers', title: 'Formatted per network', description: 'Each item is formatted for the network it posts to, from LinkedIn to Mastodon.' },
        { icon: 'calendar', title: 'Editable in the calendar', description: 'Items appear in the calendar like any other post, so you can change the copy or move the time.' },
      ],
      explainTitle: 'How does RSS auto-posting work?',
      explainIntro: `${b} reads the feed directly. You choose the channels and the fields once, and every new item in the feed follows the same rules.`,
      explainBoxTitle: 'From feed item to post',
      explainBoxBody: 'Each new item in the feed goes through the same three steps before it reaches a network.',
      explainList: [
        'The feed is checked on the schedule you set',
        'A new item is shaped into a post from the fields you chose',
        'The post is formatted for each channel the feed posts to',
        'It publishes straight away or waits as a draft, as you chose',
        'Either way it sits in the calendar, where you can edit or move it',
        'A failed publish is retried and shown with the platform error',
      ],
      explainNote: `Want the same from your own code? The [public API](/developers#api) creates posts from anywhere.`,
      promptsTitle: 'Which feeds work best?',
      promptsIntro: 'Anything you already publish on a schedule. Here is how a typical item turns into a post for each kind of feed.',
      prompts: feedPrompts,
      channelsTitle: 'Which networks can a feed post to?',
      channelsIntro: `Every network ${b} publishes to, ${channelCount} in total. Connect the accounts once, then choose which of them each feed posts to.`,
      compareTitle: `RSS, n8n or Zapier: which one fits?`,
      compareIntro: 'A feed covers "post every new item". When the post depends on other steps, an automation tool can create it through the public API instead.',
      costTitle: 'Cost, access and troubleshooting',
      cost,
      security: `A feed only posts to the channels you choose for it, and each item lands in the calendar like any other post, so the team can see and edit it before it goes out.`,
      troubleshooting: [
        'Items are waiting instead of publishing: the feed is set to hold items as drafts. Approve them in the calendar, or change the setting.',
        'A post is missing the image or link: change which fields become the post for that feed.',
        'A publish failed: it is retried, then shown in the calendar with the platform error attached.',
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        { question: 'How do I add a feed?', answer: `Paste the feed URL in ${b} and choose the channels it should post to. Then choose which fields become the post and whether items publish straight away or wait as drafts.` },
        { question: 'How often is the feed checked?', answer: 'On a schedule you set. New items since the last check become posts.' },
        { question: 'Which parts of an item become the post?', answer: 'You choose: the title, the excerpt, the link and the image, in any combination.' },
        { question: 'Can items wait for a review?', answer: 'Yes. Set the feed to hold items as drafts and they wait in the calendar until someone approves them.' },
        { question: 'Can I edit a post before it goes out?', answer: 'Yes. Each item appears in the calendar like any other post, so you can edit the copy or move the time before it publishes.' },
        ...commonFaqTail,
      ],
      closingTitle: `Let ${n} fill the calendar, and keep the final say`,
      closingBody: `Point your blog, newsletter or podcast at ${b} and let every new item become a post.`,
      ctaLabel: 'Add a feed',
      footnote: `${b} reads the feed and posts each new item to the channels you chose; items can wait as drafts so a person approves them first. Part of the [integrations guide](/integrations). Building something bigger? See the [developer docs](/developers).`,
    };
  }

  if (surface === 'api') {
    const flow = n === 'Zapier' ? 'Zap' : n === 'Make' ? 'scenario' : 'workflow';
    return {
      connectTitle: `Connect ${n} in three steps`,
      connectCard: {
        label: 'Connect',
        meta: 'public API',
        title: item.steps[1].title,
        body: item.steps[1].body,
        codeTitle: 'HTTP request (illustrative)',
        code: httpRequest,
        notes: [
          `${apiKeyStep.body} Exact paths and fields are in the API reference; details on the [developers page](/developers#api).`,
          `Retrying a request? Send an idempotency key with it, so a retried request does not publish twice.`,
        ],
      },
      askCard: {
        label: 'React',
        meta: 'signed webhooks',
        title: item.steps[2].title,
        body: item.steps[2].body,
        codeTitle: 'Webhook events',
        code: webhookEvents,
      },
      afterNote: `The public API and webhooks are on every plan, not an enterprise add-on. [Compare plans](/pricing).`,
      orbitTitle: `One ${flow} can reach every channel you run`,
      orbitBody: `Connect your accounts in ${b} once. From then on a ${flow} can post to any of them, and ${b} publishes at the time you set.`,
      table: {
        title: 'Public API, MCP server or command line?',
        intro: `All three use the same workspace API key and the same approval rules. ${n} talks to the public API; the other two are there when a person or an assistant does the asking.`,
        highlight: 2,
        note: `Start with the public API for ${n}. Reach for the MCP server when you would rather ask an assistant in plain language.`,
      },
      featuresTitle: `What can ${n} do with ${b}?`,
      featuresIntro: `Through the public API a ${flow} can create, read, update, schedule and delete posts, list channels, upload media and pull analytics, and webhooks tell it what happened next.`,
      features: [
        { icon: 'send', title: 'One request, many channels', description: 'A single request can target many channels at once.' },
        { icon: 'sliders', title: 'Per-channel overrides', description: 'Change the wording for one network in the same payload, because what reads well on LinkedIn rarely reads well on X.' },
        { icon: 'repeat', title: 'Safe to retry', description: 'Idempotency keys on create calls, so a retried request does not publish twice.' },
        { icon: 'zap', title: 'Signed webhooks', description: 'Each delivery is signed with HMAC-SHA256 over the raw body with a timestamp, so a captured delivery cannot be replayed.' },
        { icon: 'refresh', title: 'Retries with backoff', description: 'A non-2xx response is retried with backoff, and every delivery is in a log you can inspect.' },
        { icon: 'chart', title: 'Rate limits you can see', description: 'Limits per key and per channel, returned in response headers rather than guessed.' },
      ],
      explainTitle: `What is the ${b} public API?`,
      explainIntro:
        'The API the application itself uses: create, read, update, schedule and delete posts; list channels; upload media; pull analytics. There is no second-class subset for integrators.',
      explainBoxTitle: `How ${n} uses ${b}`,
      explainBoxBody: `A ${flow} sends JSON with the key as a bearer token, and a registered webhook hears back when something happens.`,
      explainList: [
        `Store the key in ${n}'s credential store, not in the ${flow}`,
        'Send the post, its channels and its time as JSON',
        'Override the copy per channel in the same payload',
        'Read the scheduled post\'s id from the response',
        'Verify the webhook signature before parsing the body',
      ],
      explainCode: { title: 'Schedule one post across several channels', sample: 'curl' },
      explainNote: `The snippets on this page are illustrative. Exact paths, fields and event names live in the API reference that ships with the application. More on the [developers page](/developers).`,
      promptsTitle: `What can a ${n} ${flow} do?`,
      promptsIntro: `Anything that ends in "and then post about it", or starts when a post goes out. A few ${flow}s teams build first:`,
      prompts: automationPrompts(item),
      channelsTitle: `Which networks can ${n} post to?`,
      channelsIntro: `Every network ${b} publishes to, ${channelCount} in total. Connect the accounts in ${b} once and any ${flow} can post to them.`,
      compareTitle: `${n}, ${getIntegration(item.related[0])?.name} or ${getIntegration(item.related[1])?.name}: which one fits?`,
      compareIntro: 'All three call the same public API with the same key and hear back through the same webhooks. Pick the one your team already runs.',
      costTitle: 'Cost, access and troubleshooting',
      cost,
      security: 'The key belongs to one workspace and is listed with its last use; revoking it takes effect immediately. Webhook deliveries are signed with a timestamp, so a captured delivery cannot be replayed.',
      troubleshooting: [
        'Requests are rejected: check the key is sent as a bearer token and has not been revoked.',
        'Posts arrive as drafts: anything created through the API waits as a draft unless it is explicitly scheduled.',
        `The same event arrives twice: delivery is at least once, so make the receiving step idempotent.`,
      ],
      faqTitle: 'Frequently asked questions',
      faq: [
        { question: `How do I connect ${n} to ${b}?`, answer: `${apiKeyStep.body} ${item.steps[1].body} ${item.steps[2].body}` },
        { question: 'What can the public API do?', answer: 'Create, read, update, schedule and delete posts; list channels; upload media; pull analytics. It is the same interface the calendar in your browser talks to.' },
        { question: `Which events can a ${flow} react to?`, answer: 'Published, failed, approval-requested, approved and rejected events, plus channel disconnected and token expiring.' },
        { question: 'Will a post publish as soon as I send it?', answer: 'Anything created through the API arrives as a draft unless it is explicitly scheduled. Approval settings apply to machines exactly as they do to people.' },
        { question: 'Can a retried request publish twice?', answer: 'Not if you send an idempotency key with it: create calls accept one, so a retry does not publish twice.' },
        { question: 'How do I check a webhook is genuine?', answer: 'Verify the HMAC-SHA256 signature over the raw request body, with its timestamp, before parsing the body. Parsing first means acting on structure an attacker controls.' },
        ...commonFaqTail,
      ],
      closingTitle: `Let ${n} fill the calendar, and keep the final say`,
      closingBody: `Connect ${n} to ${b} and let your ${flow}s end in a scheduled post.`,
      ctaLabel: `Connect ${n}`,
      footnote: `Posts created through the API arrive as drafts unless they are explicitly scheduled, so a person can approve them first. Part of the [integrations guide](/integrations). Building your own? See the [developer docs](/developers).`,
    };
  }

  // Assistants: the MCP server, or the command line for Claude Code.
  const cli = surface === 'cli';
  const chat: Chat = cli
    ? {
        user: 'Announce v4.2 on X, LinkedIn and Mastodon tomorrow at 9am using release-notes.md.',
        reply: 'Ran the create command with copy written for each network. Three posts are scheduled for 9:00 tomorrow; here is what each one says.',
        via: ['x', 'linkedin', 'mastodon'],
        alsoTry: ['Do a dry run first', 'Read the post from a file', 'Output JSON for a script'],
      }
    : item.slug === 'codex'
      ? {
          user: 'Turn CHANGELOG.md into a short thread for X and a LinkedIn post for tomorrow morning.',
          reply: 'Drafted both. They are waiting in the calendar for tomorrow at 9:00 — approve them there and they publish on time.',
          via: ['x', 'linkedin'],
          alsoTry: ['List my channels', 'Queue a week of posts', 'Reschedule what underperformed'],
        }
      : item.slug === 'cursor'
        ? {
            user: 'Write the post about the feature we just shipped and queue it for LinkedIn and X on Thursday.',
            reply: 'Two drafts are in the calendar for Thursday at 10:00, one written for each network. Approve them there to publish.',
            via: ['linkedin', 'x'],
            alsoTry: ['List my channels', 'Queue a week of posts', 'Reschedule what underperformed'],
          }
        : {
            user: 'Draft a week of posts about our launch for LinkedIn and X, one each weekday at 9am.',
            reply: 'Done. Five drafts are in the calendar for Monday to Friday at 9:00. Approve them there and they go out on time.',
            via: ['linkedin', 'x'],
            alsoTry: ['List my channels', 'Queue a week of posts', 'Reschedule what underperformed'],
          };

  const configCode = cli
    ? [
        `export ${envPrefix}_API_KEY="<workspace API key>"`,
        '',
        '# then, from any prompt or script:',
        `${cliName} post --help`,
      ].join('\n')
    : mcpPlaceholders();

  return {
    connectTitle: `Connect ${n} in three steps`,
    connectCard: {
      label: cli ? 'Install' : 'Connect',
      meta: 'Settings → API',
      title: item.steps[1].title,
      body: item.steps[1].body,
      codeTitle: cli ? 'Terminal (illustrative)' : `${n} connector settings`,
      code: configCode,
      notes: cli
        ? [
            `${mcpKeyStep.body} The command line also reads the key from an environment variable, so it runs unattended in CI. Details on the [developers page](/developers#cli).`,
            `Prefer to ask in plain language? [Claude](/integrations/claude) connects to the MCP server with the same key.`,
          ]
        : [
            `${mcpKeyStep.body} Details on the [developers page](/developers#mcp).`,
            `Want the same from a script? The [public API](/developers#api) and [command line](/developers#cli) use the same key.`,
          ],
    },
    askCard: {
      label: 'Ask',
      meta: cli ? 'scheduled' : 'lands as a draft',
      title: item.steps[2].title,
      body: item.steps[2].body,
      chat,
    },
    afterNote: `The MCP server, public API, command line and webhooks are on every plan, not an enterprise add-on. [Compare plans](/pricing).`,
    orbitTitle: cli ? 'One command can reach every channel you run' : `One key lets ${n} reach every channel you run`,
    orbitBody: `Connect your accounts in ${b} once. From then on ${n} can ${cli ? 'post' : 'draft'} for any of them, and ${b} publishes at the time you set.`,
    table: {
      title: 'MCP server, public API or command line?',
      intro: cli
        ? 'All three use the same workspace API key and the same approval rules. Claude Code drives the command line; the MCP server and the public API cover the same work from an assistant or your own code.'
        : `All three use the same workspace API key and the same approval rules. ${n} talks to the MCP server; the other two are there when the same job should run without anyone asking.`,
      highlight: cli ? 3 : 1,
      note: cli
        ? 'Use the command line when the post belongs in a script or a pipeline. Switch to the MCP server when you would rather ask in plain language.'
        : `Start with the MCP server for ${n}. Reach for the API or the command line when the same job should run on its own.`,
    },
    featuresTitle: `What can ${n} do with ${b}?`,
    featuresIntro: cli
      ? 'Claude Code runs the command line for you: one command queues a post across every channel you name, from a terminal, a Makefile, a CI job or a release script.'
      : `Through the MCP server ${n} can list your channels, draft a post, queue a week of them and reschedule what underperformed, in the workspace its key belongs to.`,
    features: cli
      ? [
          { icon: 'terminal', title: 'One command, many channels', description: 'Queue a post across every channel you name, with per-network copy, in one run.' },
          { icon: 'file', title: 'From a file or standard input', description: 'The command line reads post bodies from a file or standard input, which keeps templating easy.' },
          { icon: 'eye', title: 'Dry run first', description: 'A dry-run flag renders exactly what would be published per channel, without publishing it.' },
          { icon: 'code', title: 'Output for scripts', description: 'Machine-readable output for scripting, human-readable by default.' },
          { icon: 'key', title: 'Key kept out of the repo', description: 'The key lives in your user config, or an environment variable in CI, never in the project.' },
          { icon: 'shield', title: 'Drafts unless scheduled', description: 'Anything created from the command line arrives as a draft unless it is explicitly scheduled.' },
        ]
      : [
          { icon: 'chat', title: 'Ask in plain language', description: `Describe the post or the week you want. ${n} picks the tools; nobody writes glue code for its tool calls.` },
          { icon: 'globe', title: `All ${channelCount} networks`, description: 'Draft for any network connected in the workspace, from X and LinkedIn to Mastodon and WordPress.' },
          { icon: 'calendar', title: 'Queue a week at once', description: 'Ask for a run of posts and each one lands in the calendar at the time you chose, ready to review.' },
          { icon: 'repeat', title: 'Reschedule what underperformed', description: `Ask ${n} to rework and move posts that did not land, without opening the calendar.` },
          { icon: 'shield', title: 'Drafts by default', description: 'Nothing an agent writes publishes until a person approves it, unless you turn that off deliberately.' },
          { icon: 'key', title: 'Scoped to one workspace', description: 'The key decides what it can see. An agency can give an agent one client without handing it the rest.' },
        ],
    explainTitle: cli ? `What is the ${b} command line?` : `What is the ${b} MCP server?`,
    explainIntro: cli
      ? 'One command, from wherever you already are: queue a post from a terminal, a Makefile, a CI job or a release script. Shipped a version? Announce it in the same pipeline that shipped it.'
      : `A Model Context Protocol server, so any MCP-speaking assistant can list your channels, draft a post, queue a week of them and reschedule what underperformed — without you writing glue code for its tool calls.`,
    explainBoxTitle: `How ${n} uses ${b}`,
    explainBoxBody: cli
      ? 'Claude Code runs the command for you and shows you the scheduled result, or you call the same command from any script.'
      : `Once the server is added, ${n} lists the tools it now has — channels, drafts, schedule — and calls them when you ask it to post.`,
    explainList: cli
      ? [
          'Authenticate once; the key stays in your user config',
          'Ask Claude Code for an announcement on the networks you name',
          'It runs the create command with copy for each network',
          'Use the dry-run flag to see each post before it goes out',
          'Run the same command unattended in CI from an environment variable',
        ]
      : [
          `Add the MCP server and your key in ${n}`,
          `${n} lists the channels in your workspace`,
          'It drafts posts and places them on the calendar',
          'You edit, approve or discard each one before it publishes',
          'Every agent action is labelled in the audit trail',
        ],
    explainCode: cli
      ? { title: 'Announce a release from your deploy pipeline', sample: 'cli' }
      : item.slug === 'claude' || item.slug === 'chatgpt'
        ? {
            title: `${n} connector`,
            code: [
              `Server:  <your MCP server URL>`,
              'Key:     <workspace API key>',
              '',
              `# Tools ${n} lists once connected:`,
              '#  - channels   what the workspace can post to',
              '#  - drafts     posts written for review',
              '#  - schedule   queue them at the time you choose',
            ].join('\n'),
          }
        : { title: 'Point an MCP client at your workspace', sample: 'mcp' },
    explainNote: `The snippets on this page are illustrative; exact names live in the reference that ships with the application. Read more on the [developers page](/developers#${cli ? 'cli' : 'mcp'}).`,
    promptsTitle: cli ? `What can I ask ${n} to run?` : `What can I ask ${n} to post?`,
    promptsIntro: cli
      ? 'Anything you would type yourself. Name the networks, the time and the source file, and Claude Code runs the command for you.'
      : `Anything you would ask a teammate. Name the channels, the timing and the tone, and ${n} handles the rest through ${b}.`,
    prompts: cli ? cliPrompts : assistantPrompts(item),
    channelsTitle: `Which networks can ${n} post to?`,
    channelsIntro: `Every network ${b} publishes to, ${channelCount} in total. Connect the accounts in ${b} once, then ${cli ? 'name them in a command' : `ask ${n} to post to any of them`}.`,
    compareTitle: `${n}, ${getIntegration(item.related[0])?.name} or ${getIntegration(item.related[1])?.name}: which one fits?`,
    compareIntro: `They connect in different ways, and the same workspace works with all of them. Pick the page that matches where you already work.`,
    costTitle: 'Cost, access and troubleshooting',
    cost,
    security:
      'The key belongs to one workspace and is listed with its last use; revoking it takes effect immediately. Agent activity is labelled in the audit trail, and limits per key and per channel stop a runaway loop.',
    troubleshooting: [
      `${n} can't see a channel: the key only reaches the workspace it was created in. Connect the account there, or use that workspace's key.`,
      cli
        ? 'Nothing went out: posts without an explicit time arrive as drafts. Approve them in the calendar, or pass a time.'
        : 'Nothing went out: agent output arrives as a draft. Approve it in the calendar.',
      'A publish failed: it is retried, then shown in the calendar with the platform error attached.',
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: `How do I connect ${n} to ${b}?`,
        answer: `${mcpKeyStep.body} ${item.steps[1].body}`,
      },
      {
        question: `What can ${n} do in ${b}?`,
        answer: cli
          ? 'Queue posts across every channel you name, with copy per network, read post bodies from a file or standard input, preview each channel with a dry run, and return machine-readable output for scripts.'
          : 'List your channels, draft posts, queue a week of them and reschedule what underperformed, all in the workspace its key belongs to.',
      },
      {
        question: `Will ${n} publish without asking me?`,
        answer: cli
          ? 'Not unless you give it a time. Anything created from the command line arrives as a draft unless it is explicitly scheduled, and approval settings apply to machines exactly as they do to people.'
          : 'No. Agent output lands as a draft by default, and nothing an agent writes publishes until a person approves it, unless you turn that off deliberately.',
      },
      {
        question: `Is it safe to give ${n} an API key?`,
        answer:
          'A key belongs to one workspace, so an agent cannot reach a workspace you did not share. Keys are listed with their last use, revoking one takes effect immediately, and every agent action is attributed in the audit trail.',
      },
      {
        question: `Can ${n} post on a schedule without me?`,
        answer: cli
          ? 'Yes: the command line authenticates from an environment variable, so it runs unattended in CI or a release script.'
          : `${n} works when you ask. For unattended runs, the command line authenticates from an environment variable and runs in CI, and the public API takes requests from any scheduler.`,
      },
      ...commonFaqTail,
    ],
    closingTitle: `Let ${n} fill the calendar, and keep the final say`,
    closingBody: cli
      ? `Connect Claude Code to ${b} and announce every release from the terminal that shipped it.`
      : `Connect ${n} to ${b} and plan a week of posts from one conversation.`,
    ctaLabel: `Connect ${n}`,
    footnote: cli
      ? `${b} is the scheduler Claude Code drives through the command line; posts without an explicit time arrive as drafts. Part of the [integrations guide](/integrations). Prefer a chat? See [Claude](/integrations/claude).`
      : `${b} schedules what ${n} drafts. Agent output arrives as a draft by default, so a person approves it before it publishes. Part of the [integrations guide](/integrations). Building your own? See the [developer docs](/developers).`,
  };
}
