/**
 * Commas (commas.com) payment adapter.
 *
 * Written against the live API reference at commasdocs.com and verified with
 * probes against the production host. The things that matter, up front,
 * because several are unusual and two of them will lose you money if missed:
 *
 *   HOST        https://www.fanbasis.com/public-api
 *               Commas is the FanBasis rebrand; the API never moved. The apex
 *               fanbasis.com 301-redirects, which silently breaks POSTs, so the
 *               `www.` is load-bearing. Sandbox is a different host entirely.
 *
 *   AUTH        A single seller key in `x-api-key`. Not a publishable/secret
 *               pair, not OAuth, not Bearer. There is nothing safe to put in a
 *               browser.
 *
 *   NO CATALOG  There are no Product/Price objects. The checkout session IS the
 *               offer: it carries the amount and the billing cadence, expressed
 *               as an integer number of days.
 *
 *   NO PORTAL   There is no hosted billing portal. Self-service cancellation is
 *               ours to build, server-side, against the cancel endpoint.
 *
 *   NO CANCEL   There is a success_url but no cancel_url. An abandoned checkout
 *   URL         simply never comes back, so the UI cannot rely on one.
 *
 *   AT-MOST-    ⚠ THE BIG ONE. A webhook delivery that fails is logged and
 *   ONCE        NEVER retried. No backoff, no redelivery queue. One cold start
 *               during a payment burst permanently loses a paid signup.
 *               Webhooks are therefore a fast path, not a source of truth:
 *               `reconcile()` below exists because of this and must be run on a
 *               schedule. Do not skip it.
 *
 *   SIGNATURE   HMAC-SHA256 hex of the raw body in `x-webhook-signature`, with
 *               NO timestamp and therefore no built-in replay protection.
 *               Rejecting stale events is our job, done here against the
 *               envelope's own `created_at`.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
  BillingEvent,
  BillingEventType,
  CheckoutRequest,
  CheckoutSession,
  PaymentProcessor,
  VerifyResult,
} from './port';
import { PaymentProcessorError } from './port';
import type { CheckoutMetadata } from '../types';

/* ------------------------------------------------------------------ */
/* Wire contract                                                       */
/* ------------------------------------------------------------------ */

export const WIRE = {
  /** Production. The `www.` matters — the apex redirects and breaks POSTs. */
  baseUrl: process.env.COMMAS_API_BASE ?? 'https://www.fanbasis.com/public-api',
  /** Sandbox lives on a different host, with its own dashboard and keys. */
  sandboxUrl: 'https://api-sandbox.commas.net',

  authHeader: 'x-api-key',

  endpoints: {
    createCheckout: '/checkout-sessions',
    getCheckout: (id: string) => `/checkout-sessions/${id}`,
    transactions: '/checkout-sessions/transactions',
    cancelSubscription: (sessionId: string, subscriptionId: string) =>
      `/checkout-sessions/${sessionId}/subscriptions/${subscriptionId}`,
  },

  webhook: {
    signatureHeader: 'x-webhook-signature',
    algorithm: 'sha256' as const,
    /**
     * Our own replay window, applied to the envelope's `created_at`. The
     * signature carries no timestamp, so without this a captured body stays
     * valid forever.
     */
    toleranceSeconds: 300,
  },

  /** The 14 documented event names, mapped onto our closed set. */
  eventMap: {
    'payment.succeeded': 'checkout.completed',
    'product.purchased': 'checkout.completed',
    'subscription.created': 'subscription.started',
    'subscription.renewed': 'subscription.renewed',
    'subscription.recovered': 'subscription.renewed',
    'payment.failed': 'subscription.payment_failed',
    'subscription.past_due': 'subscription.payment_failed',
    // One L in the EVENT name, two in the STATUS value. Both are live in this
    // API and mixing them up means cancellations are silently ignored.
    'subscription.canceled': 'subscription.cancelled',
    'subscription.completed': 'subscription.expired',
    'payment.expired': 'subscription.expired',
    'payment.canceled': 'subscription.cancelled',
    'refund.created': 'refund.issued',
    'dispute.created': 'refund.issued',
    'dispute.updated': 'unknown',
  } as Record<string, BillingEventType>,

  /** Rejected below 100. A 99-cent plan is not a plan here. */
  minimumAmountCents: 100,
};

