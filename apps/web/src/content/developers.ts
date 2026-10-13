/**
 * Copy for /developers.
 *
 * NOTE ON THE CODE SAMPLES. Every snippet below is labelled illustrative, and
 * that label is not modesty — it is accuracy. The endpoint paths, flag names and
 * event names here are the intended shape of the interface, not a published
 * contract, and the real reference lives with the application. Printing an exact
 * path on a marketing page is how you end up with customers quoting a URL at you
 * that never shipped.
 *
 * Commands and environment variables are derived from the brand name, so a rename
 * (brand.json -> `pnpm brand:apply`) carries the examples with it instead of
 * leaving a dead product name in a code block.
 */
import { brand } from '@scheduler/brand';
import { channelCount } from '@/content/channels';

/** `kolo` from "Kolo". Used as the CLI binary name in the examples. */
export const cliName = brand.name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

/** `KOLO` — the prefix for the example environment variables. */
export const envPrefix = brand.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_');

export const DEV = {
  eyebrow: 'Developers',
  title: 'Everything the calendar does, your code can do',
  body: `A REST API, outbound webhooks, an MCP server for agents and a command-line interface — on every plan, not as an enterprise upsell. Drive all ${channelCount} networks from a cron job, an n8n flow, a deploy script or an assistant you wrote yourself.`,
  description: `Automate ${brand.name}: REST API, signed webhooks, an MCP server for AI agents, and a CLI. Available on every plan.`,
} as const;

/** Honest framing printed above the code samples. */
export const SAMPLE_NOTICE =
  'The snippets on this page are illustrative. They show the shape of each interface — auth, payload, flags — not a frozen contract; exact paths, fields and event names live in the API reference that ships with the application.';

export interface Surface {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}

export const SURFACES: Surface[] = [
  {
    id: 'api',
    eyebrow: 'REST API',
    title: 'The API the application itself uses',
    body: 'Create, read, update, schedule and delete posts; list channels; upload media; pull analytics. It is the same interface the calendar in your browser talks to, so there is no second-class subset for integrators.',
    points: [
      'Workspace-scoped API keys, created and revoked in settings, sent as a bearer token.',
      'JSON in, JSON out, with a predictable error body carrying the platform error when a publish fails.',
      'One request can target many channels at once, with per-channel content overrides in the same payload.',
      'Idempotency keys on create calls, so a retried request does not publish twice.',
      'Cursor pagination on list endpoints, and rate limits returned in response headers rather than guessed.',
    ],
  },
  {
    id: 'webhooks',
    eyebrow: 'Webhooks',
    title: 'Find out the moment something goes out — or does not',
    body: 'Register an endpoint and receive a signed POST when a post publishes, fails, is approved, or when a channel needs reconnecting. Polling an API to find out whether your Tuesday post went out is a waste of both our time.',
    points: [
      'Published, failed, approval-requested, approved and rejected events, plus channel disconnected and token expiring.',
      'HMAC-SHA256 signature over the raw request body with a timestamp, so a captured delivery cannot be replayed.',
      'Verify the signature before parsing the body. Parsing first means acting on structure an attacker controls.',
      'Automatic retry with backoff on a non-2xx response, and a delivery log you can inspect.',
      'Your endpoint should be idempotent: at-least-once delivery means a duplicate is possible.',
    ],
  },
  {
    id: 'mcp',
    eyebrow: 'MCP server',
    title: 'Let an agent hold the calendar',
    body: 'A Model Context Protocol server, so any MCP-speaking assistant can list your channels, draft a post, queue a week of them and reschedule what underperformed — without you writing glue code for its tool calls.',
    points: [
      'Works with any MCP client: desktop assistants, editors, or your own agent loop.',
      'Scoped to one workspace by the key you give it, so an agent cannot reach a client workspace you did not share.',
      'Agent output lands as a draft by default. Nothing an agent writes publishes until a human approves it, unless you turn that off deliberately.',
      'Every agent action is attributed in the workspace audit trail, so you can see what was machine-made.',
    ],
  },
  {
    id: 'cli',
    eyebrow: 'CLI',
    title: 'One command, from wherever you already are',
    body: 'Queue a post from a terminal, a Makefile, a CI job or a release script. Shipped a version? Announce it in the same pipeline that shipped it.',
    points: [
      'Authenticates from an environment variable, so it runs unattended in CI.',
      'Reads post bodies from a file or standard input, which makes templating someone else’s problem — and therefore easy.',
      'A dry-run flag that renders exactly what would be published per channel, without publishing it.',
      'Machine-readable output for scripting, human-readable by default.',
    ],
  },
];

