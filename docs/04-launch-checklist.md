# Launch checklist

Ordered by what blocks what. Everything in **Part 1** must be resolved before
you take a single payment — not because it is tidy, but because each one is a
way to lose money, lose data, or be unable to deliver what you sold.

---

## Part 1 — Blockers

### 1.1 The Polotno licence ⚠ newly discovered

The in-app image editor ("design the image without leaving", "AI image
generation" on the plan cards) is the **Polotno SDK**, a proprietary
dependency. Its licence forbids production, commercial and publicly accessible
use without a paid commercial licence, scoped to one commercial application
under one brand family, priced by quote — reportedly from the low hundreds to
£20–30k+.

This is not an AGPL question. It is a separate proprietary licence sitting
inside an AGPL tree, and it applies to you the moment the service is public
and paid.

**Three options, pick one before launch:**

| | What it means |
|---|---|
| Buy the licence | Get a quote. If it lands in the low hundreds, the feature is worth it. |
| Disable the editor | Remove the capability from the build, and delete the claim from the site. The product still works. |
| Replace it | Substantially more work than it sounds. |

Until this is resolved the editor claims are flagged in
`apps/web/src/content/features.ts` and `pricing.ts`. **Do not sell the feature
before the licence exists.**

Also check: Facebook's `f.js` ships in the tree and its licence is restricted
to use with Facebook's own APIs, and there is a git submodule whose licence
could not be determined. Audit both.

### 1.2 Pin the Redis image

`bitnamilegacy/redis:latest` — deprecated repository, floating tag, carrying
the queue that makes scheduled posting work. Twenty minutes.
→ `ops/RUNBOOK.md` § Pin Redis

### 1.3 Backups, and a tested restore

Nothing exists today. Railway volumes are not backups. A backup you have never
restored is not a backup.
→ `ops/RUNBOOK.md` § Backups

### 1.4 Replace the in-memory stores

`apps/web/src/lib/billing.ts` ships in-memory stores so the flow runs end to
end. They lose everything on restart, and across serverless instances two
concurrent deliveries of one event can both look new — the exact duplicate
provisioning the idempotency check exists to prevent.

Needs: a real database, and a **UNIQUE constraint on the webhook event id**, so
`recordIfNew` is a single atomic insert whose conflict means "already seen".

### 1.5 Run the reconciliation sweep

**Commas delivers webhooks at most once.** A failed delivery is logged and
never retried — no backoff, no redelivery queue. One cold start during a
payment burst permanently loses a paid signup, and the customer is charged with
nothing to show for it.

`runReconciliation()` in `lib/billing.ts` exists for this. Put it on a cron
every few minutes with a lookback wider than the interval. **Not optional.**

### 1.6 Confirm the Commas integration against the sandbox

The adapter is written against the published API reference, but verify
end to end before real money:

- Sandbox is a **different host** (`api-sandbox.commas.net`) with its own keys.
- Production is `https://www.fanbasis.com/public-api` — the `www.` matters, the
  apex 301s and silently breaks POSTs.
- Confirm metadata round-trips and arrives at `data.api_metadata.data`.
- Confirm the webhook signature verifies (`x-webhook-signature`, HMAC-SHA256
  hex of the raw body, no timestamp).
- Confirm minimum charge (100 cents) and that your prices clear it.
- **Downgrades are rejected by the API.** Decide how you handle a customer
  moving down a tier — cancel plus re-subscribe is the usual answer — and build
  it, because the pricing page currently promises downgrades at period end.
- There is **no customer portal**. Self-service cancellation is yours to build.

### 1.7 Decide the name, then buy the domain

The name is baked into `MAIN_URL`, `FRONTEND_URL` and
`NEXT_PUBLIC_BACKEND_URL`, which derive **every OAuth redirect URI registered
with every platform**. Changing it later means re-registering all of them.

→ `docs/07-naming.md`. Then set `name`, `domain` and `placeholder: false` in
`packages/brand/brand.json` and run `pnpm brand:apply`.

### 1.8 Remove the placeholder testimonials

Every entry in `src/content/testimonials.ts` is fabricated and flagged. The
section renders a loud dashed warning so it cannot ship by accident. Replace
with real permissioned quotes or delete the section.

### 1.9 Legal pages reviewed by an actual lawyer

`/legal/terms` and `/legal/privacy` are structurally sound drafts that no
lawyer has read. Both carry a visible notice and are `noindex`. Several
platforms require a live privacy policy URL during app review, so they must be
reachable — but get them reviewed before taking money.

Fill `legal.entity`, `legal.jurisdiction` and `legal.address` in `brand.json`.

### 1.10 Open registration — carefully

`DISABLE_REGISTRATION=true` must **stay true**. Customers arrive through SSO
created by the provisioning service, which bypasses the flag by design. Opening
public registration gives away free accounts.

What must actually be switched on is `POSTIZ_GENERIC_OAUTH=true` plus the five
OIDC endpoints — and the identity provider behind them has to exist.

---

## Part 2 — Before the first customer

### 2.1 Platform app registrations

The long pole. → `docs/03-oauth-app-registration.md`

Launch with the networks that need no review (Bluesky, Mastodon, Discord,
Slack, Telegram, Farcaster, Nostr, Lemmy, and the blogging destinations). That
is a credible product on day one while the reviewed networks are in flight.

### 2.2 Move storage off the volume

`STORAGE_PROVIDER=local` on a 5 GB volume with no snapshot API is a hard
ceiling on customer media, and it arrives without warning.

### 2.3 A queue

`enqueue` currently logs. Provisioning must not run inline in a webhook.

### 2.4 Email delivery

The contact form validates and logs. Transactional email — sign-in, failure
notices, receipts — needs a provider, which becomes a sub-processor and must be
listed on `/legal/sub-processors`.

### 2.5 App-side deletion

On the shared driver, terminate revokes access but does **not** remove the
organisation's content from the shared database. Either build that job and test
it against a restored backup, or make sure the privacy policy does not promise
deletion you do not perform.

---

## Part 3 — Soon after

- **Plan the Temporal upgrade.** v2.11.3 is 29 releases and roughly 284 days
  behind upstream. The cut-over is a topology change (five new containers
  including Elasticsearch, 4 services → 9), but the database side is trivial —
  the Prisma diff between 2.11.3 and 2.12.0 is one insertion and one deletion,
  no models added or removed. Only `TEMPORAL_ADDRESS` is strictly required, and
  it is still missing from upstream's `.env.example`. Being this far behind is
  itself the risk.
- Uptime monitoring and alerting on the queue specifically.
- Rotate `JWT_SECRET` on a schedule (invalidates sessions — announce first).
- Decide the refund policy and make it match what the pricing page says.
- Replace the coarse in-memory rate limit on `/api/contact`.

---

## Pre-flight, every deploy

```bash
./infra/overlay/upgrade.sh --list
node infra/overlay/apply-brand.mjs --target ./upstream --check
node infra/overlay/smoke-test.mjs --url https://staging.your-app
```

Then by hand: log in, connect a channel, schedule a post one minute out,
confirm it publishes.

---

## The one-line summary

The software is ready to look at. What stands between it and taking money is,
in order: **the Polotno licence, a real database, the reconciliation sweep, the
platform app registrations, and a name.** Nothing on that list is a code
problem.
