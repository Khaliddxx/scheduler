/**
 * Plan limit enforcement.
 *
 * WHY THIS FILE HAS TO EXIST
 * --------------------------
 * The application's own plan caps are gated on the presence of a Stripe
 * publishable key. With no Stripe key set — which is our situation, because
 * billing runs beside the app rather than inside it — every organisation is
 * treated as unlimited.
 *
 * So nobody is enforcing channel caps unless we do. If you sell a 5-channel
 * plan and never check, customers will connect fifty, and you will find out
 * when the platform rate limits bite.
 *
 * Enforcement differs by fulfilment:
 *
 *   DEDICATED   implicit. The customer has their own instance and their own
 *               platform credentials; what they connect costs them, not us.
 *               We still record the cap for reporting, but we do not police it.
 *
 *   SHARED      explicit, and it is ours to do. The check below runs against
 *               the application's public API on a schedule, and on demand when
 *               a customer is about to connect a channel.
 *
 * The deliberate design choice: enforcement DETECTS and NOTIFIES before it
 * blocks. Silently refusing to publish a post somebody scheduled is the worst
 * possible failure for a scheduling product — worse than briefly allowing one
 * channel too many. Over-limit customers get a prompt to upgrade and a grace
 * period; only then are extra channels disabled.
 */

import type { Workspace } from './types';

export interface LimitCheck {
  workspaceId: string;
  limit: number;
  used: number;
  overBy: number;
  withinLimit: boolean;
}

export interface LimitPolicy {
  /** Days a customer may sit over their cap before channels are disabled. */
  graceDays: number;
  /** Warn at this fraction of the cap. */
  warnAtFraction: number;
}

export const DEFAULT_POLICY: LimitPolicy = {
  graceDays: 7,
  warnAtFraction: 0.8,
};

/** Reads connected-channel counts out of the application. */
export interface ChannelCounter {
  countChannels(workspace: Workspace): Promise<number>;
  disableChannels(workspace: Workspace, count: number): Promise<void>;
}

export const checkLimit = async (
  workspace: Workspace,
  counter: ChannelCounter,
): Promise<LimitCheck> => {
  const used = await counter.countChannels(workspace);
  const limit = workspace.channelLimit;
  // A limit of 0 means "uncapped" (the dedicated plans), not "none allowed".
  const withinLimit = limit === 0 || used <= limit;
  return {
    workspaceId: workspace.id,
    limit,
    used,
    overBy: withinLimit ? 0 : used - limit,
    withinLimit,
  };
};

export type LimitAction =
  | { action: 'none' }
  | { action: 'warn'; message: string }
  | { action: 'notify-over'; message: string; graceEndsAt: string }
  | { action: 'enforce'; disableCount: number; message: string };

/**
 * Decide what to do about a customer's usage. Pure, so it is easy to test the
 * grace-period arithmetic — which is the part that will be wrong if anything is.
 */
export const decideLimitAction = (
  check: LimitCheck,
  overSince: string | null,
  now: Date,
  policy: LimitPolicy = DEFAULT_POLICY,
): LimitAction => {
  if (check.limit === 0) return { action: 'none' };

  if (check.withinLimit) {
    if (check.used >= Math.floor(check.limit * policy.warnAtFraction)) {
      return {
        action: 'warn',
        message: `Using ${check.used} of ${check.limit} channels.`,
      };
    }
    return { action: 'none' };
  }

  if (!overSince) {
    const graceEnds = new Date(now.getTime() + policy.graceDays * 86400_000);
    return {
      action: 'notify-over',
      message:
        `${check.used} channels connected on a ${check.limit}-channel plan. ` +
        `Upgrade, or disconnect ${check.overBy}, within ${policy.graceDays} days.`,
      graceEndsAt: graceEnds.toISOString(),
    };
  }

  const elapsedDays = (now.getTime() - new Date(overSince).getTime()) / 86400_000;
  if (elapsedDays < policy.graceDays) {
    const left = Math.ceil(policy.graceDays - elapsedDays);
    const graceEnds = new Date(
      new Date(overSince).getTime() + policy.graceDays * 86400_000,
    );
    return {
      action: 'notify-over',
      message: `Still ${check.overBy} over the plan limit. ${left} day(s) left.`,
      graceEndsAt: graceEnds.toISOString(),
    };
  }

  return {
    action: 'enforce',
    disableCount: check.overBy,
    message:
      `Grace period elapsed with ${check.used} channels on a ${check.limit}-channel plan. ` +
      `Disabling ${check.overBy} most recently connected.`,
  };
};
