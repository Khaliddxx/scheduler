/**
 * Plans, the feature matrix behind them, and the billing copy.
 *
 * PRICING IS A COMMERCIAL DECISION, NOT A DESIGN ONE. The ladder below prices
 * ABOVE the upstream project, deliberately — see docs/05-pricing-and-packaging.md
 * for the reasoning. The short version: upstream charges $29-$99 for the same
 * software, there is no room beneath them, and the thing a customer is actually
 * buying from us (platform app registrations already approved, plus operations)
 * is the expensive part. Competing on price against the people who wrote the
 * software is the one strategy guaranteed to fail.
 *
 * Nothing else in the codebase hardcodes a price.
 *
 * Channel caps are enforced by the provisioning layer, not by the application:
 * the upstream build only enforces plan limits when a Stripe key is present, and
 * we deliberately do not set one. See packages/provisioning/src/limits.ts.
 */

export type BillingPeriod = 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  /** Monthly price in whole currency units, billed monthly. */
  monthly: number;
  /** Monthly-equivalent price when billed yearly. */
  yearlyMonthly: number;
  currency: string;
  /** Who this tier is for, shown under the price. */
  audience: string;
  /** Connectable channels included. */
  channels: number;
  /** Highlighted as the default choice. */
  popular?: boolean;
  /** Short bullets on the plan card, in display order. */
  highlights: string[];
  /** Label on the plan's call to action. */
  cta: string;
  /**
   * How this plan is fulfilled. `shared` places the customer as an organisation
   * on a shared application instance; `dedicated` provisions them their own.
   * This drives the provisioning driver chosen at checkout.
   */
  fulfilment: 'shared' | 'dedicated';
}

export const TRIAL_DAYS = 7;

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 39,
    yearlyMonthly: 33,
    currency: 'USD',
    audience: 'For solo creators finding a rhythm',
    channels: 5,
    cta: `Start ${TRIAL_DAYS}-day trial`,
    fulfilment: 'shared',
    highlights: [
      '5 connected channels',
      'Unlimited scheduled posts',
      'Visual calendar and queue',
      'AI drafting and image generation',
      'Analytics on every channel',
      'Public API and webhooks',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    monthly: 79,
    yearlyMonthly: 66,
    currency: 'USD',
    audience: 'For small teams running one brand',
    channels: 15,
    popular: true,
    cta: `Start ${TRIAL_DAYS}-day trial`,
    fulfilment: 'shared',
    highlights: [
      '15 connected channels',
      'Unlimited team members',
      'Approval workflow and roles',
      'Cross-posting and posting sets',
      'Auto-repeat and evergreen recycling',
      'Priority email support',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthly: 149,
    yearlyMonthly: 124,
    currency: 'USD',
    audience: 'For agencies juggling many clients',
    channels: 50,
    cta: `Start ${TRIAL_DAYS}-day trial`,
    fulfilment: 'shared',
    highlights: [
      '50 connected channels',
      'Client workspaces kept separate',
      'Per-client reporting',
      'Bulk scheduling and CSV import',
      'White-labelled reports',
      'Shared-inbox style assignment',
    ],
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    monthly: 0,
    yearlyMonthly: 0,
    currency: 'USD',
    audience: 'Your own isolated instance',
    channels: 0,
    cta: 'Talk to us',
    fulfilment: 'dedicated',
    highlights: [
      'A private instance, not a shared tenant',
      'Isolated data, database and storage',
      'No noisy-neighbour contention',
      'Choice of region for data residency',
      'Custom domain and full white-label',
      'Backups and an uptime commitment',
    ],
  },
];

export const popularPlan = plans.find((p) => p.popular) ?? plans[1];

export const priceFor = (plan: Plan, period: BillingPeriod): number =>
  period === 'yearly' ? plan.yearlyMonthly : plan.monthly;

/** Percentage saved by paying yearly, for the billing toggle badge. */
export const yearlySavingPct = (() => {
  const paid = plans.filter((p) => p.monthly > 0);
  if (!paid.length) return 0;
  const m = paid.reduce((s, p) => s + p.monthly, 0);
  const y = paid.reduce((s, p) => s + p.yearlyMonthly, 0);
  return Math.round(((m - y) / m) * 100);
})();

