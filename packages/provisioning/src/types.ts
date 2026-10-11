/**
 * Core domain types for billing and provisioning.
 *
 * The shape here deliberately keeps three things separate:
 *   - the ACCOUNT we sell to (our record, our id)
 *   - the SUBSCRIPTION the processor knows about (their id)
 *   - the WORKSPACE the application serves (the app's id)
 *
 * They are separate because they fail separately. A payment can succeed while
 * provisioning fails; a workspace can exist with no live subscription; a
 * subscription can be cancelled while the workspace must linger for a grace
 * period. Collapsing them into one record is the single most common way these
 * systems end up charging people for things they cannot use.
 */

export type PlanId = string;

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export type WorkspaceStatus =
  | 'pending'      // paid for, not yet created
  | 'provisioning' // creation in flight
  | 'active'
  | 'suspended'    // payment lapsed; data retained
  | 'terminated';  // data removal has run

/** How a given customer's workspace is served. */
export type Fulfilment = 'shared' | 'dedicated';

export interface Account {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  /** The processor's own customer id, once known. */
  processorCustomerId?: string;
}

export interface Subscription {
  id: string;
  accountId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  fulfilment: Fulfilment;
  /** The processor's subscription id. Null until checkout completes. */
  processorSubscriptionId: string | null;
  currentPeriodEnd?: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  accountId: string;
  subscriptionId: string;
  status: WorkspaceStatus;
  fulfilment: Fulfilment;
  /** Where the customer logs in. */
  url?: string;
  /** Driver-specific handle: an org id on a shared instance, or a project id. */
  externalRef?: string;
  /** Channel cap derived from the plan, enforced by us, not by the app. */
  channelLimit: number;
  createdAt: string;
  updatedAt: string;
  lastError?: string;
}

/**
 * Everything that must survive the round trip from checkout to webhook.
 * The processor carries this as opaque metadata; without it we cannot tell
 * which of our accounts a payment belongs to.
 */
export interface CheckoutMetadata {
  accountId: string;
  planId: PlanId;
  fulfilment: Fulfilment;
  /** Our own idempotency key for the resulting provisioning job. */
  requestId: string;
  [key: string]: string;
}

export interface Money {
  /** Minor units — cents. Never a float. */
  amount: number;
  currency: string;
}