export interface Sample {
  id: string;
  label: string;
  language: string;
  code: string;
}

export const SAMPLES: Sample[] = [
  {
    id: 'curl',
    label: 'Schedule one post across several channels',
    language: 'bash',
    code: `# Illustrative. Paths and field names are in the API reference.
curl -X POST "$${envPrefix}_API_BASE/v1/posts" \\
  -H "Authorization: Bearer $${envPrefix}_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: release-4.2.0-announce" \\
  -d '{
    "publishAt": "2026-11-03T09:00:00Z",
    "channels": ["ch_x_main", "ch_linkedin_page", "ch_mastodon"],
    "content": { "text": "4.2 is out. Changelog in the first comment." },
    "overrides": {
      "ch_linkedin_page": { "text": "Version 4.2 is live. What changed, and why:" }
    },
    "firstComment": { "text": "Full changelog: https://example.com/changelog" }
  }'`,
  },
  {
    id: 'cli',
    label: 'Announce a release from your deploy pipeline',
    language: 'bash',
    code: `# Illustrative. Run \`${cliName} post --help\` for the real flags.
export ${envPrefix}_API_KEY="…"

${cliName} post \\
  --from release-notes.md \\
  --channels x,linkedin,mastodon \\
  --at "2026-11-03 09:00 Europe/London" \\
  --first-comment "Changelog: https://example.com/changelog" \\
  --dry-run`,
  },
  {
    id: 'mcp',
    label: 'Point an MCP client at your workspace',
    language: 'json',
    code: `// Illustrative MCP client configuration.
{
  "mcpServers": {
    "${cliName}": {
      "command": "npx",
      "args": ["-y", "@${cliName}/mcp"],
      "env": {
        "${envPrefix}_API_KEY": "\${${envPrefix}_API_KEY}"
      }
    }
  }
}`,
  },
];

