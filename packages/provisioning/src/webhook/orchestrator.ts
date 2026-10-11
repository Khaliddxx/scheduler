/**
 * Turns a verified billing event into a provisioning action.
 *
 * This is where the money-losing and customer-losing mistakes live, so the
 * invariants are stated up front and enforced below:
 *
 *  1. VERIFY BEFORE TRUST. The caller must have verified the signature.
 *     This module assumes that and does not re-check; it is the route handler's
 *     job and the route handler must not skip it.
 *
 *  2. IDEMPOTENT ON EVENT ID. Processors retry. A retried
 *     `checkout.completed` must not create a second workspace, and a retried
 *     `refund.issued` must not double-refund. Every event is recorded before
 *     any side effect, and a duplicate is a no-op.
 *
 *  3. OUT-OF-ORDER TOLERANT. Webhooks do not arrive in the order they
 *     happened. A `subscription.renewed` can land before the
 *     `checkout.completed` that created the subscription. Handlers therefore
 *     converge on a desired state rather than applying a delta.
 *
 *  4. CANCELLATION SUSPENDS, IT DOES NOT DELETE. A card that fails on Tuesday
 *     and succeeds on Wednesday must not have destroyed the customer's data on
 *     Tuesday. Deletion happens later, from a scheduled sweep, after
 *     RETENTION_DAYS.
 *
 *  5. ACK FAST. Return 2xx as soon as the event is durably recorded. Slow
 *     provisioning happens after, on a queue. An endpoint that does minutes of
 *     work inline will time out, and see 6.
 *
 *  6. NEVER RELY ON REDELIVERY. Commas delivers AT MOST ONCE: a failed
 *     delivery is logged and never retried — no backoff, no redelivery queue.
 *     Unlike Stripe, returning 500 does not buy a second chance, it simply
 *     loses the event, and the customer has paid for a workspace that was
 *     never created. Two consequences, both enforced below:
 *
 *       - The event is recorded BEFORE anything that can fail, so a crash
 *         mid-handler leaves a durable trace to replay from.
 *       - Webhooks are a fast path, NOT the source of truth. The scheduled
 *         reconciliation sweep (`CommasProcessor.reconcile`, fed through
 *         `handle()` like any other event) is what actually guarantees a paid
 *         customer gets provisioned. Running it is not optional.
 */

import type {
  BillingEvent,
  BillingEventType,
} from '../payments/port';
import type {
  Fulfilment,
  PlanId,
  Subscription,
  Workspace,
} from '../types';
import type { ProvisioningDriver } from './../provision/port';

/** How long a suspended workspace is kept before anything is deleted. */
export const RETENTION_DAYS = 30;

/* ------------------------------------------------------------------ */
/* Storage ports                                                       */
/* ------------------------------------------------------------------ */

export interface EventLog {
  /**
   * Record the event and report whether it is new.
   * MUST be atomic — two concurrent deliveries of the same event must not both
   * see `true`. A unique constraint on the event id is the simplest way.
   */
  recordIfNew(event: BillingEvent): Promise<boolean>;
  markProcessed(eventId: string, outcome: string): Promise<void>;
  markFailed(eventId: string, error: string): Promise<void>;
}

export interface Store {
  findSubscriptionByProcessorId(id: string): Promise<Subscription | null>;
  findSubscriptionById(id: string): Promise<Subscription | null>;
  upsertSubscription(sub: Partial<Subscription> & { id: string }): Promise<Subscription>;
  findWorkspaceBySubscription(subscriptionId: string): Promise<Workspace | null>;
  upsertWorkspace(ws: Partial<Workspace> & { id: string }): Promise<Workspace>;
  /** Workspaces suspended longer than `days`, for the retention sweep. */
  findSuspendedBefore(days: number): Promise<Workspace[]>;
}

export interface PlanLookup {
  (planId: PlanId): { channelLimit: number; fulfilment: Fulfilment } | undefined;
}

export interface OrchestratorDeps {
  store: Store;
  events: EventLog;
  /** One driver per fulfilment mode. */
  drivers: Record<Fulfilment, ProvisioningDriver>;
  plans: PlanLookup;
  /** Queue slow work. Returning immediately keeps the webhook fast. */
  enqueue: (job: { kind: string; payload: Record<string, unknown> }) => Promise<void>;
  log?: (level: 'info' | 'warn' | 'error', msg: string, meta?: unknown) => void;
}

export interface HandleResult {
  /** What the caller should return to the processor. Always 200 unless fatal. */
  status: number;
  outcome:
    | 'duplicate'
    | 'queued'
    | 'ignored'
    | 'applied'
    | 'error';
  detail: string;
}

/* ------------------------------------------------------------------ */
/* Orchestrator                                                        */
/* ------------------------------------------------------------------ */

export class BillingOrchestrator {
  constructor(private readonly deps: OrchestratorDeps) {}

  private log(level: 'info' | 'warn' | 'error', msg: string, meta?: unknown): void {
    this.deps.log?.(level, msg, meta);
  }

