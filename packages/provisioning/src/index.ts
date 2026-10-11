/**
 * @scheduler/provisioning
 *
 * Billing and workspace provisioning, kept entirely OUTSIDE the scheduling
 * application. The application is deployed unmodified apart from a
 * presentational rebrand; everything commercial lives here.
 *
 * That separation is the architectural decision this package exists to hold:
 * payments, plans, workspace lifecycle and limit enforcement never become
 * patches against a fast-moving upstream codebase.
 */

export * from './types';

export type {
  PaymentProcessor,
  CheckoutRequest,
  CheckoutSession,
  BillingEvent,
  BillingEventType,
  VerifyResult,
} from './payments/port';
export { PaymentProcessorError } from './payments/port';
export { CommasProcessor, WIRE as COMMAS_WIRE, normaliseEvent } from './payments/commas';

export type {
  ProvisioningDriver,
  ProvisionRequest,
  ProvisionResult,
} from './provision/port';
export { ProvisioningError } from './provision/port';
export { SharedSsoDriver } from './provision/shared-sso';
export type { IdentityProvider, SharedSsoConfig } from './provision/shared-sso';
export { RailwayDriver } from './provision/railway';
export type { RailwayConfig } from './provision/railway';

export {
  BillingOrchestrator,
  RETENTION_DAYS,
} from './webhook/orchestrator';
export type {
  OrchestratorDeps,
  Store,
  EventLog,
  HandleResult,
  PlanLookup,
} from './webhook/orchestrator';

export {
  checkLimit,
  decideLimitAction,
  DEFAULT_POLICY,
} from './limits';
export type { LimitCheck, LimitPolicy, LimitAction, ChannelCounter } from './limits';