/* ------------------------------------------------------------------ */
/* Adapter                                                             */
/* ------------------------------------------------------------------ */

export interface CommasConfig {
  apiKey: string;
  webhookSecret: string;
  /** Use the sandbox host. Keys are per-environment and are not interchangeable. */
  sandbox?: boolean;
  /** Per-session webhook override; otherwise the dashboard setting applies. */
  webhookUrl?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

interface CommasEnvelope {
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
  request_id?: string;
}

export class CommasProcessor implements PaymentProcessor {
  readonly name = 'commas';

  readonly capabilities = {
    /** `subscription.free_trial_days` — a real trial before the first charge. */
    nativeTrials: true,
    /** Confirmed absent. Build cancellation yourself. */
    customerPortal: false,
    subscriptions: true,
    refunds: true,
  };

  private readonly fetch: typeof fetch;

  constructor(private readonly config: CommasConfig) {
    if (!config.apiKey) throw new PaymentProcessorError('COMMAS_API_KEY is not set');
    if (!config.webhookSecret) {
      // Without this, anyone who learns the webhook URL can forge a payment and
      // provision themselves a free workspace.
      throw new PaymentProcessorError('COMMAS_WEBHOOK_SECRET is not set');
    }
    this.fetch = config.fetchImpl ?? globalThis.fetch;
  }

  private url(path: string): string {
    const base =
      this.config.baseUrl ?? (this.config.sandbox ? WIRE.sandboxUrl : WIRE.baseUrl);
    return `${base.replace(/\/$/, '')}${path}`;
  }

  private async call<T = CommasEnvelope>(
    path: string,
    init: { method: string; body?: unknown },
  ): Promise<T> {
    let res: Response;
    try {
      res = await this.fetch(this.url(path), {
        method: init.method,
        headers: {
          [WIRE.authHeader]: this.config.apiKey,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        // Never follow a redirect on a write: the apex host 301s, and a
        // redirected POST silently becomes a GET and loses the body.
        redirect: 'error',
      });
    } catch (e) {
      throw new PaymentProcessorError(
        `Could not reach Commas: ${(e as Error).message}. ` +
          'If this says "redirect", check the base URL includes www.',
        undefined,
        undefined,
        true,
      );
    }

    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      /* keep the text for the error below */
    }

    if (!res.ok) {
      const msg =
        (parsed as CommasEnvelope)?.message ?? `HTTP ${res.status}`;
      throw new PaymentProcessorError(
        `Commas ${init.method} ${path} failed: ${msg}`,
        res.status,
        parsed,
        res.status >= 500 || res.status === 429,
      );
    }
    return parsed as T;
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutSession> {
    if (req.price.amount < WIRE.minimumAmountCents) {
      throw new PaymentProcessorError(
        `Commas rejects charges under ${WIRE.minimumAmountCents} cents ` +
          `(got ${req.price.amount}).`,
      );
    }

    // Every metadata value must be a string. Numbers, booleans and nested
    // objects are rejected outright, so coerce rather than discovering it at
    // the moment someone is trying to pay.
    const metadata: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.metadata)) {
      if (v !== undefined && v !== null) metadata[k] = String(v);
    }

    const body: Record<string, unknown> = {
      product: {
        title: `${req.planId} plan`.slice(0, 255),
        description: `${req.period === 'yearly' ? 'Yearly' : 'Monthly'} subscription`,
      },
      amount_cents: req.price.amount,
      type: 'subscription',
      subscription: {
        // Expressed in days, not a named interval. 30 and 365 are the
        // conventional values; the webhook will report it back as a word.
        frequency_days: req.period === 'yearly' ? 365 : 30,
        ...(req.trialDays ? { free_trial_days: req.trialDays } : {}),
      },
      metadata,
      // NOTE: there is no cancel_url. An abandoned checkout never returns, so
      // the UI must not wait for one.
      success_url: req.successUrl,
      ...(this.config.webhookUrl ? { webhook_url: this.config.webhookUrl } : {}),
    };

