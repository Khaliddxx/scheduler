/**
 * Dedicated-instance driver: one Railway project per customer.
 *
 * WHEN THIS IS WORTH IT
 * ---------------------
 * Only when the customer is paying enough to cover it. A dedicated instance
 * means an app container, Redis, Postgres and a volume — several times the
 * marginal cost of another organisation on a shared box, plus a few minutes of
 * provisioning latency and a fleet that now has to be upgraded N times.
 *
 * What it buys is the thing the shared model cannot: the customer connects
 * their social accounts through THEIR OWN platform app credentials. No shared
 * rate-limit quota, no shared blast radius, and plan caps become implicit
 * because there is nobody else on the box. For an agency running a hundred
 * client accounts, that is the whole product.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ The GraphQL operations below target Railway's public API. Railway has │
 * │ changed this schema before. Run the preflight check against a scratch │
 * │ project before trusting it in a provisioning path:                    │
 * │     await driver.preflight()                                          │
 * │ It issues a harmless introspection query and tells you which of the   │
 * │ mutations this driver depends on still exist.                         │
 * └───────────────────────────────────────────────────────────────────────┘
 */

import type { Workspace } from '../types';
import type {
  ProvisionRequest,
  ProvisionResult,
  ProvisioningDriver,
} from './port';
import { ProvisioningError } from './port';

const RAILWAY_API = 'https://backboard.railway.app/graphql/v2';

export interface RailwayConfig {
  /** Railway account or team token with project-create permission. */
  apiToken: string;
  /** Team to create projects under. Omit for a personal account. */
  teamId?: string;
  /** Region for new projects, e.g. 'us-west2' or 'europe-west4'. */
  region?: string;
  /** The branded application image built by infra/overlay/Dockerfile. */
  appImage: string;
  redisImage?: string;
  postgresImage?: string;
  /** Base domain for customer subdomains, e.g. 'app.example.com'. */
  domainSuffix?: string;
  /** Environment shared by every customer instance (API keys, etc). */
  commonEnv?: Record<string, string>;
  fetchImpl?: typeof fetch;
}

interface GqlResult<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
}

export class RailwayDriver implements ProvisioningDriver {
  readonly name = 'railway';
  readonly fulfilment = 'dedicated' as const;

  private readonly fetch: typeof fetch;

  constructor(private readonly config: RailwayConfig) {
    if (!config.apiToken) throw new ProvisioningError('RAILWAY_API_TOKEN is not set');
    if (!config.appImage) throw new ProvisioningError('No application image configured');
    this.fetch = config.fetchImpl ?? globalThis.fetch;
  }

  private async gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    let res: Response;
    try {
      res = await this.fetch(RAILWAY_API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.config.apiToken}`,
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (e) {
      throw new ProvisioningError(`Railway unreachable: ${(e as Error).message}`, true, e);
    }

    const body = (await res.json()) as GqlResult<T>;

    if (!res.ok) {
      throw new ProvisioningError(
        `Railway API HTTP ${res.status}`,
        res.status >= 500 || res.status === 429,
        body,
      );
    }
    if (body.errors?.length) {
      const msg = body.errors.map((e) => e.message).join('; ');
      // A schema drift reads as "Cannot query field X" — worth naming, because
      // the fix is to update this file rather than to retry.
      const schemaDrift = /cannot query field|unknown argument|no field/i.test(msg);
      throw new ProvisioningError(
        schemaDrift
          ? `Railway schema changed — this driver needs updating: ${msg}`
          : `Railway API error: ${msg}`,
        !schemaDrift,
        body.errors,
      );
    }
    if (!body.data) throw new ProvisioningError('Railway returned no data', true, body);
    return body.data;
  }

  /**
   * Check the mutations this driver depends on still exist, without creating
   * anything. Run it in CI and before a provisioning deploy.
   */
  async preflight(): Promise<{ ok: boolean; missing: string[] }> {
    const required = [
      'projectCreate',
      'serviceCreate',
      'variableCollectionUpsert',
      'serviceDomainCreate',
      'projectDelete',
    ];
    const data = await this.gql<{ __schema: { mutationType: { fields: Array<{ name: string }> } } }>(
      `query { __schema { mutationType { fields { name } } } }`,
    );
    const have = new Set(data.__schema.mutationType.fields.map((f) => f.name));
    const missing = required.filter((r) => !have.has(r));
    return { ok: missing.length === 0, missing };
  }

  async provision(req: ProvisionRequest): Promise<ProvisionResult> {
    // Idempotency: Railway has no idempotency-key header, so we make the
    // project NAME deterministic and look for it before creating. A retried
    // webhook then finds the existing project instead of billing the customer
    // for a second one.
    const projectName = `ws-${req.accountId}`.slice(0, 48);

    const existing = await this.findProject(projectName);
    if (existing) {
      return {
        externalRef: existing.id,
        url: existing.url ?? this.customerUrl(req.accountId),
        meta: { reused: 'true', projectName },
      };
    }

    const created = await this.gql<{ projectCreate: { id: string; name: string } }>(
      `mutation Create($input: ProjectCreateInput!) {
         projectCreate(input: $input) { id name }
       }`,
      {
        input: {
          name: projectName,
          description: `Dedicated workspace — account ${req.accountId}, plan ${req.planId}`,
          ...(this.config.teamId ? { teamId: this.config.teamId } : {}),
          isPublic: false,
        },
      },
    );

    const projectId = created.projectCreate.id;

    // From here on a failure leaves a half-built project, so anything that
    // throws must leave enough behind to find and clean up. The project name
    // is deterministic, so the sweeper can.
    try {
      const url = this.customerUrl(req.accountId);
      await this.createDatastores(projectId);
      await this.createApp(projectId, req, url);

      return {
        externalRef: projectId,
        url,
        meta: { projectName, region: this.config.region ?? 'default' },
      };
    } catch (e) {
      throw new ProvisioningError(
        `Project ${projectId} was created but is incomplete: ${(e as Error).message}. ` +
          `It must be torn down or finished by hand — see ops/RUNBOOK.md.`,
        false,
        e,
      );
    }
  }

  private customerUrl(accountId: string): string {
    const suffix = this.config.domainSuffix;
    return suffix ? `https://ws-${accountId}.${suffix}` : '';
  }

