/**
 * Shared-instance driver: one application instance, one organisation per customer.
 *
 * HOW THIS WORKS, AND WHY IT NEEDS NO PATCHING
 * --------------------------------------------
 * The obvious way to provision a customer on a shared instance is to call some
 * admin API that creates an organisation. The application has no such endpoint
 * — organisations are only ever created by the registration flow.
 *
 * Calling the public registration endpoint instead would mean leaving
 * registration open, which means anyone who finds the app URL gets a free
 * account. That is not sellable.
 *
 * There is a third path, and it is already built in. Reading the upstream auth
 * service:
 *
 *     async canRegister(provider: string) {
 *       if (process.env.DISABLE_REGISTRATION !== 'true'
 *           || provider === Provider.GENERIC) {
 *         return true;
 *       }
 *       return (await this._organizationService.getCount()) === 0;
 *     }
 *
 * Registration through the GENERIC provider bypasses DISABLE_REGISTRATION
 * entirely. GENERIC is a standard OIDC client, configured purely by
 * environment variables (POSTIZ_OAUTH_AUTH_URL, _TOKEN_URL, _USERINFO_URL,
 * _CLIENT_ID, _CLIENT_SECRET).
 *
 * So: WE become the identity provider.
 *
 *     public signup           closed (DISABLE_REGISTRATION=true)
 *     our portal              issues the identity after payment clears
 *     customer clicks through SSO via GENERIC
 *     the app                 creates their organisation on first login
 *
 * Nobody can self-serve a free account, we own the identity and therefore the
 * ability to revoke it, the login button carries our brand name, and not one
 * line of application code is modified. Suspension becomes "disable the user
 * in our IdP", which is instant and reversible.
 *
 * The cost of this model is the one the handover named: every customer posts
 * through OUR social platform app registrations, so they share a rate-limit
 * quota and a blast radius. That is why expensive plans use the dedicated
 * driver instead.
 */

import type { Workspace } from '../types';
import type {
  ProvisionRequest,
  ProvisionResult,
  ProvisioningDriver,
} from './port';
import { ProvisioningError } from './port';

/**
 * The identity store this driver writes to. Implement against whatever you
 * actually use — a table in your own database behind a small OIDC server, or a
 * hosted IdP. The driver only needs these four operations.
 */
export interface IdentityProvider {
  /**
   * Create (or return, if it already exists) an identity. MUST be idempotent
   * on `externalId`.
   */
  upsertUser(input: {
    externalId: string;
    email: string;
    name: string;
    /** Surfaced as OIDC claims; the app reads email and name. */
    claims?: Record<string, string>;
  }): Promise<{ subject: string }>;

  /** Block sign-in without deleting anything. */
  disableUser(subject: string): Promise<void>;
  enableUser(subject: string): Promise<void>;
  deleteUser(subject: string): Promise<void>;
  isEnabled(subject: string): Promise<boolean>;
}

export interface SharedSsoConfig {
  /** Public URL of the shared application instance. */
  appUrl: string;
  identity: IdentityProvider;
  /**
   * Where to send the customer to begin SSO. Defaults to the app's generic
   * OAuth entry point.
   */
  ssoEntryPath?: string;
}

export class SharedSsoDriver implements ProvisioningDriver {
  readonly name = 'shared-sso';
  readonly fulfilment = 'shared' as const;

  constructor(private readonly config: SharedSsoConfig) {}

  private loginUrl(): string {
    const base = this.config.appUrl.replace(/\/$/, '');
    return `${base}${this.config.ssoEntryPath ?? '/auth/login'}`;
  }

  async provision(req: ProvisionRequest): Promise<ProvisionResult> {
    try {
      // Keyed on accountId, not requestId: a retried webhook for the same
      // account must land on the same identity, and a customer who upgrades
      // later must keep the one they already have.
      const { subject } = await this.config.identity.upsertUser({
        externalId: req.accountId,
        email: req.email,
        name: req.name,
        claims: {
          // Carried as claims so the app's organisation gets a sensible name,
          // and so support can trace an org back to a subscription.
          preferred_username: req.email,
          workspace_name: req.name,
          plan: req.planId,
          subscription_id: req.subscriptionId,
        },
      });

      // Nothing is created inside the application yet, and that is correct.
      // The organisation comes into existence on the customer's first SSO
      // login. Until then there is no half-built org to clean up if the
      // customer never arrives.
      return {
        externalRef: subject,
        url: this.loginUrl(),
        meta: {
          mode: 'sso',
          note: 'Organisation is created by the application on first SSO login.',
        },
      };
    } catch (e) {
      throw new ProvisioningError(
        `Could not create identity for ${req.email}: ${(e as Error).message}`,
        true,
        e,
      );
    }
  }

  async suspend(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) {
      throw new ProvisioningError('Workspace has no identity subject to suspend');
    }
    // Revoking sign-in is enough: existing sessions expire, and the data stays
    // exactly where it is so a recovered payment restores everything.
    await this.config.identity.disableUser(workspace.externalRef);
  }

  async resume(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) {
      throw new ProvisioningError('Workspace has no identity subject to resume');
    }
    await this.config.identity.enableUser(workspace.externalRef);
  }

  async terminate(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) return;
    await this.config.identity.deleteUser(workspace.externalRef);
    // NOTE: this removes the customer's ability to log in, but their
    // organisation and its content remain inside the shared application
    // database. That is a deliberate gap, not an oversight: deleting app-side
    // data needs a direct database operation against the shared instance, and
    // getting that wrong deletes somebody else's organisation.
    //
    // Until that job exists and has been tested against a restored backup,
    // termination is access-revocation only. Your privacy policy must not
    // promise deletion you do not perform. See docs/04-launch-checklist.md.
  }

  async health(workspace: Workspace): Promise<{ healthy: boolean; detail?: string }> {
    if (!workspace.externalRef) return { healthy: false, detail: 'no identity subject' };
    try {
      const enabled = await this.config.identity.isEnabled(workspace.externalRef);
      return {
        healthy: enabled,
        detail: enabled ? 'identity active' : 'identity disabled',
      };
    } catch (e) {
      return { healthy: false, detail: (e as Error).message };
    }
  }
}
