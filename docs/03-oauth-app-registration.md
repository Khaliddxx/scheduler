# Platform app registration

This is the long pole. Not the software — the software works. What stands
between you and a sellable product is eight developer applications, several of
which need review by a human at a company that has no obligation to hurry.

Figures below were gathered in October 2026. **Platform pricing and policy move
constantly — re-check before committing.**

---

## The decision the handover got wrong

The handover recommended **instance-per-customer**, on the reasoning that it
gives each customer their own platform credentials and so avoids a shared
rate-limit quota and a shared blast radius.

The research says do the opposite, for three independent reasons:

1. **Every platform in scope permits one registered app to post on behalf of
   many unrelated customers.** That is the normal, intended model.
2. **TikTok explicitly forbids the alternative.** Its guidelines list the
   own-accounts-only / instance-per-customer pattern as *not acceptable*. So a
   shared app is mandatory there, not merely allowed.
3. **The economics do not work.** Instance-per-customer on Railway costs
   $21–37/month, which is at or above upstream's entire $29 entry price. You
   would need roughly $60/month per customer just to break even. On a shared
   instance you are gross-margin positive from the first customer.

There is also a fourth, sharper problem: **X's Developer Agreement prohibits
providing API access "on a service bureau, rental or managed services basis."**
That clause is aimed squarely at renting out API access, which is what
instance-per-customer looks like. And X's Developer Policy separately forbids
asking customers for their own developer credentials, closing the
bring-your-own-key escape hatch on X specifically.

**So: build one shared instance with one app registration per platform.** The
code supports both — `Fulfilment` is a per-plan property — but shared is the
default and should stay that way. Keep the dedicated driver for a customer with
a genuine data-residency or isolation requirement, and price it accordingly.

The cost of the shared model is real and must be managed: one customer's abuse
can get the app suspended for **everyone**, and on LinkedIn a rejected app
cannot be resurrected. Mitigations are at the bottom of this page.

---

## Buy the domain first

Three platforms verify or review your domain, and **on LinkedIn a rejection
permanently burns the app you registered it with**. `MAIN_URL`, `FRONTEND_URL`
and `NEXT_PUBLIC_BACKEND_URL` derive every OAuth redirect URI, so changing the
domain later means re-registering everywhere.

Name → domain → *then* registrations. Not the other way round.

---

## Platform by platform

### Tier 1 — launch with these (no review)

| Platform | Review | Cost | Notes |
|---|---|---|---|
| Bluesky | None | Free | App password. Fastest channel to live. |
| Mastodon | None | Free | Per-instance app registration. |
| Telegram | None | Free | Bot token. |
| Discord | None | Free | Bot added to a server. |
| Slack | None | Free | Workspace app. |
| Farcaster | None | Free | |
| Nostr | None | Free | Relay-based, no central registration. |
| Lemmy | None | Free | |
| Medium, DEV.to, Hashnode, WordPress, Listmonk | None | Free | Token-based. |

That is a credible product on day one — roughly **one day of work** — while the
reviewed networks are in flight.

### Tier 2 — the ones that matter commercially

**X (Twitter)** — no app review, three self-serve steps. But:

- **Pay-per-use, no free tier.** $0.015 per plain post, **$0.200 per post
  containing a URL** — a 13.3× penalty landing exactly on the link-bearing
  marketing posts a scheduler exists to send. This is the single largest threat
  to your margins and it is a *variable cost you absorb per customer*.
- The cheap $0.001 "owned read" rate does **not** apply to your customers; it
  requires the authenticated user to own the developer app.
- Basic ($200/mo) and Pro ($5,000/mo) were deprecated in 2026 and subscribers
  were force-migrated to pay-per-use.
- Hard app-wide ceiling of **10,000 posts per 24 hours**, shared across every
  customer. Per-user limit 100 per 15 minutes.
- Postiz ships `DISABLE_X_ANALYTICS`, a one-line kill switch for the largest
  non-posting X cost. **Set it.**

Price X usage into the plans, or cap X posts per plan. Do not discover this
after a customer schedules 400 link posts a month.

