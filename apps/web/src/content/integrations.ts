/**
 * One record per integration landing page (/integrations/<slug>).
 *
 * These are the destinations behind the Integrations menu. The assistants
 * connect over the MCP server, the automation tools over the public REST API,
 * and feeds are read directly — the copy on each page says which, and the
 * three steps are the real shape of the setup rather than marketing filler.
 *
 * `clip`/`logo` name files in public/preview/ (see that folder's README) and
 * are optional: a page without them renders copy only.
 */
export type IntegrationKind = 'assistant' | 'automation' | 'feed';

export interface IntegrationStep {
  title: string;
  body: string;
}

export interface Integration {
  slug: string;
  name: string;
  kind: IntegrationKind;
  headline: string;
  summary: string;
  steps: [IntegrationStep, IntegrationStep, IntegrationStep];
  clip?: string;
  ratio?: string;
  logo?: string;
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
    clip: 'claude-mcp',
    ratio: '1320 / 920',
    logo: 'claude',
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
    clip: 'chatgpt',
    ratio: '1280 / 920',
    logo: 'chatgpt',
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
    clip: 'claude',
    ratio: '1280 / 920',
    logo: 'claude-code',
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
    logo: 'codex',
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
    logo: 'cursor',
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
  },
];

export const getIntegration = (slug: string): Integration | undefined =>
  integrations.find((item) => item.slug === slug);