    const res = await this.call(WIRE.endpoints.createCheckout, {
      method: 'POST',
      body,
    });

    const data = res.data ?? {};
    const link = typeof data.payment_link === 'string' ? data.payment_link : undefined;
    const id =
      typeof data.id === 'string'
        ? data.id
        : data.checkout_session_id !== undefined
          ? String(data.checkout_session_id)
          : undefined;

    if (!link) {
      throw new PaymentProcessorError(
        'Commas returned no payment_link. The response shape has changed — ' +
          'check commasdocs.com § Create a Checkout Session and update WIRE.',
        undefined,
        res,
      );
    }

    return { url: link, id: id ?? req.metadata.requestId };
  }

  /**
   * Verify an inbound webhook.
   *
   * Signed payload is the raw body alone — no timestamp prefix, no version
   * tag. So replay protection is added here against the envelope's own
   * `created_at`, which is the best available signal.
   */
  async verifyWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<VerifyResult> {
    const lower: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = v;

    const signature = lower[WIRE.webhook.signatureHeader];
    if (!signature) {
      return { ok: false, reason: `missing ${WIRE.webhook.signatureHeader} header` };
    }

    const expected = createHmac(WIRE.webhook.algorithm, this.config.webhookSecret)
      .update(rawBody, 'utf8')
      .digest('hex');

    // Length-guard first. timingSafeEqual throws on a length mismatch, and a
    // malformed header must fail validation rather than crash the endpoint.
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature.trim(), 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: 'signature mismatch' };
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return { ok: false, reason: 'body is not valid JSON' };
    }

    const event = normaliseEvent(payload);

    // Replay window. Only applied to events that GRANT access — a late
    // cancellation or refund is still worth processing, whereas a replayed
    // payment is how somebody gets a free workspace.
    const grantsAccess =
      event.type === 'checkout.completed' ||
      event.type === 'subscription.started' ||
      event.type === 'subscription.renewed';

    if (grantsAccess && event.occurredAt) {
      const age = (Date.now() - new Date(event.occurredAt).getTime()) / 1000;
      if (Number.isFinite(age) && Math.abs(age) > WIRE.webhook.toleranceSeconds) {
        return {
          ok: false,
          reason: `access-granting event is ${Math.round(age)}s old, outside the replay window`,
        };
      }
    }

    return { ok: true, event };
  }

  /**
   * Cancel a subscription.
   *
   * Takes BOTH the checkout-session id and the numeric subscription id,
   * because the endpoint is nested under the session. Cancellation is
   * immediate in the sense that auto-renew stops; access normally runs to the
   * end of the paid period, which is why the orchestrator suspends on the
   * webhook rather than here.
   *
   * `immediately` is accepted for interface compatibility and ignored: Commas
   * has no cancel-at-period-end mode.
   */
  async cancelSubscription(compositeId: string): Promise<void> {
    // Encoded "<sessionId>:<subscriptionId>" because the port passes one id.
    const [sessionId, subscriptionId] = compositeId.split(':');
    if (!sessionId || !subscriptionId) {
      throw new PaymentProcessorError(
        `Commas needs both ids to cancel. Expected "<sessionId>:<subscriptionId>", got "${compositeId}".`,
      );
    }
    try {
      await this.call(
        WIRE.endpoints.cancelSubscription(sessionId, subscriptionId),
        { method: 'DELETE' },
      );
    } catch (e) {
      // Anything not currently active returns 404, including an already
      // cancelled subscription. That is success for our purposes.
      if (e instanceof PaymentProcessorError && e.status === 404) return;
      throw e;
    }
  }

  /**
   * Reconciliation. **Run this on a schedule — it is not optional.**
   *
   * Webhook delivery is at-most-once: a failed delivery is logged and never
   * retried. A single redeploy, cold start or brief database stall during a
   * payment burst permanently loses a paid signup, and the customer is charged
   * with no workspace to show for it.
   *
   * This polls the transactions list and returns events in the same normalised
   * shape as the webhook path, so the orchestrator can be fed from either
   * source and its idempotency check deduplicates whichever arrives second.
   */
  async reconcile(since: Date): Promise<BillingEvent[]> {
    const res = await this.call(
      `${WIRE.endpoints.transactions}?from=${since.toISOString().slice(0, 10)}`,
      { method: 'GET' },
    );

    const data = res.data ?? {};
    const rows: unknown[] = Array.isArray(data)
      ? (data as unknown[])
      : Array.isArray((data as Record<string, unknown>).transactions)
        ? ((data as Record<string, unknown>).transactions as unknown[])
        : Array.isArray((data as Record<string, unknown>).data)
          ? ((data as Record<string, unknown>).data as unknown[])
          : [];

    return rows
      .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
      .map((row) =>
        normaliseEvent({
          // Synthesise an envelope so reconciled rows look like webhook events.
          // The transaction id is stable, so the orchestrator's idempotency
          // check correctly collapses a reconciled row and a late webhook for
          // the same payment into one.
          id: `recon_${String(row.id ?? row.payment_id ?? '')}`,
          type: 'payment.succeeded',
          created_at: row.created_at,
          data: row,
        }),
      );
  }
}