/* ------------------------------------------------------------------ */
/* Feature comparison matrix                                           */
/* ------------------------------------------------------------------ */

/** A cell is a tick, a cross, or a specific value such as a count. */
export type Cell = boolean | string | number;

export interface MatrixRow {
  label: string;
  hint?: string;
  values: Record<string, Cell>;
}

export interface MatrixSection {
  title: string;
  rows: MatrixRow[];
}

const V = (starter: Cell, studio: Cell, agency: Cell, dedicated: Cell) => ({
  starter,
  studio,
  agency,
  dedicated,
});

export const comparisonMatrix: MatrixSection[] = [
  {
    title: 'Publishing',
    rows: [
      {
        label: 'Connected channels',
        hint: 'One channel is one account on one network.',
        values: V(5, 15, 50, 'Unlimited'),
      },
      { label: 'Scheduled posts', values: V('Unlimited', 'Unlimited', 'Unlimited', 'Unlimited') },
      { label: 'Visual calendar', values: V(true, true, true, true) },
      { label: 'Cross-posting to every channel at once', values: V(true, true, true, true) },
      { label: 'Per-channel content overrides', values: V(true, true, true, true) },
      { label: 'Threads and scheduled first comments', values: V(true, true, true, true) },
      { label: 'Auto-repeat and evergreen recycling', values: V(false, true, true, true) },
      { label: 'Posting sets and signatures', values: V(false, true, true, true) },
      { label: 'Bulk scheduling and CSV import', values: V(false, false, true, true) },
      { label: 'RSS auto-posting', values: V(true, true, true, true) },
    ],
  },
  {
    title: 'AI and automation',
    rows: [
      { label: 'AI post drafting', values: V(true, true, true, true) },
      // TODO(licence): the in-app image editor is backed by the proprietary Polotno
      // SDK, which requires a paid commercial licence before this can be sold.
      // See docs/04-launch-checklist.md — this is a launch blocker, not a nicety.
      { label: 'AI image generation', values: V('50 / mo', '300 / mo', '1,000 / mo', 'Custom') },
      { label: 'Agent access over MCP', values: V(true, true, true, true) },
      { label: 'Command-line interface', values: V(true, true, true, true) },
      { label: 'Public REST API', values: V(true, true, true, true) },
      { label: 'Webhooks', values: V(true, true, true, true) },
      { label: 'n8n, Make and Zapier', values: V(true, true, true, true) },
    ],
  },
  {
    title: 'Teams',
    rows: [
      { label: 'Team members', values: V(1, 'Unlimited', 'Unlimited', 'Unlimited') },
      { label: 'Roles and permissions', values: V(false, true, true, true) },
      { label: 'Approval before publish', values: V(false, true, true, true) },
      { label: 'Separate client workspaces', values: V(false, false, true, true) },
    ],
  },
  {
    title: 'Measurement',
    rows: [
      { label: 'Per-post and per-channel analytics', values: V(true, true, true, true) },
      { label: 'Exportable reports', values: V(false, true, true, true) },
      { label: 'White-labelled client reports', values: V(false, false, true, true) },
    ],
  },
  {
    title: 'Platform',
    rows: [
      {
        label: 'Tenancy',
        hint: 'Dedicated means your own isolated instance, database and storage.',
        values: V('Shared', 'Shared', 'Shared', 'Dedicated instance'),
      },
      { label: 'Isolated infrastructure and data', values: V(false, false, false, true) },
      { label: 'Choice of hosting region', values: V(false, false, false, true) },
      { label: 'Custom domain', values: V(false, false, true, true) },
      { label: 'Nightly backups', values: V(true, true, true, true) },
      { label: 'Uptime commitment', values: V(false, false, false, true) },
    ],
  },
  {
    title: 'Support',
    rows: [
      { label: 'Email support', values: V(true, true, true, true) },
      { label: 'Priority response', values: V(false, true, true, true) },
      { label: 'Onboarding call', values: V(false, false, true, true) },
      { label: 'Named contact', values: V(false, false, false, true) },
    ],
  },
];

export const planColumns = plans.map((p) => ({ id: p.id, name: p.name }));
