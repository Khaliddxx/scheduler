/**
 * Navigation and footer structure.
 *
 * Links that point at the deployed application (login, register) are built from
 * the brand config so they follow the app URL rather than being hardcoded.
 */

import { docsUrl } from '@scheduler/brand';

const isExternal = (href: string): boolean => /^https?:\/\//.test(href);

export interface NavLink {
  label: string;
  href: string;
  /** Opens in a new tab and gets rel="noopener". */
  external?: boolean;
  description?: string;
}

export interface NavGroup {
  label: string;
  /** A group with children renders as a dropdown; without, a plain link. */
  href?: string;
  children?: NavLink[];
}

export const primaryNav: NavGroup[] = [
  {
    label: 'Product',
    children: [
      { label: 'How it works', href: '/#how-it-works', description: 'Write once, publish everywhere' },
      { label: 'Channels', href: '/channels', description: 'Every network you can publish to' },
      { label: 'For agencies', href: '/agencies', description: 'Client workspaces and approvals' },
      { label: 'Automation and API', href: '/developers', description: 'REST, webhooks, MCP and CLI' },
    ],
  },
  { label: 'Channels', href: '/channels' },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Resources',
    children: [
      { label: 'Docs', href: docsUrl(), external: isExternal(docsUrl()), description: 'Setup and how-to guides' },
      { label: 'Compare', href: '/compare', description: 'How we differ from the alternatives' },
      { label: 'Open source', href: '/open-source', description: 'The engine under the hood' },
    ],
  },
  { label: 'About', href: '/about' },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Channels', href: '/channels' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'For agencies', href: '/agencies' },
      { label: 'Developers and API', href: '/developers' },
      { label: 'Compare', href: '/compare' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: docsUrl(), external: isExternal(docsUrl()) },
      { label: 'Licence and source', href: '/open-source' },
      { label: 'Self-host it yourself', href: '/open-source#self-host' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms of service', href: '/legal/terms' },
      { label: 'Privacy policy', href: '/legal/privacy' },
      { label: 'Sub-processors', href: '/legal/sub-processors' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Mega-menu                                                           */
/* ------------------------------------------------------------------ */

/**
 * The agent/integration menu.
 *
 * A wide three-column panel rather than a short list, because breadth IS the
 * pitch here: the point of the menu is that a visitor sees twenty-odd names
 * they recognise and concludes "it works with what I already use" before
 * reading a word of copy.
 */
export interface MenuItem {
  label: string;
  href: string;
  /** Key resolved to a glyph by components/ui/integration-glyph.tsx. */
  glyph: string;
}

export const agentMenu: MenuItem[] = [
  { label: 'Claude', href: '/integrations/claude', glyph: 'claude' },
  { label: 'ChatGPT', href: '/integrations/chatgpt', glyph: 'openai' },
  { label: 'Claude Code', href: '/integrations/claude-code', glyph: 'terminal' },
  { label: 'Codex', href: '/integrations/codex', glyph: 'openai' },
  { label: 'Cursor', href: '/integrations/cursor', glyph: 'cursor' },
  { label: 'Gemini', href: '/integrations/gemini', glyph: 'sparkle' },
  { label: 'MCP server', href: '/developers#mcp', glyph: 'plug' },
  { label: 'Command line', href: '/developers#cli', glyph: 'terminal' },
  { label: 'Public API', href: '/developers#api', glyph: 'braces' },
  { label: 'Webhooks', href: '/developers#webhooks', glyph: 'webhook' },
  { label: 'n8n', href: '/integrations/n8n', glyph: 'workflow' },
  { label: 'Make.com', href: '/integrations/make', glyph: 'workflow' },
  { label: 'Zapier', href: '/integrations/zapier', glyph: 'bolt' },
  { label: 'RSS feeds', href: '/integrations/rss', glyph: 'rss' },
  { label: 'Agent CLI', href: '/developers#cli', glyph: 'braces' },
];

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

/** One entry in the header bar: a plain link, or the trigger for a mega-menu. */
export interface HeaderNavEntry {
  label: string;
  href?: string;
  menu?: 'agents' | 'channels';
}

/**
 * Header bar, in the reference design's order. Its "News" and "Blog" entries
 * are left out because this site has no such pages.
 */
export const headerNav: HeaderNavEntry[] = [
  { label: 'AI Agents', menu: 'agents' },
  { label: 'Dev Docs', href: docsUrl() },
  { label: 'Channels', menu: 'channels' },
  { label: 'Pricing', href: '/pricing' },
];

/** An entry in the "AI Agents" mega-menu. */
export interface AgentMenuEntry {
  label: string;
  href: string;
  /** File name (no extension) in public/preview/agents/. */
  logo: string;
  /**
   * The SVG draws its own rounded tile, so it gets no extra ring. True for the
   * marks the reference draws inline rather than as image tiles.
   */
  ownTile?: boolean;
}

/**
 * The "AI Agents" mega-menu: the reference design's 22 assistants in its
 * order. Those with a page of their own link to it; the rest go to the
 * integrations index, which explains the MCP connection they all share.
 */
export const agentsMenu: AgentMenuEntry[] = [
  { label: 'ChatGPT', href: '/integrations/chatgpt', logo: 'chatgpt' },
  { label: 'OpenAI dots', href: '/integrations', logo: 'dots' },
  { label: 'Claude', href: '/integrations/claude', logo: 'claude' },
  { label: 'Claude Cowork', href: '/integrations', logo: 'claude-cowork' },
  { label: 'Claude Code', href: '/integrations/claude-code', logo: 'claude-code' },
  { label: 'Codex', href: '/integrations/codex', logo: 'codex' },
  { label: 'Cursor', href: '/integrations/cursor', logo: 'cursor' },
  { label: 'Gemini', href: '/integrations/gemini', logo: 'gemini', ownTile: true },
  { label: 'OpenClaw', href: '/integrations', logo: 'openclaw' },
  { label: 'Hermes Agent', href: '/integrations', logo: 'hermes' },
  { label: 'Grok Bot', href: '/integrations', logo: 'grok-bot' },
  { label: 'Grok Build', href: '/integrations', logo: 'grok-build' },
  { label: 'DeepSeek', href: '/integrations', logo: 'deepseek', ownTile: true },
  { label: 'Kimi K3', href: '/integrations', logo: 'kimi', ownTile: true },
  { label: 'Muse', href: '/integrations', logo: 'muse' },
  { label: 'Manus', href: '/integrations', logo: 'manus' },
  { label: 'Cue', href: '/integrations', logo: 'cue' },
  { label: 'Perplexity Computer', href: '/integrations', logo: 'perplexity' },
  { label: 'nanoclaw', href: '/integrations', logo: 'nanoclaw' },
  { label: 'Paperclip', href: '/integrations', logo: 'paperclip' },
  { label: 'MCP Server', href: '/developers#mcp', logo: 'mcp' },
  { label: 'AI Agents CLI', href: '/developers#cli', logo: 'terminal' },
];

/**
 * Order of the "Channels" mega-menu (the reference design's menu order, which
 * differs from its hero order). Only channels we sell are shown; one missing
 * from this list goes last.
 */
export const channelMenuOrder: string[] = [
  'facebook', 'instagram', 'threads', 'linkedin', 'bluesky', 'x', 'tiktok',
  'youtube', 'google-my-business', 'reddit', 'telegram', 'discord', 'slack',
  'pinterest', 'dribbble', 'mastodon', 'warpcast', 'vk', 'lemmy', 'nostr',
  'listmonk', 'wordpress', 'medium', 'hashnode', 'devto',
];

/**
 * Shorter labels for the "Channels" menu, where a long name would run into
 * the next column of the two-column mobile list.
 */
export const channelMenuLabels: Record<string, string> = {
  'google-my-business': 'Google Business',
};