  /**
   * Entry point for a verified webhook.
   *
   * Deliberately returns 200 for almost everything. A non-2xx tells the
   * processor to retry, and retrying is only correct for transient failure. An
   * event we cannot interpret will never become interpretable on retry, so
   * acknowledging it and alerting is better than an infinite redelivery loop.
   */
  async handle(event: BillingEvent): Promise<HandleResult> {
    const isNew = await this.deps.events.recordIfNew(event);
    if (!isNew) {
      return { status: 200, outcome: 'duplicate', detail: `event ${event.id} already seen` };
    }

    try {
      const result = await this.route(event);
      await this.deps.events.markProcessed(event.id, result.outcome);
      return result;
    } catch (e) {
      const msg = (e as Error).message;
      await this.deps.events.markFailed(event.id, msg);
      this.log('error', `event ${event.id} (${event.rawType}) failed: ${msg}`, e);
      // 500 is the honest status, but do not mistake it for a retry: this
      // processor never redelivers. The event is already recorded as failed,
      // and the reconciliation sweep is what will pick it up again.
      return { status: 500, outcome: 'error', detail: msg };
    }
  }

  private async route(event: BillingEvent): Promise<HandleResult> {
    const handlers: Record<BillingEventType, () => Promise<HandleResult>> = {
      'checkout.completed': () => this.onCheckoutCompleted(event),
      'subscription.started': () => this.onCheckoutCompleted(event),
      'subscription.renewed': () => this.onRenewed(event),
      'subscription.payment_failed': () => this.onPaymentFailed(event),
      'subscription.cancelled': () => this.onCancelled(event),
      'subscription.expired': () => this.onCancelled(event),
      'refund.issued': () => this.onRefund(event),
      unknown: async () => {
        this.log('warn', `unmapped event type "${event.rawType}" — acknowledged, no action`);
        return { status: 200, outcome: 'ignored', detail: `unmapped: ${event.rawType}` };
      },
    };
    return handlers[event.type]();
  }

  /* ---------------------------------------------------------------- */

  private async onCheckoutCompleted(event: BillingEvent): Promise<HandleResult> {
    const { accountId, planId, requestId } = event.metadata;

    if (!accountId || !planId) {
      // Without metadata the payment cannot be attributed. This needs a human,
      // not a retry — somebody has paid and we do not know who.
      this.log('error', 'checkout completed with no accountId/planId metadata', event.raw);
      return {
        status: 200,
        outcome: 'ignored',
        detail: 'missing metadata — payment received but unattributable; investigate manually',
      };
    }

    const plan = this.deps.plans(planId);
    if (!plan) {
      this.log('error', `unknown plan "${planId}" on a completed checkout`);
      return { status: 200, outcome: 'ignored', detail: `unknown plan ${planId}` };
    }

    const subscriptionId = event.processorSubscriptionId ?? requestId ?? event.id;
    const now = new Date().toISOString();

    const sub = await this.deps.store.upsertSubscription({
      id: subscriptionId,
      accountId,
      planId,
      status: 'active',
      fulfilment: plan.fulfilment,
      processorSubscriptionId: event.processorSubscriptionId ?? null,
      currentPeriodEnd: event.currentPeriodEnd,
      updatedAt: now,
    });

    const existing = await this.deps.store.findWorkspaceBySubscription(sub.id);
    if (existing && existing.status !== 'terminated') {
      // Converge rather than recreate: a duplicate checkout event for a live
      // workspace should resume it, not build a second one.
      if (existing.status === 'suspended') {
        await this.deps.drivers[existing.fulfilment].resume(existing);
        await this.deps.store.upsertWorkspace({
          id: existing.id,
          status: 'active',
          updatedAt: now,
        });
        return { status: 200, outcome: 'applied', detail: `resumed workspace ${existing.id}` };
      }
      return { status: 200, outcome: 'duplicate', detail: `workspace ${existing.id} already active` };
    }

    // Provisioning can take minutes on the dedicated driver, so it never runs
    // inline. The customer sees a "setting up your workspace" state until the
    // job finishes.
    await this.deps.store.upsertWorkspace({
      id: `ws_${sub.id}`,
      accountId,
      subscriptionId: sub.id,
      status: 'pending',
      fulfilment: plan.fulfilment,
      channelLimit: plan.channelLimit,
      createdAt: now,
      updatedAt: now,
    });

    await this.deps.enqueue({
      kind: 'provision',
      payload: {
        workspaceId: `ws_${sub.id}`,
        accountId,
        subscriptionId: sub.id,
        planId,
        requestId: requestId ?? event.id,
      },
    });

    return { status: 200, outcome: 'queued', detail: `provisioning queued for ${accountId}` };
  }

  /* ---------------------------------------------------------------- */