/* ------------------------------------------------------------------ */
/* Event normalisation                                                 */
/* ------------------------------------------------------------------ */

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : {};

export const normaliseEvent = (payload: Record<string, unknown>): BillingEvent => {
  const rawType = typeof payload.type === 'string' ? payload.type : 'unknown';
  const data = asRecord(payload.data);

  /**
   * Metadata we sent at checkout comes back NESTED at `data.api_metadata.data`
   * — not at `api_metadata`, and not at `metadata`. Reading the wrong level
   * yields an empty object, which means a real payment that cannot be matched
   * to an account. The GET endpoint returns the same values at top-level
   * `metadata`, so both are checked.
   */
  const metaSource = {
    ...asRecord(asRecord(data.api_metadata).data),
    ...asRecord(data.metadata),
  };
  const metadata: Partial<CheckoutMetadata> = {};
  for (const [k, v] of Object.entries(metaSource)) {
    if (typeof v === 'string') metadata[k] = v;
  }

  const buyer = asRecord(data.buyer);
  const subscription = asRecord(data.subscription);
  const item = asRecord(data.item);

  const str = (v: unknown): string | undefined =>
    typeof v === 'string' && v ? v : typeof v === 'number' ? String(v) : undefined;

  // `amount` arrives in DOLLARS as a number (29.00), unlike the cents we send.
  const amountDollars = typeof data.amount === 'number' ? data.amount : undefined;

  return {
    // The envelope id is a per-delivery UUID and the ONLY correct dedupe key.
    // payment_id is a business identifier and is null for free-trial starts.
    id: str(payload.id) ?? `nodedupe_${rawType}_${str(data.payment_id) ?? ''}`,
    type: WIRE.eventMap[rawType] ?? 'unknown',
    rawType,
    occurredAt: str(payload.created_at) ?? new Date().toISOString(),
    metadata,
    processorCustomerId: str(buyer.id),
    // Cancellation needs the session id too, so both are carried through.
    processorSubscriptionId: str(subscription.id)
      ? `${str(item.id) ?? ''}:${str(subscription.id)}`
      : undefined,
    currentPeriodEnd: str(subscription.end_date),
    amount:
      amountDollars !== undefined
        ? {
            amount: Math.round(amountDollars * 100),
            currency: str(data.currency) ?? 'USD',
          }
        : undefined,
    raw: payload,
  };
};