**LinkedIn** — two separate paths, and only one needs review:

- *Personal profiles* via `w_member_social`: **self-serve, no review at all.**
- *Company Pages* via the Community Management API: requires a registered legal
  entity, a business email on your own domain, and a LinkedIn Page that
  verifies your app.

Important detail: Postiz's LinkedIn provider requests organization scopes the
self-serve path cannot grant. **A one-line scope trim is required** for a
no-review LinkedIn launch. Do that before submitting anything, because a
rejection is permanent for that app.

**Meta (Facebook, Instagram, Threads)** — no fees, but **Business Verification
of a real legal entity is a hard gate before App Review can complete**. A solo
operator with a personal Gmail cannot pass it. Register the company first.

Good news: Instagram and Threads publishing limits are **per-account, not
per-app** (100 Instagram posts and 250 Threads posts per account per 24h), so
they scale cleanly on a shared instance.

**TikTok** — **unusable commercially until audited.** An unaudited app may let
only 5 users post per 24 hours, all accounts must be private, and all content
is forced to `SELF_ONLY` visibility.

Also: Postiz's TikTok provider defaults `privacy_level` to
`PUBLIC_TO_EVERYONE` server-side, which contradicts TikTok's audit rule that
privacy must have **no default**. That is a latent audit failure — close it
before submitting.

**YouTube (Google)** — `videos.insert` has its own quota bucket of **100
uploads per day per project, shared across all your tenants**. The tightest
per-app ceiling of any platform here. Exceeding it requires a compliance audit.

Postiz also requests a far broader scope set than a scheduler needs, including
`youtubepartner`. Google reviews whether a narrower scope would suffice, so
this is a likely rejection trigger. Trim it.

**Pinterest** — the fastest real approval; Trial access is reviewed each
business day. But Trial is a sandbox where created Pins are visible only to
their creator, so **Standard access is mandatory** for a real product, and that
needs a demo video.

### Cut from the paid product

**Reddit.** Its Data API Terms prohibit deriving revenue from the API without
Reddit's express written approval. A paid scheduler does that by definition.

Reddit is already excluded in the code — `commercialBlocker` in
`apps/web/src/content/channels.ts` — so it does not appear on the site or in
the channel count. Do not re-add it without that written approval.

---

## Costed summary

| | |
|---|---|
| Direct API fees | **$0 on seven of eight platforms** |
| X | Pay-per-use: $0.015/post, $0.200/post with a URL |
| Real up-front cost | A domain, plus business registration |
| Real currency | **Elapsed time** |
| Credible launch set | ~1 day (the no-review tier) |
| Full set approved | **4–8 weeks** |

The surprise for most people is that the money is small and the *time* is
large, and that a legal entity gates Meta entirely.

---

## Shared-app risk management

One shared app means one blast radius. Every customer on a platform loses
service at once if the app is suspended, and on LinkedIn it cannot be brought
back. So:

- **Terms that let you terminate fast.** You need the contractual right to cut
  off a customer whose behaviour threatens the app, immediately.
- **Watch for the known causes:** spam volume, scraping, posting content the
  user did not authorise, misrepresenting the app's purpose at review, and
  scope creep beyond what was approved.
- **Rate-limit per customer below the platform ceiling**, so one customer
  cannot exhaust a shared quota. The YouTube 100/day and X 10,000/day limits
  are the binding ones.
- **Register the apps under the company, not a personal account**, so they
  survive you changing email address.
- **Keep the review artifacts** — demo video, privacy URL, terms URL,
  screenshots — in version control. You will resubmit more than once.

---

## Order of operations

1. Decide the name. Buy the domain.
2. Register the legal entity (gates Meta; also needed for LinkedIn Pages).
3. Stand up `/legal/privacy` and `/legal/terms` publicly — reviewers check them.
4. Launch on the no-review tier. Start selling.
5. Submit X (self-serve) and LinkedIn personal (after the scope trim).
6. Begin Meta business verification — the longest pole, start it early.
7. Submit Pinterest for Standard, YouTube with trimmed scopes, TikTok for audit
   after fixing the privacy-level default.
