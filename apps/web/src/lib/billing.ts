/**
 * Wiring for billing and provisioning.
 *
 * This module assembles the pieces from @scheduler/provisioning into something
 * the route handlers can use, and it is the ONLY place that decides which
 * concrete processor, driver and store are in play. Swapping the payment
 * processor, or moving from shared tenancy to dedicated instances, happens
 * here and nowhere else.
 */

import {
  BillingOrchestrator,
  CommasProcessor,
  SharedSsoDriver,
  RailwayDriver,
  type EventLog,
  type Fulfilment,
  type IdentityProvider,
  type PaymentProcessor,
  type ProvisioningDriver,
  type Store,
  type Subscription,
  type Workspace,
} from '@scheduler/provisioning';
import { brand } from '@scheduler/brand';
import { plans } from '@/content/pricing';

/* ------------------------------------------------------------------ */
/* Development store                                                   */
/* ------------------------------------------------------------------ */

/**
 * In-memory implementations so the flow is runnable end to end before a
 * database exists.
 *
 * THESE ARE NOT PRODUCTION PARTS. They lose everything on restart, and because
 * serverless runtimes give each instance its own memory, two concurrent
 * webhook deliveries can land on different instances and BOTH see an event as
 * new — which is exactly the duplicate-provisioning the idempotency check is
 * supposed to prevent.
 *
 * Before taking real money, replace these with a real database and put a
 * UNIQUE constraint on the event id. `recordIfNew` must be a single atomic
 * insert whose conflict means "already seen", not a read followed by a write.
 */
const memSubs = new Map<string, Subscription>();
const memWorkspaces = new Map<string, Workspace>();
const memEvents = new Map<string, { status: string; detail?: string }>();
const memIdentities = new Map<string, { email: string; enabled: boolean }>();

export const isProductionStoreConfigured = Boolean(process.env.DATABASE_URL);

const devStore: Store = {
  async findSubscriptionByProcessorId(id) {
    for (const s of memSubs.values()) {
      if (s.processorSubscriptionId === id) return s;
    }
    return null;
  },
  async findSubscriptionById(id) {
    return memSubs.get(id) ?? null;
  },
  async upsertSubscription(partial) {
    const now = new Date().toISOString();
    const existing = memSubs.get(partial.id);
    const next: Subscription = {
      accountId: '',
      planId: '',
      status: 'active',
      fulfilment: 'shared',
      processorSubscriptionId: null,
      createdAt: now,
      updatedAt: now,
      ...existing,
      ...partial,
    } as Subscription;
    memSubs.set(next.id, next);
    return next;
  },
  async findWorkspaceBySubscription(subscriptionId) {
    for (const w of memWorkspaces.values()) {
      if (w.subscriptionId === subscriptionId) return w;
    }
    return null;
  },
  async upsertWorkspace(partial) {
    const now = new Date().toISOString();
    const existing = memWorkspaces.get(partial.id);
    const next: Workspace = {
      accountId: '',
      subscriptionId: '',
      status: 'pending',
      fulfilment: 'shared',
      channelLimit: 0,
      createdAt: now,
      updatedAt: now,
      ...existing,
      ...partial,
    } as Workspace;
    memWorkspaces.set(next.id, next);
    return next;
  },
  async findSuspendedBefore(days) {
    const cutoff = Date.now() - days * 86400_000;
    return [...memWorkspaces.values()].filter(
      (w) => w.status === 'suspended' && new Date(w.updatedAt).getTime() < cutoff,
    );
  },
};

const devEventLog: EventLog = {
  async recordIfNew(event) {
    if (memEvents.has(event.id)) return false;
    memEvents.set(event.id, { status: 'received' });
    return true;
  },
  async markProcessed(id, outcome) {
    memEvents.set(id, { status: 'processed', detail: outcome });
  },
  async markFailed(id, error) {
    memEvents.set(id, { status: 'failed', detail: error });
  },
};

