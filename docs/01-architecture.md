# Architecture

## The shape of it

```
                        ┌──────────────────────────────┐
   visitor  ─────────▶  │  apps/web                    │
                        │  marketing site + portal     │
                        │  Next.js, static where it can│
                        └───────────┬──────────────────┘
                                    │ POST /api/checkout
                                    ▼
                        ┌──────────────────────────────┐
                        │  Commas hosted checkout      │
                        │  (the customer pays here)    │
                        └───────────┬──────────────────┘
                                    │ signed webhook
                                    ▼
                        ┌──────────────────────────────┐
                        │  packages/provisioning       │
                        │  verify → record → enqueue   │
                        └───────────┬──────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        ┌───────────────────────┐      ┌────────────────────────┐
        │ SharedSsoDriver       │      │ RailwayDriver          │
        │ identity in our IdP   │      │ one project per tenant │
        └──────────┬────────────┘      └───────────┬────────────┘
                   │ OIDC                          │ Railway API
                   ▼                               ▼
        ┌──────────────────────────────────────────────────────┐
        │  THE APPLICATION — upstream, pinned, unmodified       │
        │  except for a build-time presentational rebrand       │
        │  (infra/overlay)                                      │
        └──────────────────────────────────────────────────────┘
```

## The one decision everything else follows from

**Nothing commercial lives inside the application.**

Billing, plans, provisioning, limits and the customer portal all sit beside it
and talk to it over a network. The application itself is upstream's code at a
pinned tag with colours, a logo and a product name changed at build time.

Every other choice in this repo is downstream of that:

- **Why no fork** — because a modification you have to publish anyway (AGPL
  §13) buys no advantage, while costing merge pain forever. Keep modifications
  presentational and mechanical.
- **Why a codemod rather than a patch series** — a stored diff conflicts; a
  codemod cannot. It either applies or stops with a precise error.
- **Why billing is a sidecar** — the upstream billing module is Stripe-shaped
  and lives in a fast-moving monorepo. Replacing it means rewriting inside
  someone else's code and re-publishing the rewrite under AGPL.
- **Why we enforce plan limits ourselves** — upstream gates its own caps on
  `STRIPE_PUBLISHABLE_KEY`, which we deliberately leave unset. With it unset,
  the app enforces nothing. That is a consequence to own, not a bug.
- **Why the portal is the identity provider** — it is the one mechanism that
  lets us create accounts while public signup stays closed, with no patch.
  See §4 below.

## The pieces

| Path | What it is |
|---|---|
| `apps/web` | Marketing site, customer portal, checkout and webhook routes |
| `packages/brand` | One JSON file that renames and re-skins everything |
| `packages/provisioning` | Payment port, provisioning drivers, webhook orchestrator, limits |
| `infra/overlay` | The rebrand codemod, branded image build, upgrade and smoke-test tooling |
| `infra/docker-compose.yml` | Local reproduction of the pinned production stack |
| `ops` | Runbook and documented environment |
| `docs` | These documents |

## 1. Brand

`packages/brand/brand.json` is the single source of truth. It feeds:

- the marketing site, through a typed accessor with env-var overrides
- the Tailwind theme and the CSS variables in `globals.css`
- the application rebrand, through `infra/overlay/apply-brand.mjs`

Change the name in one place and both halves follow. Environment variables win
over the file, so a staging or white-label deployment needs no rebuild.

## 2. Payments

`PaymentProcessor` is a deliberately small port. `CommasProcessor` implements
it, with every unverified assumption about Commas' API confined to one `WIRE`
object at the top of the file.

That containment is doing real work: Commas' public API reference was not
reachable when this was written, so the endpoint shapes are the intended
integration rather than a confirmed contract. Correct `WIRE` once you have
sandbox credentials and nothing else changes.

What is *not* guesswork, and matters more:

- the signature is verified over **raw bytes**, before anything is parsed
- a timestamp window rejects replays
- comparison is constant-time
- provider event names are normalised into a closed set, so no provider
  vocabulary leaks past the adapter

## 3. Provisioning

Two drivers behind one interface, chosen per plan rather than globally. That is
what unblocks the shared-versus-dedicated decision the handover flagged: it is
not one decision, it is a per-tier one.

| | Shared | Dedicated |
|---|---|---|
| Tenancy | An organisation on one instance | Their own instance |
| Platform credentials | Ours, shared by everyone | Theirs |
| Rate limits | Shared quota | Their own |
| Blast radius | One customer's breach affects all | Contained |
| Marginal cost | Near zero | Real, several services |
| Provision time | Seconds | Minutes |

Migrating a customer between them later is a driver swap plus a data move, not
an architecture change.

## 4. How a customer actually gets in

This is the part worth reading twice, because it looks like it should need a
patch and does not.

Public registration is **closed** (`DISABLE_REGISTRATION=true`) — otherwise
anyone who finds the app URL gets a free account. But reading upstream's auth
service:

```ts
async canRegister(provider: string) {
  if (process.env.DISABLE_REGISTRATION !== 'true'
      || provider === Provider.GENERIC) {
    return true;
  }
  return (await this._organizationService.getCount()) === 0;
}
```

Registration through the `GENERIC` provider — a standard OIDC client,
configured entirely by environment variables — **bypasses that flag**.

So the portal becomes the identity provider:

1. Customer pays. Webhook arrives, verified.
2. Provisioning creates an identity in our store. Nothing is created inside the
   application yet — so an abandoned signup leaves no half-built org behind.
3. Customer clicks through to the app and signs in via SSO.
4. The app creates their organisation on first login.

Suspension is then "disable the identity": instant, reversible, and it keeps
their data. No patch, no admin API, no open registration.

## 5. Webhook invariants

The orchestrator is where the expensive mistakes live, so they are enforced
rather than remembered:

1. **Verify before trust.** The route verifies; the orchestrator assumes it did.
2. **Idempotent on event id.** Processors retry. Every event is recorded before
   any side effect; a duplicate is a no-op.
3. **Out-of-order tolerant.** A renewal can arrive before the checkout that
   created the subscription. Handlers converge on desired state rather than
   applying a delta.
4. **Cancellation suspends, it does not delete.** A card that fails Tuesday and
   succeeds Wednesday must not have destroyed anything on Tuesday. Deletion
   runs from a scheduled sweep after 30 days.
5. **Acknowledge fast.** Provisioning is queued. A handler doing minutes of work
   gets timed out and redelivered mid-flight, and provisions twice.

## 6. Limits

Because `STRIPE_PUBLISHABLE_KEY` is unset, the application treats every
organisation as unlimited. We enforce caps in `packages/provisioning/src/limits.ts`.

The policy deliberately **detects and warns before it blocks**. Silently
refusing to publish a post somebody scheduled is the worst failure mode a
scheduling product has — worse than briefly allowing one channel too many. Over
-limit customers get a prompt and a grace period; only then are extra channels
disabled.

## What is deliberately not built yet

Being explicit, because these look like oversights and are not:

- **A real database.** `apps/web/src/lib/billing.ts` ships in-memory stores so
  the flow runs end to end. They lose everything on restart, and across
  serverless instances two concurrent deliveries of one event can both look
  new. Replace with a real store and a UNIQUE constraint on the event id
  **before taking money**.
- **A job queue.** `enqueue` logs. Provisioning must not run inline.
- **App-side data deletion.** On the shared driver, terminate revokes access
  but does not remove the organisation's content from the shared database.
  Your privacy policy must not promise deletion you do not perform.
- **An email provider.** The contact form validates and logs. Whatever you pick
  becomes a sub-processor and must be listed.
