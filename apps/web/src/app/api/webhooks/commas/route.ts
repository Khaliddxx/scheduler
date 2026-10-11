import { NextResponse } from 'next/server';
import { getOrchestrator, getProcessor, isProductionStoreConfigured } from '@/lib/billing';

/**
 * POST /api/webhooks/commas — the only trusted signal that money moved.
 *
 * Four things matter here, and all four are easy to get wrong:
 *
 * 1. RAW BODY. The signature is computed over exact bytes. `request.json()`
 *    and re-serialising will not reproduce them, and verification will fail
 *    for correct payloads — or, worse, someone "fixes" it by skipping
 *    verification. We read text() and hand the string over untouched.
 *
 * 2. VERIFY BEFORE PARSE. An unverified body is attacker-controlled. Nothing
 *    looks at its contents until the signature checks out.
 *
 * 3. FAST ACKNOWLEDGEMENT. Provisioning is queued, not awaited. A handler that
 *    does minutes of work gets timed out and redelivered mid-flight, and the
 *    redelivery provisions a second workspace for one payment.
 *
 * 4. HONEST STATUS CODES. 2xx means "recorded, stop retrying". 5xx means "try
 *    again". A malformed or unrecognised event returns 200, because no number
 *    of retries will make it parseable and an infinite redelivery loop is
 *    worse than an alert.
 */

export const runtime = 'nodejs';
// Never cache a webhook.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const raw = await request.text();

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let processor;
  try {
    processor = getProcessor();
  } catch (e) {
    // Misconfiguration, not a bad request. Returning 500 makes the processor
    // retry, which is what we want once the secret is actually set.
    // eslint-disable-next-line no-console
    console.error('[webhook] processor not configured:', (e as Error).message);
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  const verified = await processor.verifyWebhook(raw, headers);

  if (!verified.ok || !verified.event) {
    // 400, not 500: a bad signature should not be retried, and it should be
    // noisy. Anyone who can reach this URL can try to forge a payment.
    // eslint-disable-next-line no-console
    console.warn('[webhook] rejected:', verified.reason);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (!isProductionStoreConfigured) {
    // eslint-disable-next-line no-console
    console.warn(
      '[webhook] running on the in-memory development store. Idempotency is ' +
        'NOT reliable across instances — do not take real payments like this.',
    );
  }

  const result = await getOrchestrator().handle(verified.event);

  // eslint-disable-next-line no-console
  console.info(
    `[webhook] ${verified.event.rawType} -> ${result.outcome}: ${result.detail}`,
  );

  return NextResponse.json(
    { outcome: result.outcome, detail: result.detail },
    { status: result.status },
  );
}

/** A GET is almost always a human checking the URL exists. Be useful. */
export async function GET() {
  return NextResponse.json({
    endpoint: 'commas webhook',
    method: 'POST',
    note: 'Signed requests only. Configure this URL in the processor dashboard.',
  });
}
