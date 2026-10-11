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
    id: 'rest',
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
