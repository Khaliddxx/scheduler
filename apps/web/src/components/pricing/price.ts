import { priceFor, type Plan } from '@/content/pricing';

/**
 * Price formatting shared by the plan cards and the comparison's column headers.
 *
 * Prices are whole units in the plan's own currency, so the symbol comes from the
 * currency code rather than being hardcoded to a dollar sign. The locale is fixed
 * so the server and the client format identically and hydration stays quiet.
 */
export const money = (amount: number, currency: string): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * A plan with no published price on either period is quoted, not free. The
 * Dedicated tier carries `monthly: 0` precisely because its price depends on the
 * instance, so it must never render as "$0" — it shows "Custom" and its call to
 * action goes to contact rather than to sign-up. Deriving this from both periods
 * means the billing switch can never change where the button points.
 */
export const isQuoted = (plan: Plan): boolean =>
  priceFor(plan, 'monthly') === 0 && priceFor(plan, 'yearly') === 0;
