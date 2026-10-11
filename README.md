# Scheduler

A commercially resellable social media scheduling product: a marketing site, a
billing and provisioning sidecar, and a repeatable way to brand and operate the
open-source engine underneath — without forking it.

> **The product name is a placeholder.** `packages/brand/brand.json` ships
> `"Kolo"` with `placeholder: true`, which makes the build warn and keeps the
> site out of search results. See [`docs/07-naming.md`](docs/07-naming.md).

---

## Quick start

```bash
pnpm install
ALLOW_PLACEHOLDERS=1 pnpm dev        # marketing site on :3100
```

Run the application stack locally:

```bash
cp infra/.env.example infra/.env     # fill in JWT_SECRET at minimum
docker compose -f infra/docker-compose.yml --env-file infra/.env up -d
```

Rebrand the application from the pinned upstream source:

```bash
git clone --depth 1 --branch v2.11.3 https://github.com/gitroomhq/postiz-app upstream
node infra/overlay/apply-brand.mjs --target ./upstream
```

---

## Layout

| Path | What it is |
|---|---|
| `apps/web` | Marketing site, 42 pages, plus checkout and webhook routes |
| `packages/brand` | **One JSON file** that renames and re-skins everything |
| `packages/provisioning` | Payment port, Commas adapter, provisioning drivers, webhook orchestrator |
| `infra/overlay` | Rebrand codemod, branded image build, upgrade and smoke-test tooling |
| `infra/docker-compose.yml` | Local reproduction of the pinned production stack |
| `ops` | Runbook and documented environment |
| `docs` | Architecture, licence, pricing, platform registration, launch |

---

## The one idea

**Nothing commercial lives inside the application.**

Billing, plans, provisioning, limits and the portal all sit beside it and talk
over a network. The application is upstream's code at a pinned tag, with
colours, a logo and a product name changed at build time by a codemod — never a
fork, never a stored patch.

That is why upgrades are a command rather than a merge:

```bash
./infra/overlay/upgrade.sh v2.11.4          # diff + dry-run the rebrand
./infra/overlay/upgrade.sh v2.11.4 --build
node infra/overlay/smoke-test.mjs --url https://staging.your-app
```

A rebrand touches six presentational files and **zero lines of application
logic** — measured, not assumed. Full reasoning in
[`docs/02-where-to-edit-the-app.md`](docs/02-where-to-edit-the-app.md).

---

## Documentation

| Document | Read it when |
|---|---|
| [01 Architecture](docs/01-architecture.md) | You want the shape of the whole thing |
| [02 Where to edit the app](docs/02-where-to-edit-the-app.md) | **Fork vs not, and how updates reach you** |
| [03 Platform app registration](docs/03-oauth-app-registration.md) | **The real long pole before launch** |
| [04 Launch checklist](docs/04-launch-checklist.md) | **Blockers, in order** |
| [05 Pricing and packaging](docs/05-pricing-and-packaging.md) | Setting prices, and X's per-post cost |
| [06 AGPL compliance](docs/06-agpl-compliance.md) | What you must publish, and what you need not |
| [07 Naming](docs/07-naming.md) | Choosing the name and why it gates registration |

---

## Before you take money

The software is ready to look at. These are not code problems, and each is a
way to lose money or be unable to deliver:

1. **The Polotno licence.** The in-app image editor is a proprietary SDK
   requiring a paid commercial licence. Buy it, disable the feature, or remove
   the claim from the site.
2. **A real database.** `apps/web/src/lib/billing.ts` ships in-memory stores
   that cannot deduplicate across instances.
3. **The reconciliation sweep.** Commas delivers webhooks **at most once** and
   never retries. Without `runReconciliation()` on a cron, a dropped delivery
   silently loses a paid signup.
4. **Platform app registrations.** 4–8 weeks for the full set; Meta needs a
   registered legal entity.
5. **A name and a domain**, before any app registration.

Full list, in order: [`docs/04-launch-checklist.md`](docs/04-launch-checklist.md).

---

## Two findings that changed the plan

**Build one shared instance, not an instance per customer.** Every platform
permits one app posting for many customers; TikTok explicitly *forbids* the
alternative; X's Developer Agreement prohibits "service bureau, rental or
managed services" arrangements; and the economics do not work — $21–37/month
per customer against a $29 market entry price. The code supports both, per
plan, but shared is the default.

**Price above upstream, not below.** Upstream sells the same software at
$29–$99 and a white-label version at $200–$8,000/month. There is no gap
underneath them. What a customer actually buys here is platform registrations
already approved and somebody holding the pager.

---

## Licence

The scheduling engine is [Postiz](https://github.com/gitroomhq/postiz-app),
licensed AGPL-3.0. Reselling hosted access is explicitly permitted; modifying
it obliges you to offer the modified source to your users, which this
repository does. The marketing site and provisioning service are separate works
and are not covered by that obligation.

This project is not affiliated with or endorsed by the Postiz project.
See [`docs/06-agpl-compliance.md`](docs/06-agpl-compliance.md).
