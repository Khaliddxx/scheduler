/**
 * The provisioning port.
 *
 * THE DECISION THIS DEFERS
 * ------------------------
 * There are two ways to serve a customer, and the handover flagged choosing
 * between them as blocking:
 *
 *   SHARED      every customer is an organisation on one application instance.
 *               Cheap, instant, one thing to operate. But every customer posts
 *               through YOUR social platform app registrations, so they share
 *               one rate-limit quota and one blast radius: one customer's
 *               policy breach can get the app suspended for everybody.
 *
 *   DEDICATED   every customer gets their own instance and their own platform
 *               credentials. No shared quota, no shared blast radius, plan
 *               caps become implicit. Costs real money per customer and takes
 *               minutes rather than seconds to stand up.
 *
 * The honest answer is that it is not one decision — it is a per-plan one.
 * Small plans are only viable shared; a customer paying enough to want
 * isolation should get it. So `Fulfilment` is a property of the PLAN, both
 * drivers exist behind this interface, and the choice is made per checkout.
 *
 * That means the decision no longer blocks launch, and migrating a customer
 * from shared to dedicated later is a driver swap plus a data move rather than
 * an architecture change.
 */

import type { Fulfilment, PlanId, Workspace } from '../types';

export interface ProvisionRequest {
  accountId: string;
  subscriptionId: string;
  planId: PlanId;
  /** Customer's login email — seeds the first user. */
  email: string;
  /** Workspace display name. */
  name: string;
  channelLimit: number;
  /** Our idempotency key. The same key must never create two workspaces. */
  requestId: string;
}

export interface ProvisionResult {
  externalRef: string;
  url: string;
  /** Anything the driver needs to find this again later. */
  meta?: Record<string, string>;
}

export interface ProvisioningDriver {
  readonly name: string;
  readonly fulfilment: Fulfilment;

  /**
   * Create a workspace. MUST be idempotent on `requestId`: webhooks get
   * delivered more than once, and the second delivery must return the first
   * result rather than creating a second workspace someone pays for twice.
   */
  provision(req: ProvisionRequest): Promise<ProvisionResult>;

  /** Payment lapsed. Block access, KEEP the data. Must be reversible. */
  suspend(workspace: Workspace): Promise<void>;

  /** Payment recovered. */
  resume(workspace: Workspace): Promise<void>;

  /**
   * Delete the workspace and its data. Irreversible.
   *
   * Never call this directly from a webhook. A cancellation should suspend;
   * termination runs from a scheduled job after the retention period, so that
   * a payment failure resolved an hour later does not destroy a customer's
   * account. See RETENTION_DAYS in the orchestrator.
   */
  terminate(workspace: Workspace): Promise<void>;

  /** Cheap health probe used by the status endpoint. */
  health(workspace: Workspace): Promise<{ healthy: boolean; detail?: string }>;
}

export class ProvisioningError extends Error {
  constructor(
    message: string,
    readonly retryable = false,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ProvisioningError';
  }
}