  private async onRenewed(event: BillingEvent): Promise<HandleResult> {
    const sub = await this.findSub(event);
    if (!sub) {
      // Out of order: the renewal arrived before the checkout that created it.
      // Treat it as a checkout; the handler is idempotent and converges.
      this.log('warn', `renewal for unknown subscription — treating as checkout`);
      return this.onCheckoutCompleted(event);
    }

    const now = new Date().toISOString();
    await this.deps.store.upsertSubscription({
      id: sub.id,
      status: 'active',
      currentPeriodEnd: event.currentPeriodEnd,
      updatedAt: now,
    });

    const ws = await this.deps.store.findWorkspaceBySubscription(sub.id);
    if (ws && ws.status === 'suspended') {
      await this.deps.drivers[ws.fulfilment].resume(ws);
      await this.deps.store.upsertWorkspace({ id: ws.id, status: 'active', updatedAt: now });
      return { status: 200, outcome: 'applied', detail: `renewed and resumed ${ws.id}` };
    }

    return { status: 200, outcome: 'applied', detail: `renewed ${sub.id}` };
  }

  /* ---------------------------------------------------------------- */

  private async onPaymentFailed(event: BillingEvent): Promise<HandleResult> {
    const sub = await this.findSub(event);
    if (!sub) return { status: 200, outcome: 'ignored', detail: 'unknown subscription' };

    // Mark past_due but do NOT suspend on the first failure. Processors retry
    // a card several times over days; suspending on attempt one locks out
    // customers whose payment succeeds on attempt two.
    await this.deps.store.upsertSubscription({
      id: sub.id,
      status: 'past_due',
      updatedAt: new Date().toISOString(),
    });

    await this.deps.enqueue({
      kind: 'dunning-notice',
      payload: { subscriptionId: sub.id, accountId: sub.accountId },
    });

    return { status: 200, outcome: 'applied', detail: `${sub.id} marked past_due` };
  }

  /* ---------------------------------------------------------------- */

  private async onCancelled(event: BillingEvent): Promise<HandleResult> {
    const sub = await this.findSub(event);
    if (!sub) return { status: 200, outcome: 'ignored', detail: 'unknown subscription' };

    const now = new Date().toISOString();
    await this.deps.store.upsertSubscription({
      id: sub.id,
      status: 'cancelled',
      updatedAt: now,
    });

    const ws = await this.deps.store.findWorkspaceBySubscription(sub.id);
    if (!ws || ws.status === 'terminated') {
      return { status: 200, outcome: 'applied', detail: 'cancelled; no live workspace' };
    }

    // SUSPEND. Not terminate. Data survives the retention window so a customer
    // who resubscribes next week gets their calendar back, and so an erroneous
    // cancellation is recoverable.
    await this.deps.drivers[ws.fulfilment].suspend(ws);
    await this.deps.store.upsertWorkspace({ id: ws.id, status: 'suspended', updatedAt: now });

    return {
      status: 200,
      outcome: 'applied',
      detail: `${ws.id} suspended; deletion after ${RETENTION_DAYS} days`,
    };
  }

  /* ---------------------------------------------------------------- */

  private async onRefund(event: BillingEvent): Promise<HandleResult> {
    const sub = await this.findSub(event);
    if (!sub) return { status: 200, outcome: 'ignored', detail: 'unknown subscription' };
    // A refund usually accompanies a cancellation, but not always (a partial
    // refund for an outage, say). Suspending here too would lock out a customer
    // we just apologised to, so this only records and alerts.
    this.log('warn', `refund on subscription ${sub.id} — review manually`, event.raw);
    await this.deps.enqueue({
      kind: 'refund-review',
      payload: { subscriptionId: sub.id, eventId: event.id },
    });
    return { status: 200, outcome: 'applied', detail: `refund recorded for ${sub.id}` };
  }

  /* ---------------------------------------------------------------- */

  private async findSub(event: BillingEvent): Promise<Subscription | null> {
    if (event.processorSubscriptionId) {
      const byProcessor = await this.deps.store.findSubscriptionByProcessorId(
        event.processorSubscriptionId,
      );
      if (byProcessor) return byProcessor;
    }
    // Metadata is the fallback, and it is why createCheckout insists on it.
    const requestId = event.metadata.requestId;
    return requestId ? this.deps.store.findSubscriptionById(requestId) : null;
  }

  /* ---------------------------------------------------------------- */

  /**
   * The retention sweep. Run on a schedule, NOT from a webhook.
   * Deletes workspaces suspended longer than the retention window.
   */
  async runRetentionSweep(): Promise<{ terminated: string[]; failed: string[] }> {
    const due = await this.deps.store.findSuspendedBefore(RETENTION_DAYS);
    const terminated: string[] = [];
    const failed: string[] = [];

    for (const ws of due) {
      try {
        await this.deps.drivers[ws.fulfilment].terminate(ws);
        await this.deps.store.upsertWorkspace({
          id: ws.id,
          status: 'terminated',
          updatedAt: new Date().toISOString(),
        });
        terminated.push(ws.id);
        this.log('info', `terminated ${ws.id} after ${RETENTION_DAYS} days suspended`);
      } catch (e) {
        failed.push(ws.id);
        this.log('error', `could not terminate ${ws.id}: ${(e as Error).message}`);
      }
    }

    return { terminated, failed };
  }
}
