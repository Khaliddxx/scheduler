import { channelCount } from '@/content/channels';
import { TRIAL_DAYS } from '@/content/pricing';

/**
 * Page chrome for /pricing.
 *
 * Everything that is data — plan names, prices, bullets, the comparison matrix,
 * the FAQ — resolves from src/content. What is left is the page's own furniture:
 * a headline, a column label, a ribbon, four reassurance lines. None of it has a
 * content home yet, so it sits here as one named module rather than being
 * scattered through the markup, which makes moving it into src/content later a
 * one-file change (the same arrangement as the HEADING constant in
 * components/sections/capabilities.tsx).
 *
 * Every number is computed, never typed: the trial length and the channel count
 * come from content, so changing either updates this page with them.
 *
 * NOTE ON PAYMENTS. No line here names a payment provider, and no call to action
 * points at a checkout URL — plan CTAs go to the application's own sign-up. The
 * checkout is built outside this site against a provider's API, so the provider
 * can change without a copy edit here. Keep it that way.
 */

export const PAGE = {
  eyebrow: 'Pricing',
  title: 'One plan per stage, every network included',
  body: `Every plan publishes to all ${channelCount} networks, drafts with AI and opens the full API. Choose by how many channels you connect and how many people touch them.`,
  /** Meta description for the route. */
  description: `Plans for solo creators, teams and agencies. All ${channelCount} networks, AI drafting and the API on every tier, with a ${TRIAL_DAYS}-day trial.`,
} as const;

/** Marker on the plan the ladder is designed around. Used on the card and in the table. */
export const RIBBON = 'Most popular';

export const TOGGLE = {
  legend: 'Billing period',
  monthly: 'Monthly',
  yearly: 'Yearly',
  /** Prefixes the computed percentage on the yearly side. */
  savePrefix: 'Save',
} as const;

/** Sub-line under a plan's price, by billing period. */
export const PERIOD_NOTE = {
  monthly: 'billed monthly',
  yearly: 'billed yearly',
} as const;

/** Shown in place of a billing period on a plan that is quoted rather than priced. */
export const QUOTED_PRICE = 'Custom';
export const QUOTED_NOTE = 'by quote';

/** Where a quoted plan's call to action goes, instead of sign-up. */
export const CONTACT_HREF = '/contact';

export const TABLE = {
  eyebrow: 'Compare',
  title: 'What every plan includes',
  /** Accessible name for the table itself, announced before its contents. */
  caption: 'Feature comparison across all plans, by section',
  /** Header for the leftmost column of feature names. */
  featureColumn: 'Feature',
  included: 'Included',
  notIncluded: 'Not included',
} as const;

/** The strip under the table: four plain facts about paying, in display order. */
export const REASSURANCE: readonly string[] = [
  `${TRIAL_DAYS}-day trial on every plan`,
  'No charge during the trial',
  'Cancel any time',
  'Card handled by our payment processor',
];
