import { channelCount } from '@/content/channels';
import { plans, popularPlan, TRIAL_DAYS, yearlySavingPct } from '@/content/pricing';
import { money } from '@/components/pricing/price';

/** The lowest published monthly price, for the headline. Quoted plans (0) are skipped. */
const entryPlan = plans
  .filter((p) => p.monthly > 0)
  .reduce<(typeof plans)[number] | undefined>((min, p) => (!min || p.monthly < min.monthly ? p : min), undefined);
const fromPrice = entryPlan ? money(entryPlan.monthly, entryPlan.currency) : null;

/**
 * Page chrome for /pricing.
 *
 * Everything that is data — plan names, prices, bullets, the comparison matrix,
 * the FAQ — resolves from src/content. What is left is the page's own furniture:
 * a headline, a few labels, a badge, four reassurance lines. None of it has a
 * content home yet, so it sits here as one named module rather than being
 * scattered through the markup, which makes moving it into src/content later a
 * one-file change.
 *
 * Every number is computed, never typed: the trial length, the channel count and
 * the yearly saving come from content, so changing any of them updates this page.
 *
 * NOTE ON PAYMENTS. No line here names a payment provider, and no call to action
 * points at a checkout URL — plan CTAs go to the application's own sign-up. The
 * checkout is built outside this site against a provider's API, so the provider
 * can change without a copy edit here. Keep it that way.
 */

export const PAGE = {
  eyebrow: 'Pricing',
  /** The word in the hero headline drawn with a hand-drawn ring around it. */
  ringed: 'Pricing',
  title: 'One plan per stage, every network included',
  /** Follows "<brand> Pricing: " in the hero headline. */
  headline: fromPrice ? `every network from ${fromPrice}/month` : 'every network included',
  body: `Every plan publishes to all ${channelCount} networks, drafts with AI and opens the full API. Choose by how many channels you connect and how many people touch them.`,
  /** Meta description for the route. */
  description: `Plans for solo creators, teams and agencies. All ${channelCount} networks, AI drafting and the API on every tier, with a ${TRIAL_DAYS}-day trial.`,
} as const;

/** Badge on the plan the ladder is designed around, on its card and its column. */
export const RIBBON = 'Popular';

export const TOGGLE = {
  legend: 'Billing period',
  monthly: 'Monthly',
  yearly: 'Yearly',
} as const;

/** After a price on the plan cards. */
export const PER_MONTH_SUFFIX = '/mo';

/** Shown in place of a price on a plan that is quoted rather than priced. */
export const QUOTED_PRICE = 'Custom';
export const QUOTED_NOTE = 'by quote';

/** Where a quoted plan's call to action goes, instead of sign-up. */
export const CONTACT_HREF = '/contact';

export const TABLE = {
  title: 'What every plan includes',
  /** Under the heading below 1024px, where the plan column headers shrink to tabs. */
  intro: `Every plan ships all ${channelCount} networks and the full API. Pick by channel count, team size and how isolated your workspace needs to be.`,
  plansLabel: 'Plans:',
  saveNote:
    yearlySavingPct > 0
      ? `Save ${yearlySavingPct}% with yearly billing`
      : 'Pay monthly or yearly',
  /** Sub-line under each column's price: compact (tabs) and full (desktop). */
  period: {
    monthly: { short: 'month', long: 'per month' },
    yearly: { short: 'month, billed yearly', long: 'per month, billed yearly' },
  },
  /** Red note under a column whose plan has a single seat. */
  soloNote: 'One user, no team seats',
  /** Accessible name of the tab that switches the phone view to one plan. */
  showPlan: (name: string) => `Show the ${name} plan in the comparison`,
  /** Hidden text for the cell marks; the mark itself is decorative. */
  included: 'Included',
  notIncluded: 'Not included',
  unlimited: 'Unlimited',
  moreAbout: (label: string) => `About ${label}`,
} as const;

/** The sticky call to action pinned to the bottom of the screen below 1024px. */
export const STICKY_CTA = popularPlan.cta;

/** The line under the plan cards: four plain facts about paying, in display order. */
export const REASSURANCE: readonly string[] = [
  `${TRIAL_DAYS}-day trial on every plan`,
  'No charge during the trial',
  'Cancel any time',
  'Card handled by our payment processor',
];
