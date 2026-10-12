/**
 * The assistants a visitor can drive the calendar from, one card each.
 *
 * `clip` names a file in public/preview/ (see that folder's README) and `logo`
 * an SVG under public/preview/agents/. Either may be absent; the card then
 * renders without that piece rather than breaking.
 */
export interface Assistant {
  id: string;
  /** Shown as "Via <name>". */
  via: string;
  body: string;
  clip: string;
  /** CSS aspect-ratio of the clip, so the slot is sized before it loads. */
  ratio: string;
  logo: string;
  /** Logo tile background. Dark marks need a light tile and vice versa. */
  tile: 'light' | 'dark';
}

export const assistants: Assistant[] = [
  {
    id: 'chatgpt',
    via: 'ChatGPT',
    body: "Ask for the week's posts in the chat you already have open. They arrive as drafts, formatted for each network.",
    clip: 'chatgpt',
    ratio: '1280 / 920',
    logo: 'chatgpt',
    tile: 'light',
  },
  {
    id: 'claude',
    via: 'Claude',
    body: 'Connect the MCP server once. Claude can read your channels, draft in your voice and schedule straight into the calendar.',
    clip: 'claude-mcp',
    ratio: '1320 / 920',
    logo: 'claude',
    tile: 'light',
  },
  {
    id: 'claude-code',
    via: 'Claude Code',
    body: 'One command from the terminal publishes to every platform at once, with the copy adjusted per network.',
    clip: 'claude',
    ratio: '1280 / 920',
    logo: 'claude-code',
    tile: 'light',
  },
  {
    id: 'grok-bot',
    via: 'Grok Bot',
    body: "Find last month's best post, turn it into a fresh one for another network, and queue it for tomorrow.",
    clip: 'grok-bot',
    ratio: '1282 / 892',
    logo: 'grok-bot',
    tile: 'light',
  },
  {
    id: 'hermes',
    via: 'Hermes / OpenClaw',
    body: 'Message your agent "create ten posts about…" and come back to a scheduled week.',
    clip: 'hermes',
    ratio: '1280 / 892',
    logo: 'hermes',
    tile: 'light',
  },
  {
    id: 'muse',
    via: 'Muse',
    body: 'Launching an offer? Describe it and get it turned into a run of posts, ready to approve.',
    clip: 'muse',
    ratio: '1280 / 920',
    logo: 'muse',
    tile: 'light',
  },
];
