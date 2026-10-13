# Admin dashboard — scope

A private dashboard for running the business: who the customers are, what they
pay for, what they actually use, and the controls to change any of it. It lives
beside Postiz, not inside it. No Postiz source file changes.

Everything below about Postiz was read from the pinned upstream source
(`v2.11.3`), not assumed.

## What Postiz gives us, and what it does not

| Need | In Postiz? | Detail |
| --- | --- | --- |
| List all users and workspaces | No | No admin screen and no admin API. The public API is scoped to one workspace's API key. |
| Impersonate a customer | **Yes** | Users with `isSuperAdmin = true` get an impersonation box in the app and can act as any user. |
| Plan limits | Only with Stripe | Every limit check is skipped unless `STRIPE_PUBLISHABLE_KEY` is set. Without it, every workspace is unlimited. |
| Custom plans | No | Tiers are a fixed enum (`STANDARD`, `PRO`, `TEAM`, `ULTIMATE`) with posts-per-month, team and webhook limits hard-coded in `pricing.ts`. Only the channel count is per-workspace (`Subscription.totalChannels`). |
| Disable a channel | Yes, as data | `Integration.disabled`. Disabled channels stop publishing. |
| Disable a member | Yes, as data | `UserOrganization.disabled`. |

### Correction to what I said earlier

I said the dashboard could write limits into Postiz and let Postiz enforce them.
That only works with the Stripe key set, and setting it also switches on
Postiz's own billing screens, its Stripe checkout, its fixed price list and its
analytics script. Customers would see Postiz's pricing inside your product.

**So enforcement lives in the portal, not in Postiz.** That was already the
design in `packages/provisioning/src/limits.ts`: detect, warn, give a grace
period, then disable the extra channels. The dashboard is where you see and
steer that.

## Shape

```
              ┌──────────── portal (apps/web) ────────────┐
 you ───────► │ /admin  ── admin auth (allowlist + 2FA)   │
              │   │                                        │
              │   ├─ portal DB: accounts, subscriptions,   │  ◄── Commas webhooks
              │   │   plans, limit state, audit log        │      + reconciliation
              │   │                                        │
              │   └─ postiz adapter (one module)           │
              └──────────────┬─────────────────────────────┘
                             │ read-only role for queries
                             │ narrow write role: 2 columns
                             ▼
                      Postiz Postgres (untouched schema)
```

- **Where.** A `/admin` area inside the existing portal app, so it shares the
  billing code and the Commas client. It is never linked publicly and is
  `noindex`.
- **Admin auth.** Separate from customer auth. An email allowlist plus a second
  factor. Every action is written to an audit log with who, what and when.
- **Portal data.** Accounts, subscriptions, plan definitions, limit state and
  the audit log, in the portal's own Postgres.
- **Postiz data.** One adapter module is the only code that touches Postiz's
  database:
  - a **read-only** database role for every query;
  - a **write** role limited to `Integration.disabled` and
    `UserOrganization.disabled`, the two columns the controls need.

## Screens

1. **Overview**
   Monthly recurring revenue, active and trialing subscriptions, churn this
   month, signups per day, posts published in the last 7 days, failed posts,
   channels needing reconnection.
2. **Customers**
   Search and filter by plan and status. Each row shows plan, status, channels
   used of the limit, posts this month, team size and last active.
3. **Customer detail**
   - Billing: subscription, renewal date and the full payment event history
     from Commas.
   - Workspace: members, connected channels (with "needs reconnect" and
     "disabled" flags), recent posts and errors.
   - Actions: see below.
4. **Plans**
   Edit each plan's limits: channels, posts per month, team members, webhooks.
   Stored in the portal DB, so a price change never needs a deploy.
5. **Limits queue**
   Workspaces over a limit, with how far over, when the grace period ends, and
   the warning emails already sent.
6. **Health**
   Failed posts by network, channels that need reconnecting, webhook
   deliveries, and the last reconciliation run against Commas.
7. **Audit log**
   Every admin action and every automatic enforcement.

## Controls

| Action | How it is done | Postiz change |
| --- | --- | --- |
| Suspend / restore a customer | Disable the identity in our identity provider (instant sign-in block) and mark members disabled | None. Data only. |
| Change plan / comp / extend trial | Portal record plus the Commas API | None |
| Disable over-limit channels | Set `Integration.disabled` on the most recently connected ones | None. Data only. |
| Impersonate | Mark your own admin user `isSuperAdmin` once; the dashboard deep-links into Postiz's built-in impersonation | None |
| Resend a warning | Re-runs the limits email for that workspace | None |

## Enforcement job

Runs every 15 minutes, plus on demand from the customer detail screen.

- **Channels: hard limit.** Count active channels and run the existing grace
  logic: warn at 80%, notify when over, disable the extras after 7 days.
- **Posts per month: soft limit.** Count and warn with an upgrade prompt.
  Hard-blocking post creation would need a Postiz code change, and silently
  refusing a scheduled post is the worst failure a scheduler can have.
- **Team members and webhooks: soft limits.** Report and warn the same way.

## Upgrade safety

The only coupling to Postiz is the adapter's SQL against a handful of tables:
`Organization`, `Subscription`, `User`, `UserOrganization`, `Integration`,
`Post`. Two guards keep upgrades safe:

- the adapter declares the exact tables and columns it uses;
- `infra/overlay/upgrade.sh` gains a step that diffs those columns between the
  pinned tag and the new tag, and stops the upgrade if any of them changed.

Postiz renaming one of those columns is the only case that needs a code change
on our side, and the upgrade script catches it before deploy.

## Prerequisites that are not built yet

1. **A persistent portal database.** `apps/web/src/lib/billing.ts` uses
   in-memory stores that reset on every deploy. The dashboard needs Postgres.
2. **The identity provider.** The shared-instance design makes the portal the
   sign-in provider for Postiz, but only the interface exists. Suspension
   depends on it.
3. **The reconciliation cron** against Commas, since its webhooks are
   delivered at most once.

## Milestones

| Milestone | Contents | Estimate |
| --- | --- | --- |
| M0 | Portal Postgres, admin auth with 2FA, audit log | 2–3 days |
| M1 | Read-only: overview, customers, customer detail, health | 3–4 days |
| M2 | Plans editor and the controls table | 2–3 days |
| M3 | Enforcement job, warning emails, limits queue | 2–3 days |
| M4 | Upgrade-safety check in the upgrade script, polish | 1–2 days |

Roughly two to three weeks solo for all of it. M0 and M1 alone give you full
visibility in about a week.

## Decisions for you

- Posts per month: soft (warn and upsell, recommended) or hard?
- Admin at `/admin` on the portal domain, or a separate admin subdomain?
- Anyone besides you getting admin access, and with what rights?
