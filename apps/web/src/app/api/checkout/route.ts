import { NextResponse } from 'next/server';
import { brand, siteUrl } from '@scheduler/brand';
import { plans, priceFor, TRIAL_DAYS, type BillingPeriod } from '@/content/pricing';
import { getProcessor } from '@/lib/billing';
import { PaymentProcessorError } from '@scheduler/provisioning';

/**
 * POST /api/checkout — start a hosted checkout.
 *
 * Returns a URL for the browser to follow. Deliberately does NOT create a
 * workspace: nothing is provisioned until the processor confirms payment via a
 * signed webhook. A checkout that is abandoned, declined or fraudulent must
 * leave no trace, and the only trustworthy signal that money moved is the
 * webhook — not the customer landing back on our success page, which anyone
 * can visit directly.
 */

export const runtime = 'nodejs';

interface Body {
  planId?: string;
  period?: BillingPeriod;
  email?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { planId, period = 'monthly', email } = body;

  if (!email || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (period !== 'monthly' && period !== 'yearly') {
    return NextResponse.json({ error: 'period must be monthly or yearly.' }, { status: 400 });
  }

  const plan = plans.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: 'Unknown plan.' }, { status: 400 });
  }

  // The quote-only tier must never reach a processor: there is no price to
  // charge, and sending 0 would create a free subscription that looks paid.
  if (plan.monthly === 0) {
    return NextResponse.json(
      { error: 'This plan is quoted individually. Use the contact form.', redirect: '/contact' },
      { status: 400 },
    );
  }

  // Our own id for this attempt. It is the idempotency key on the processor
  // call and the correlation key when the webhook comes back, so it has to be
  // generated here and survive the whole round trip.
  const requestId = crypto.randomUUID();
  const accountId = crypto.randomUUID();

  const amountMajor = priceFor(plan, period);

  try {
    const session = await getProcessor().createCheckout({
      planId: plan.id,
      period,
      // Minor units. Sending a float here is the classic way to charge
      // somebody 29 cents, or 2,900 dollars.
      price: { amount: Math.round(amountMajor * 100), currency: plan.currency },
      customerEmail: email,
      metadata: { accountId, planId: plan.id, fulfilment: plan.fulfilment, requestId },
      successUrl: siteUrl(`/welcome?ref=${requestId}`),
      cancelUrl: siteUrl('/pricing?checkout=cancelled'),
      trialDays: TRIAL_DAYS,
    });

    return NextResponse.json({ url: session.url, requestId });
  } catch (e) {
    if (e instanceof PaymentProcessorError) {
      // eslint-disable-next-line no-console
      console.error('[checkout] processor rejected', e.message, e.body);
      // Never surface the processor's message to the browser: it can carry
      // account identifiers and internal validation detail.
      return NextResponse.json(
        { error: `Checkout is temporarily unavailable. Please try again, or email ${brand.supportEmail}.` },
        { status: e.retryable ? 503 : 502 },
      );
    }
    // eslint-disable-next-line no-console
    console.error('[checkout] unexpected', e);
    return NextResponse.json({ error: 'Something went wrong starting checkout.' }, { status: 500 });
  }
}
