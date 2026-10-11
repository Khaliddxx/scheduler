# Pricing and packaging

Figures gathered October 2026. Re-check before committing.

---

## The uncomfortable fact, first

**Upstream is already in this exact business.**

- Postiz Cloud: **$29 / $39 / $49 / $99** per month (5 / 10 / 30 / 100
  channels), with a 20% annual discount.
- **Postiz Enterprise**, white-labelled and multi-tenant: **$200 / $400 /
  $1,200 / $2,500 / $8,000** per month — and its pitch includes *"Skip App
  Approvals"*.

So the plan is not "resell something nobody is selling". It is "compete with
the people who wrote the software, who also sell the white-label version".

Two things make that survivable:

1. **The Enterprise programme is currently closed to new applicants.** There is
   a gap in the market right now, created by upstream itself.
2. **Upstream's own pricing page says the valuable thing is app approval, not
   software.** They sell managed self-hosting *plus paid social-app approval as
   a service*. That is the product. The scheduler is the delivery mechanism.

Both of those are timing-dependent. Neither is a moat.

---

## Price above them, not below

There is no gap beneath upstream. $29 for 5 channels is already at or under
Buffer. Undercutting the people who write the software, on their software,
with their API costs, is the one strategy guaranteed to lose.

**Recommended opening ladder:**

| Plan | Monthly | Yearly (per mo) | Channels | Fulfilment |
|---|---|---|---|---|
| Starter | **$39** | $33 | 5 | Shared |
| Studio | **$79** | $66 | 15 | Shared |
| Agency | **$149** | $124 | 50 | Shared |
| Dedicated | Quoted | — | Unlimited | Own instance |

Plus a **$199 one-time onboarding fee** on the higher tiers. It is the single
highest-margin line available to a solo operator, it filters out customers who
will churn in a month, and it pays for the hour of setup those customers
actually want.

This is what ships in `apps/web/src/content/pricing.ts`.

### Why above works

You are not selling the software. You are selling:

- platform app registrations **already approved**, so the customer skips 4–8
  weeks of review
- somebody else holding the pager
- backups that have been restored at least once
- a person who answers when a publish fails

Upstream charges **$200/month minimum** for the white-label version of roughly
that. $39 is still well under them.

---

## Unit economics

**Shared instance.** Marginal cost per customer is close to zero — a row in a
database and a share of one box. Gross-margin positive from the first customer
at $39.

**Instance-per-customer.** $21–37/month on Railway for app, Redis, Postgres and
a volume. You need roughly **$60/month just to break even**, before support
time. This is why dedicated is quote-only and why small plans are shared.

### The variable cost nobody expects: X

X is pay-per-use with no free tier:

- **$0.015** per plain post
- **$0.200** per post **containing a URL**

A 13.3× penalty on exactly the posts a marketing scheduler exists to send.

Worked example: a Studio customer at $79 posting 100 link-bearing posts a month
to X costs **$20/month in X fees alone** — a quarter of their subscription,
from one network.

**Handle it, do not absorb it blindly:**

1. Set `DISABLE_X_ANALYTICS` — upstream's kill switch for the largest
   non-posting X cost.
2. Cap X posts per plan, stated on the pricing page.
3. Monitor per-customer X spend; a heavy user can go gross-margin negative.
4. Consider making X an add-on rather than an included channel.

---

## Where the differentiation actually comes from

Ranked by fit for a solo operator:

**1. App approval, done for you.** The strongest wedge, and upstream says so
themselves by charging for it. A customer who self-hosts still faces 4–8 weeks
of platform review and a Meta business-verification gate they may not pass at
all. You have already done it. Lead with this.

**2. Regional payments and locale.** Commas supports a broad set of payment
methods; a market underserved by Stripe-only tools is a real, defensible
position that upstream has no reason to chase. (Note the handover explicitly
dropped Saudi/regional questions — worth revisiting, because this is the wedge
most available to you.)

**3. A named vertical.** "Social scheduling for *X*" lets you write copy,
onboarding and templates nobody generic can match. Going broad means the
landing page is the only differentiator, which the handover already identified
as the worry.

**4. Compliance, data residency, SLA.** Real, but they need a legal entity, an
auditor and someone on call. Last for a solo operator.

---

## Packaging rules worth keeping

- **A channel is one account on one network.** State it everywhere; it is the
  single most-disputed line on any scheduler's bill.
- **Caps are enforced by us, not the app.** Upstream gates its own limits on a
  Stripe key we deliberately do not set. See `packages/provisioning/src/limits.ts`.
- **Warn before blocking.** Silently failing to publish a scheduled post is the
  worst failure a scheduler has. Grace period, then enforce.
- **Trial without a card is how you get fraud** on a product that posts to
  social networks. 7 days with a card, cancel freely.

---

## Two Commas constraints that shape the pricing page

1. **Downgrades are rejected outright by the API** — it refuses any target tier
   that is not more expensive. The pricing FAQ currently promises downgrades at
   period end, so either build cancel-plus-resubscribe, or change the copy.
   Do not ship the mismatch.
2. **There is no customer billing portal.** Self-service cancellation is yours
   to build against the cancel endpoint, server-side.

Also: minimum charge is **$1.00**, and there is no plan catalog — each checkout
session carries its own price and cadence, so a price change is a code change
here, not a dashboard change.

---

## What would make me revisit this

- Upstream reopens Enterprise to new applicants → the gap closes.
- X raises per-post pricing again → X may have to become an add-on.
- You pick a vertical → re-price upward; verticals bear more.
- First ten customers all ask for the same missing thing → that is the product.