const devIdentity: IdentityProvider = {
  async upsertUser({ externalId, email }) {
    memIdentities.set(externalId, { email, enabled: true });
    return { subject: externalId };
  },
  async disableUser(subject) {
    const u = memIdentities.get(subject);
    if (u) u.enabled = false;
  },
  async enableUser(subject) {
    const u = memIdentities.get(subject);
    if (u) u.enabled = true;
  },
  async deleteUser(subject) {
    memIdentities.delete(subject);
  },
  async isEnabled(subject) {
    return memIdentities.get(subject)?.enabled ?? false;
  },
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

export const getProcessor = (): PaymentProcessor =>
  new CommasProcessor({
    apiKey: process.env.COMMAS_API_KEY ?? '',
    webhookSecret: process.env.COMMAS_WEBHOOK_SECRET ?? '',
    // Sandbox is a different HOST with its own keys, not a flag on the same
    // one. Keys are not interchangeable between environments.
    sandbox: process.env.COMMAS_SANDBOX === 'true',
    // Per-session webhook override. Useful for pointing a preview deployment
    // at itself without touching the dashboard setting that production uses.
    webhookUrl: process.env.COMMAS_WEBHOOK_URL,
  });

/**
 * Reconciliation sweep — run this on a schedule. It is not optional.
 *
 * Commas delivers webhooks at most once and never retries, so a dropped
 * delivery means a customer paid and no workspace was created. This polls the
 * transactions list and replays anything the webhook path missed; the
 * orchestrator's idempotency check makes a double-delivery harmless.
 *
 * Call it from a cron route every few minutes, with a lookback comfortably
 * wider than the interval.
 */
export const runReconciliation = async (lookbackMinutes = 180) => {
  const processor = getProcessor();
  if (!(processor instanceof CommasProcessor)) return { checked: 0, applied: 0 };

  const since = new Date(Date.now() - lookbackMinutes * 60_000);
  const events = await processor.reconcile(since);
  const orchestrator = getOrchestrator();

  let applied = 0;
  for (const event of events) {
    const result = await orchestrator.handle(event);
    if (result.outcome !== 'duplicate') applied += 1;
  }
  return { checked: events.length, applied };
};

const sharedDriver = (): ProvisioningDriver =>
  new SharedSsoDriver({
    appUrl: brand.app.url,
    identity: devIdentity,
  });

const dedicatedDriver = (): ProvisioningDriver => {
  // Falls back to the shared driver when Railway is not configured, so the
  // flow stays runnable in development rather than throwing at import time.
  if (!process.env.RAILWAY_API_TOKEN || !process.env.APP_IMAGE) {
    return sharedDriver();
  }
  return new RailwayDriver({
    apiToken: process.env.RAILWAY_API_TOKEN,
    teamId: process.env.RAILWAY_TEAM_ID,
    region: process.env.RAILWAY_REGION,
    appImage: process.env.APP_IMAGE,
    domainSuffix: process.env.WORKSPACE_DOMAIN_SUFFIX,
  });
};

export const getOrchestrator = (): BillingOrchestrator => {
  const drivers: Record<Fulfilment, ProvisioningDriver> = {
    shared: sharedDriver(),
    dedicated: dedicatedDriver(),
  };

  return new BillingOrchestrator({
    store: devStore,
    events: devEventLog,
    drivers,
    plans: (planId) => {
      const p = plans.find((x) => x.id === planId);
      if (!p) return undefined;
      return {
        // A `channels` of 0 means uncapped on the dedicated tier.
        channelLimit: p.channels,
        fulfilment: p.fulfilment,
      };
    },
    enqueue: async (job) => {
      // Development stand-in. In production this is a real queue so that slow
      // provisioning never happens inside the webhook request — a processor
      // that times out will redeliver, and a redelivery mid-provision is how
      // you end up with two workspaces for one payment.
      // eslint-disable-next-line no-console
      console.info('[queue] would enqueue', job.kind, job.payload);
    },
    log: (level, msg, meta) => {
      // eslint-disable-next-line no-console
      console[level === 'error' ? 'error' : 'info'](`[billing] ${msg}`, meta ?? '');
    },
  });
};

/** Inspection helper for the post-checkout status page. */
export const peekWorkspace = (subscriptionId: string): Workspace | null => {
  for (const w of memWorkspaces.values()) {
    if (w.subscriptionId === subscriptionId) return w;
  }
  return null;
};
