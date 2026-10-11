# Ops

Operational configuration and runbooks for the deployed application.

**There is no application code in this directory.** The application is deployed
from a pinned upstream image with a presentational rebrand applied at build
time. That is deliberate — see
[`../docs/02-where-to-edit-the-app.md`](../docs/02-where-to-edit-the-app.md).

| File | Purpose |
|---|---|
| `RUNBOOK.md` | Backup, restore, upgrade, rollback, incident procedures |
| `.env.example` | Every variable, documented, no secrets |
| `../infra/docker-compose.yml` | Local reproduction of the pinned stack |
| `../infra/overlay/` | The rebrand codemod, image build and upgrade tooling |

## Current deployment

| | |
|---|---|
| Host | Railway |
| Project | `4664df0d-7766-431d-8ddf-e3a7a662bab1` |
| Environment | `production` / `934b93f8-9e42-4207-b3e3-a3c83d918db3` |
| Region | `us-west2` |
| Public URL | `postiz-production-a45c.up.railway.app` |
| Custom domain | none yet |

### Services

| Service | Image | Volume |
|---|---|---|
| App | `ghcr.io/gitroomhq/postiz-app:v2.11.3` | 5 GB `/uploads` |
| Redis | `bitnamilegacy/redis:latest` ⚠️ | 5 GB `/bitnami` |
| Postgres | `timescale-postgis:pg17-ts2.17` | 5 GB `pgdata` |

## Known issues, in priority order

1. **Redis image is deprecated and unpinned.** `bitnamilegacy/*` is where
   Bitnami parked images after cutting their free catalogue, and it tracks
   `latest`. That container carries the scheduling queue, so an upstream change
   stops posts going out silently. **Pin it** — `RUNBOOK.md` → Pin Redis.

2. **No backups configured.** Railway volumes are not backups and have no
   snapshot API. Until the dump job runs on a schedule *and* a restore has been
   tested, a bad migration is unrecoverable. `RUNBOOK.md` → Backups.

3. **`DISABLE_REGISTRATION` is set, correctly, but nothing provisions yet.**
   Public signup is closed, which is right for a paid product. Customers get in
   through SSO created by the provisioning service — that service has to be
   deployed before anyone can buy.

4. **Storage is on a single 5 GB volume.** Move `STORAGE_PROVIDER` to
   S3-compatible storage before taking real customer media.

5. **Postgres is heavier than needed.** The template provisioned TimescaleDB +
   PostGIS; the application uses neither. Harmless, and not worth migrating a
   live database to change.

## Version constraint

`v2.11.3` is the **last release before upstream replaced BullMQ with Temporal**
and moved off Alpine.

- Upgrading past it is not a tag bump: it needs a new Temporal service and a
  changed deployment topology.
- Staying on it means no upstream fixes and no new platform integrations.

A one-way door. Plan the crossing as a project, before a security fix forces
the timing.

## Why there is no fork

The engine is AGPL-3.0. Reselling it is explicitly permitted; §13 obliges an
operator of a *modified* network service to offer that modified source to its
users.

So modifications buy no competitive advantage — they are published by
obligation — while costing merge pain on every upgrade. The response is to keep
modifications presentational and mechanical: brand via a build-time codemod,
never patch application logic, and keep everything commercial in a sidecar that
talks to the app over a network.

Compliance then costs one footer link. See
[`../docs/06-agpl-compliance.md`](../docs/06-agpl-compliance.md).