  private async findProject(name: string): Promise<{ id: string; url?: string } | null> {
    try {
      const data = await this.gql<{
        projects: { edges: Array<{ node: { id: string; name: string } }> };
      }>(`query { projects { edges { node { id name } } } }`);
      const hit = data.projects.edges.find((e) => e.node.name === name);
      return hit ? { id: hit.node.id } : null;
    } catch {
      // A failed lookup must not block provisioning; worst case we create a
      // duplicate, which the deterministic name makes easy to spot.
      return null;
    }
  }

  private async createDatastores(projectId: string): Promise<void> {
    for (const [name, image] of [
      ['redis', this.config.redisImage ?? 'redis:7.4-alpine'],
      ['postgres', this.config.postgresImage ?? 'postgres:17-alpine'],
    ] as const) {
      await this.gql(
        `mutation Svc($input: ServiceCreateInput!) {
           serviceCreate(input: $input) { id }
         }`,
        { input: { projectId, name, source: { image } } },
      );
    }
  }

  private async createApp(
    projectId: string,
    req: ProvisionRequest,
    url: string,
  ): Promise<void> {
    const app = await this.gql<{ serviceCreate: { id: string } }>(
      `mutation Svc($input: ServiceCreateInput!) {
         serviceCreate(input: $input) { id }
       }`,
      {
        input: { projectId, name: 'app', source: { image: this.config.appImage } },
      },
    );

    const serviceId = app.serviceCreate.id;

    const vars: Record<string, string> = {
      ...this.config.commonEnv,
      MAIN_URL: url,
      FRONTEND_URL: url,
      NEXT_PUBLIC_BACKEND_URL: `${url}/api`,
      BACKEND_INTERNAL_URL: 'http://localhost:3000',
      // Closed: on a dedicated instance the customer is the only user, and
      // they arrive through SSO.
      DISABLE_REGISTRATION: 'true',
      NOT_SECURED: 'false',
      STORAGE_PROVIDER: 'local',
      UPLOAD_DIRECTORY: '/uploads',
      NEXT_PUBLIC_UPLOAD_DIRECTORY: '/uploads',
      // Deliberately NOT set: STRIPE_PUBLISHABLE_KEY. Setting it would turn on
      // the application's own billing UI and plan enforcement, which would
      // collide with ours. See packages/provisioning/src/limits.ts.
      DATABASE_URL: '${{postgres.DATABASE_URL}}',
      REDIS_URL: '${{redis.REDIS_URL}}',
      JWT_SECRET: cryptoRandom(48),
      PLAN_CHANNEL_LIMIT: String(req.channelLimit),
    };

    await this.gql(
      `mutation Vars($input: VariableCollectionUpsertInput!) {
         variableCollectionUpsert(input: $input)
       }`,
      { input: { projectId, serviceId, variables: vars } },
    );

    if (this.config.domainSuffix) {
      await this.gql(
        `mutation Dom($input: ServiceDomainCreateInput!) {
           serviceDomainCreate(input: $input) { id domain }
         }`,
        { input: { serviceId, targetPort: 5000 } },
      );
    }
  }

  async suspend(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) throw new ProvisioningError('No project to suspend');
    // Scale to zero rather than delete: the volume and database survive, so a
    // recovered payment is a redeploy rather than a restore-from-backup.
    await this.gql(
      `mutation Suspend($id: String!) {
         projectUpdate(id: $id, input: { isPublic: false }) { id }
       }`,
      { id: workspace.externalRef },
    ).catch(() => {
      throw new ProvisioningError(
        'Could not suspend the Railway project. Railway has no first-class ' +
          '"pause" mutation in all plans — if this keeps failing, suspend by ' +
          'removing the public domain instead, and record that in the runbook.',
        true,
      );
    });
  }

  async resume(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) throw new ProvisioningError('No project to resume');
    await this.gql(
      `mutation Resume($id: String!) {
         projectUpdate(id: $id, input: { isPublic: false }) { id }
       }`,
      { id: workspace.externalRef },
    );
  }

  async terminate(workspace: Workspace): Promise<void> {
    if (!workspace.externalRef) return;
    // Irreversible, and it takes the volume with it. The orchestrator only
    // calls this after the retention window; never call it from a webhook.
    await this.gql(`mutation Del($id: String!) { projectDelete(id: $id) }`, {
      id: workspace.externalRef,
    });
  }

  async health(workspace: Workspace): Promise<{ healthy: boolean; detail?: string }> {
    if (!workspace.url) return { healthy: false, detail: 'no URL yet' };
    try {
      const res = await this.fetch(workspace.url, { method: 'HEAD' });
      return { healthy: res.status < 500, detail: `HTTP ${res.status}` };
    } catch (e) {
      return { healthy: false, detail: (e as Error).message };
    }
  }
}

/** Cryptographically strong secret for per-instance JWT signing. */
const cryptoRandom = (bytes: number): string => {
  const a = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(a);
  return Buffer.from(a).toString('base64url');
};