export const GUARDRAILS = {
  eyebrow: 'Guardrails',
  title: 'Automation you can hand to an agent without flinching',
  body: 'The point of agent access is that it writes for you. The point of these defaults is that it cannot embarrass you while doing it.',
  items: [
    {
      title: 'Drafts by default',
      body: 'Anything created through the API, CLI or MCP server arrives as a draft unless it is explicitly scheduled. Approval settings apply to machines exactly as they do to people.',
    },
    {
      title: 'Scoped keys',
      body: 'A key belongs to one workspace. An agency can give an agent one client without handing it the other forty-nine.',
    },
    {
      title: 'Revocable, and visible',
      body: 'Keys are listed with their last use, and revoking one takes effect immediately. Agent activity is labelled in the audit trail.',
    },
    {
      title: 'Rate limits that protect you',
      body: 'Limits exist per key and per channel. A runaway loop hits a limit and reports it, instead of burning your platform rate limit and tripping an automation flag on your account.',
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Page blocks                                                         */
/* ------------------------------------------------------------------ */
/*
 * Copy for the blocks of /developers beyond the surfaces above. Each line
 * restates something SURFACES, GUARDRAILS or DEV already says; nothing here
 * adds an endpoint, a limit or a capability.
 */

export const DEV_PAGE = {
  badge: `${brand.name} for developers`,
  heroNote:
    'Anything created through the API, CLI or MCP server arrives as a draft unless it is explicitly scheduled, so a person stays between an agent and your audience.',

  buildTitle: `What can you build on ${brand.name}?`,
  buildIntro: `Four ways in, one workspace key. The same interface the calendar in your browser talks to, so a cron job, an n8n flow, a deploy script or an assistant you wrote yourself can do what a person can do — on all ${channelCount} networks.`,
  build: [
    { icon: 'code', title: 'REST API', href: '#api', description: 'Create, read, update, schedule and delete posts; list channels; upload media; pull analytics.' },
    { icon: 'zap', title: 'Webhooks', href: '#webhooks', description: 'A signed POST when a post publishes, fails or is approved, or when a channel needs reconnecting.' },
    { icon: 'plug', title: 'MCP server', href: '#mcp', description: 'Any MCP-speaking assistant can list channels, draft posts, queue a week and reschedule what underperformed.' },
    { icon: 'terminal', title: 'Command line', href: '#cli', description: 'Queue a post from a terminal, a Makefile, a CI job or a release script, with a dry run first.' },
    { icon: 'globe', title: `All ${channelCount} networks`, description: 'One request can target many channels at once, with per-channel content overrides in the same payload.' },
    { icon: 'dollar', title: 'On every plan', description: 'The API, webhooks, MCP server and CLI come with every plan, not as an enterprise upsell.' },
  ],

  tableTitle: 'Which surface fits the job?',
  tableIntro:
    'All four share the same workspace-scoped key and the same approval rules. Pick by who starts the conversation: your code, the platform, an assistant, or a person at a terminal.',
  table: {
    head: ['', 'REST API', 'Webhooks', 'MCP server', 'Command line'],
    rows: [
      ['Who calls whom', 'Your code calls it', 'It calls your endpoint', 'An assistant calls it', 'You or your pipeline run it'],
      ['Use it for', 'Automation tools and your own services', 'Reacting when something goes out, or does not', 'Asking for posts in plain language', 'Announcing a release from the pipeline that shipped it'],
      ['Authentication', 'Workspace API key as a bearer token', 'HMAC-SHA256 signature with a timestamp', 'Workspace API key', 'API key from an environment variable'],
      ['Good to know', 'Idempotency keys, cursor pagination, rate limits in headers', 'Retried with backoff; delivery is at least once', 'Every agent action labelled in the audit trail', 'Dry-run flag; machine-readable output'],
      ['Plans', 'Every plan', 'Every plan', 'Every plan', 'Every plan'],
    ],
    highlight: 3,
  },

  connectTitle: 'How do I connect an agent to the MCP server?',
  connectIntro:
    'Create a key, add the server to the assistant you already use, then ask. Whatever the agent writes lands in the calendar as a draft for a person to approve.',
  connectSteps: [
    'Create a key. In Settings → API, generate a key scoped to the workspace the agent should see.',
    'Add the server. Give your MCP client the server URL and the key.',
    'Ask. Request a post, or a week of them, in plain language.',
    'Approve. Each post waits in the calendar as a draft until someone approves it.',
  ],
  connectCard: {
    title: 'Point an MCP client at your workspace',
    body: 'Add the server and your workspace key to any MCP client: a desktop assistant, an editor, or your own agent loop.',
    note: 'Illustrative configuration: exact names live in the reference that ships with the application.',
  },
  askCard: {
    title: 'Ask your agent to post',
    body: 'Ask in plain language. The agent lists your channels, drafts the posts and places them on the calendar for review.',
    user: 'Draft a week of posts about our launch for LinkedIn and X, one each weekday at 9am.',
    reply: 'Done. Five drafts are in the calendar for Monday to Friday at 9:00. Approve them there and they go out on time.',
    via: ['linkedin', 'x'],
    alsoTry: ['List my channels', 'Queue a week of posts', 'Reschedule what underperformed'],
  },
  setupTitle: 'Setup by tool',
  setupIntro:
    'Assistants connect to the MCP server, automation tools to the public API, and feeds are read directly. Each tool has its own page with the steps.',
  noMcpTitle: 'Using a tool that does not speak MCP?',

  orbitTitle: 'One key reaches every channel you run',
  orbitBody: `Connect your accounts in ${brand.name} once. From then on your code, your workflows and your agents can post to any of them, and ${brand.name} publishes at the time you set.`,

  surfacesTitle: 'Every surface, in detail',

  askTitle: `What can you ask an agent connected to ${brand.name}?`,
  askIntro:
    'Anything you would ask a teammate who runs the calendar. Once connected there are no commands to learn: ask in plain language and the agent picks the tools.',
  chats: [
    {
      user: 'Turn these release notes into a post for X and LinkedIn and queue it for Tuesday at 9am.',
      reply: 'Two drafts are in the calendar for Tuesday at 9:00, one written for each network. Approve them there to publish.',
      via: ['x', 'linkedin'],
    },
    {
      user: 'List the channels in this workspace.',
      reply: 'This workspace has LinkedIn, X, Instagram and Mastodon connected. Which ones should the launch week go to?',
      via: ['linkedin', 'x', 'instagram', 'mastodon'],
    },
    {
      user: "Find last week's posts that underperformed and reschedule reworked versions for next week.",
      reply: 'Reworked three posts and moved them to next Tuesday to Thursday. They are waiting as drafts for your approval.',
      via: ['x', 'bluesky'],
    },
  ],

  channelsTitle: 'Which networks can your code post to?',
  channelsIntro: `Every network ${brand.name} publishes to, ${channelCount} in total. Connect the accounts once and any surface can reach them.`,

  faqTitle: 'Developer FAQ',
  faq: [
    { question: 'Is the API on every plan?', answer: 'Yes. The REST API, webhooks, MCP server and CLI are on every plan, not as an enterprise upsell.' },
    { question: 'How do requests authenticate?', answer: 'With a workspace-scoped API key, created and revoked in settings and sent as a bearer token. The CLI reads the key from an environment variable, so it runs unattended in CI.' },
    { question: 'Which assistants can use the MCP server?', answer: 'Any MCP client: desktop assistants, editors, or your own agent loop. Claude, ChatGPT, Codex, Cursor and Gemini each have a setup page, and Claude Code drives the command line.' },
    { question: 'Will an agent publish without approval?', answer: 'No. Anything created through the API, CLI or MCP server arrives as a draft unless it is explicitly scheduled, and approval settings apply to machines exactly as they do to people. You can turn that off deliberately.' },
    { question: 'How are webhooks signed?', answer: 'With an HMAC-SHA256 signature over the raw request body and a timestamp, so a captured delivery cannot be replayed. Verify the signature before parsing the body.' },
    { question: 'Can a retried request publish twice?', answer: 'Not if it carries an idempotency key: create calls accept one, so a retried request does not publish twice.' },
    { question: 'Are there rate limits?', answer: 'Yes, per key and per channel, returned in response headers. A runaway loop hits a limit and reports it, instead of burning your platform rate limit.' },
    { question: 'What happens when a publish fails?', answer: 'The API returns a predictable error body carrying the platform error, and a failed event goes to your registered webhooks.' },
    { question: 'Where are the exact endpoints documented?', answer: 'In the API reference that ships with the application. The snippets on this page show the shape of each interface — auth, payload, flags — not a frozen contract.' },
  ],

  guidesTitle: 'Guides for every integration',
  guidesIntro: 'Each page covers setup, example requests and the networks it can reach. Assistants use the MCP server; automation tools use the public API.',

  closingTitle: 'Let your agents fill the calendar, and keep the final say',
  closingBody: 'Get a key and connect an assistant, a script or an automation tool. It comes with every plan.',
} as const;
