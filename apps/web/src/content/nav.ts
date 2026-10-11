/**
 * Navigation and footer structure.
 *
 * Links that point at the deployed application (login, register) are built from
 * the brand config so they follow the app URL rather than being hardcoded.
 */

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
      { label: 'Docs', href: '/docs', description: 'Setup and how-to guides' },
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
      { label: 'Documentation', href: '/docs' },
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
  {
    title: 'Open source',
    links: [
      { label: 'Licence and source', href: '/open-source' },
      { label: 'Self-host it yourself', href: '/open-source#self-host' },
    ],
  },
];
