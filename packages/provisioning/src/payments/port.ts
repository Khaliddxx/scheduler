/**
 * The payment processor port.
 *
 * WHY A PORT AND NOT JUST CALLING COMMAS DIRECTLY
 * -----------------------------------------------
 * Two reasons, one of them immediate.
 *
 * The immediate one: Commas' public API surface could not be fully verified
 * when this was written. Rather than guess at endpoint shapes and scatter those
 * guesses through the codebase, every uncertain assumption is confined to one
 * adapter file. When the real contract is confirmed, exactly one file changes.
 *
 * The structural one: payment processors get replaced. Pricing gets
 * renegotiated, a processor drops a country you need, an account gets frozen.
 * A processor swap should be an afternoon, not a migration. Everything above
 * this interface — checkout routes, webhook handling, provisioning, the portal
 * — is written against the port and knows nothing about who is processing.
 *
 * The interface is deliberately small. If you find yourself wanting to widen
 * it to expose a processor-specific feature, that feature probably belongs
 * behind a capability flag instead.
 */

import type { CheckoutMetadata, Money, PlanId } from '../types';

export interface CheckoutRequest {
  planId: PlanId;
  /** Monthly or yearly — the adapter maps this to the processor's price id. */
  period: 'monthly' | 'yearly';
  price: Money;
  customerEmail: string;
  /** Round-tripped to the webhook. Without this nothing can be reconciled. */
  metadata: CheckoutMetadata;
  successUrl: string;
  cancelUrl: string;
  /** Days of free trial, if the processor supports it natively. */
  trialDays?: number;
}

export interface CheckoutSession {
  /** Where to send the customer's browser. */
  url: string;
  /** The processor's id for this session, stored so webhooks can be matched. */
  id: string;
  expiresAt?: string;
}

/**
 * A processor event, normalised. Adapters translate their provider's event
 * vocabulary into this closed set, so the rest of the system never sees a
 * provider-specific event string.
 */
export type BillingEventType =
  | 'checkout.completed'
  | 'subscription.started'
  | 'subscription.renewed'
  | 'subscription.payment_failed'
  | 'subscription.cancelled'
  | 'subscription.expired'
  | 'refund.issued'
  | 'unknown';

export interface BillingEvent {
  /** The processor's event id. The idempotency key for the whole pipeline. */
  id: string;
  type: BillingEventType;
  /** The provider's own event name, kept for logging and for 'unknown' events. */
  rawType: string;
  occurredAt: string;
  metadata: Partial<CheckoutMetadata>;
  processorCustomerId?: string;
  processorSubscriptionId?: string;
  currentPeriodEnd?: string;
  amount?: Money;
  /** The untouched payload, for audit and for replaying a mis-parsed event. */
  raw: unknown;
}

export interface VerifyResult {
  ok: boolean;
  /** Present when ok. */
  event?: BillingEvent;
  /** Present when not ok — why the payload was rejected. */
  reason?: string;
}

export interface PaymentProcessor {
  readonly name: string;

  /**
   * Capabilities the rest of the system must branch on. A processor without
   * native trials means we run the trial ourselves; one without a portal means
   * we build cancellation into our own UI.
   */
  readonly capabilities: {
    nativeTrials: boolean;
    customerPortal: boolean;
    subscriptions: boolean;
    refunds: boolean;
  };

  /** Create a hosted checkout and return where to send the customer. */
  createCheckout(req: CheckoutRequest): Promise<CheckoutSession>;

  /**
   * Verify an inbound webhook and normalise it.
   *
   * MUST be given the RAW request body as received — not a re-serialised
   * object. Signature verification is computed over exact bytes, and
   * `JSON.parse` followed by `JSON.stringify` will not reproduce them.
   */
  verifyWebhook(rawBody: string, headers: Record<string, string>): Promise<VerifyResult>;

  /** Cancel a subscription. `immediately: false` cancels at period end. */
  cancelSubscription(
    processorSubscriptionId: string,
    immediately?: boolean,
  ): Promise<void>;

  /** A URL where the customer manages their own billing, if supported. */
  customerPortalUrl?(processorCustomerId: string, returnUrl: string): Promise<string>;
}

/** Thrown for anything the processor rejected or could not be reached for. */
export class PaymentProcessorError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
    /**
     * Whether retrying the same call could plausibly succeed. Network blips
     * and 5xx are retryable; a validation error is not.
     */
    readonly retryable = false,
  ) {
    super(message);
    this.name = 'PaymentProcessorError';
  }
}
