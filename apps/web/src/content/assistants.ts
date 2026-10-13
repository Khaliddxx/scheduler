/**
 * The assistants a visitor can drive the calendar from, one card each, in the
 * order the cards appear.
 *
 * `clip` names a file in public/preview/ (see that folder's README); when it is
 * absent the card shows an empty frame instead of breaking. The card's mark is
 * looked up by `id` in components/sections/assistants-glyphs.tsx.
 */
export interface Assistant {
  id: string;
  /** Shown as "Via <name>". */
  via: string;
  body: string;
  clip: string;
}

export const assistants: Assistant[] = [
  {
    id: 'chatgpt',
    via: 'ChatGPT',
    body: "Ask for the week's posts in the chat you already have open. They arrive as drafts, formatted for each network.",
    clip: 'chatgpt',
  },
  {
    id: 'claude',
    via: 'Claude',
    body: 'Connect the MCP server once. Claude can read your channels, draft in your voice and schedule straight into the calendar.',
    clip: 'claude-mcp',
  },
  {
    id: 'claude-code',
    via: 'Claude Code',
    body: 'One command from the terminal publishes to every platform at once, with the copy adjusted per network.',
    clip: 'claude',
  },
  {
    id: 'grok-bot',
    via: 'Grok Bot',
    body: "Find last month's best post, turn it into a fresh one for another network, and queue it for tomorrow.",
    clip: 'grok-bot',
  },
  {
    id: 'hermes',
    via: 'Hermes / OpenClaw',
    body: 'Message your agent "create ten posts about…" and come back to a scheduled week.',
    clip: 'hermes',
  },
  {
    id: 'muse',
    via: 'Muse',
    body: 'Launching an offer? Describe it and get it turned into a run of posts, ready to approve.',
    clip: 'muse',
  },
];

/** The full-width card after the assistants: automation without an assistant. */
export const automation = {
  title: 'Automate the rest',
  body: 'Wire the calendar into n8n, Make, Zapier or the public API and let a workflow do the posting.',
  clip: 'api',
} as const;
