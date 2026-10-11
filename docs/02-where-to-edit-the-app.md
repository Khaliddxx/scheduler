# Where to edit the app, and how to keep getting updates

This answers three questions you asked: **why not fork?**, **how would I get
updates?**, and **where do I actually edit the source for my version?**

Everything here was measured against the real upstream source at the pinned
tag, not inferred. Where a claim rests on a file, the path is given so you can
check it yourself.

---

## 1. The short answer

**Do not fork. Do not keep a patch series either.** Use a build-time codemod:
`infra/overlay/apply-brand.mjs`.

An upgrade is then:

```bash
./infra/overlay/upgrade.sh v2.11.4          # see what changed, dry-run the rebrand
./infra/overlay/upgrade.sh v2.11.4 --build  # build your branded image
node infra/overlay/smoke-test.mjs --url https://staging.your-app   # verify
```

That is the whole upgrade. No merge, no rebase, no conflict resolution.

The reason this works is that **your change is tiny and purely presentational**.
Measured on the real tree, a complete rebrand touches:

| What | Where | Size |
|---|---|---|
| Entire colour palette | `apps/frontend/src/app/colors.scss` | 1 file, 240 lines, all CSS variables |
| Sidebar logo | `apps/frontend/src/components/new-layout/logo.tsx` | 1 component, inline SVG |
| Wordmark | `apps/frontend/src/components/ui/logo-text.component.tsx` | 1 component, inline SVG |
| Static logo assets | `apps/frontend/public/logo.svg`, `logo-text.svg` | 2 files |
| Product name in UI | 45 files across `apps/frontend/src` and `libraries` | 106 string literals |
| Product name in translations | `libraries/react-shared-libraries/src/translation/locales/*/translation.json` | 188 strings across 16 locales |

**Zero lines of application logic.** No controller, no service, no database
model, no queue worker. That is the fact that makes the whole strategy work,
and it is worth re-checking after any major upgrade.

---

## 2. Why the app is this easy to re-skin

Two pieces of upstream design do you an enormous favour.

### Every colour is a CSS variable

`apps/frontend/tailwind.config.js` does not define a single literal colour.
Every entry points at a variable:

```js
colors: {
  primary: 'var(--color-primary)',
  newBgColor: 'var(--new-bgColor)',
  btnPrimary: 'var(--new-btn-primary)',
  ai: 'var(--new-ai-btn)',
  // ...100 more, all var()
}
```

Those variables are all declared in one place, `apps/frontend/src/app/colors.scss`,
in a `.dark` and a `.light` block. So re-theming the entire application is a
matter of changing values in **one 240-line stylesheet**.

### The product name is mostly already externalised

There is a full i18n system (`i18n.json`, sixteen locales). Most user-facing
strings live in `translation.json` files, not in components. The remainder are
plain string literals in TSX, which a codemod handles safely.

One wrinkle worth knowing: upstream has two brand names in the codebase.
`isGeneralServerSide()` reads `IS_GENERAL` and switches between `"Postiz"` and
the older `"Gitroom"`:

```tsx
title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Login`,
```

Both must be replaced, or the UI shows a different product name depending on
an environment variable. The codemod replaces both.

---

## 3. The four options, and why the codemod wins

### Tier 0 — run the published image, change nothing

Set your own `MAIN_URL`, `FRONTEND_URL` and `IS_GENERAL`, and you get your own
domain and page titles. **That is all you get.** Colours and logo are compiled
into the published image at build time and cannot be overridden by an
environment variable at runtime.

Legitimate choice if you are selling on operations rather than brand, and it is
the only option with literally zero maintenance. Under AGPL you are running an
unmodified work, so §13 asks nothing of you beyond pointing at upstream.

It is probably not enough to sell against the free version of the same
software, because the product a customer logs into would still carry the
upstream identity.

### Tier 1 — hard fork

Copy the repo, rename it, develop freely.

Cost: you now own a monorepo you did not write. Pulling upstream later means
`git merge upstream/main` across a codebase with its own churn, and the
conflicts land in *their* code, which you do not know. Each upgrade gets harder
because your divergence grows monotonically.

**Fork only if you intend to change behaviour**, not appearance. You do not.

### Tier 2 — patch series

Keep a stored diff, rebase it onto each new tag. `git rerere` can replay
recurring conflict resolutions.

Better than a fork, but it still conflicts whenever upstream edits a line you
also edited. Since one of the files you edit is the colour stylesheet — exactly
the kind of file that gets touched on any design change — that will happen.

### Tier 3 — build-time codemod ← **use this**

Store no diff at all. Re-derive the change from whatever the current source
says, at build time.

A codemod **cannot conflict**. It can only fail to find what it expected. So
every transform in `apply-brand.mjs` declares an *anchor* it must match, and a
missing anchor is a hard error naming the file and the fix:

```
✗ logo-icon: Anchor not found in apps/frontend/src/components/new-layout/logo.tsx
  → The Logo component was renamed or moved. Find the new sidebar logo component
    and point this transform at it.
```

An upgrade therefore either rebrands cleanly, or stops with an actionable
message. It never half-applies and never silently ships upstream's branding.

---

## 4. What `apply-brand.mjs` actually does

Run it against any checkout:

```bash
node infra/overlay/apply-brand.mjs --target ./upstream
node infra/overlay/apply-brand.mjs --target ./upstream --check     # verify only
node infra/overlay/apply-brand.mjs --target ./upstream --dry-run   # report only
```

Real output against v2.11.3:

```
✓ colors             apps/frontend/src/app/colors.scss
✓ logo-icon          apps/frontend/src/components/new-layout/logo.tsx
✓ logo-wordmark      apps/frontend/src/components/ui/logo-text.component.tsx
✓ public-logos       apps/frontend/public/logo.svg
✓ product-name-tsx   106 replacement(s) across 45 file(s)
✓ translations       188 replacement(s) across 16 file(s)
✓ residue-audit      none found in user-visible strings
```

### The colour remap is derived, not hand-mapped

You change **one** colour — `primary` in `packages/brand/brand.json` — and the
script measures the hue, saturation and lightness delta from upstream's base
violet, then applies that shift across the stylesheet. One change moves the
whole product coherently instead of leaving stray violets in tokens nobody
named.

Two safeguards matter here, and both were added after the first version got
them wrong:

- **Semantic colours are never touched.** A blanket hue rotation also rotates
  error red, destructive red, success green and warning amber — so a delete
  button quietly turns violet and stops reading as dangerous. The remap only
  applies within ±25° of the brand hue, and there is an explicit preserve list
  for semantic and third-party platform colours (X's blue, for instance).
- **Named tokens are pinned last.** The generic pass runs first, then the
  handful of tokens that must match the marketing site exactly are set
  outright. Doing it the other way round lets the generic pass shift a pinned
  value a second time and your brand colour drifts off-hue.

Verified: swapping to the teal palette changes 19 tokens, preserves 81, and
leaves zero residual violets.

### It audits itself

- **Residue audit** — sweeps the frontend for any *user-visible string* still
  naming the upstream product, ignoring identifier-shaped references like the
  `@gitroom/*` package scope that must not be renamed.
- **Telemetry audit** — reports upstream's analytics hooks. All are inert
  unless their env var is set, but you should know they exist:
  PostHog, Sentry, Datafast, a Meta pixel, GTM, Dub, and Plausible (which,
  oddly, activates off `STRIPE_PUBLISHABLE_KEY`). Leave them unset; if you
  enable any, list them in your privacy policy.
- **`.brand-manifest.json`** — written into the image, listing every
  modification, for AGPL §13 disclosure.

---

## 5. Getting updates: the actual procedure

```bash
./infra/overlay/upgrade.sh --list       # what releases exist
./infra/overlay/upgrade.sh v2.11.4      # check this one
```

The script:

1. Diffs the pinned tag against the target and reports how many files changed
   **in total** versus how many of the six files your rebrand depends on. If
   none of yours were touched, the upgrade is almost certainly free.
2. Flags database migrations and tells you to back up first.
3. Warns loudly if you are crossing the 2.12 line (see below).
4. Clones the target tag and **dry-runs the codemod against it**. This is the
   safety net: seconds of work that tells you, before building anything,
   whether this release rebrands cleanly.
5. Updates the pinned tag in `brand.json` so the deployed version is recorded
   in git.
6. Optionally builds the image.

Then deploy to staging and run the smoke test, which checks the thing the
codemod cannot — that the page a customer loads actually says your name:

```bash
node infra/overlay/smoke-test.mjs --url https://staging.your-app
```

It asserts: the app responds; your brand name is present; **no upstream
branding leaked**; your primary colour reached the compiled CSS; registration
is in the state you expect; and the AGPL source link resolves. Non-zero exit
means do not promote.

---

## 6. The one-way door at 2.12.0

`v2.11.3` is the last release before upstream replaced the BullMQ queue with
Temporal and moved off Alpine.

Going to 2.12.0 or later is **not a tag bump**. It needs a new Temporal service
with its own setup, and the compose topology changes. Treat it as a project:
stand Temporal up in a non-production environment, point a copy of the data at
it, confirm scheduled posts actually fire, then cut over.

Staying on 2.11.3 means no upstream fixes and no new platform integrations.
That is a real cost and it compounds. Plan the migration before you need it,
not when a security fix forces it.

The upgrade script warns when you cross this line.

---

## 7. What you must *not* change

Changing application logic converts a trivial rebrand into a fork, one commit
at a time. Specifically:

- **Do not add plan enforcement inside the app.** Billing lives beside it, in
  `packages/provisioning`. Upstream gates its own plan caps on
  `STRIPE_PUBLISHABLE_KEY`; we deliberately leave that unset, which means the
  app enforces nothing and **we** enforce limits — see
  `packages/provisioning/src/limits.ts`.
- **Do not patch registration to provision customers.** You do not need to.
  Reading `apps/backend/src/services/auth/auth.service.ts`:

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
  configured entirely by environment variables — **bypasses
  `DISABLE_REGISTRATION`**. So public signup stays closed while your
  provisioning service creates accounts by acting as the identity provider.
  No patch. See `packages/provisioning/src/provision/shared-sso.ts`.
- **Do not rename the `@gitroom/*` package scope.** It is the internal import
  path used by every file in the monorepo. The codemod skips it deliberately.

---

## 8. AGPL consequences, per option

| Option | Are you modifying? | §13 obligation |
|---|---|---|
| Tier 0, published image | No | Nothing beyond pointing at upstream |
| Tier 1/2/3, any rebrand | **Yes** | Offer the Corresponding Source of your modified version to your users |

A colour change and a logo swap are modifications. You are in scope. This costs
you nothing real: the modification *is* `apply-brand.mjs` plus `brand.json`,
both already in a public repo, and the footer links to it. The licence does not
require you to publish your marketing site, your billing code, or your
provisioning service — those are separate works that merely talk to it over a
network.

Full detail in [`06-agpl-compliance.md`](./06-agpl-compliance.md).

---

## 9. Quick reference

| I want to… | Do this |
|---|---|
| Change the product name | `name` in `packages/brand/brand.json`, then `pnpm brand:apply` |
| Change brand colours | `colors.primary` in `brand.json` (or copy a file from `packages/brand/palettes/`) |
| Change the logo | Edit the generator in `apply-brand.mjs` (`markSvg`, `logoComponent`) |
| Take an upstream update | `./infra/overlay/upgrade.sh <tag>` |
| Check branding survived | `node infra/overlay/apply-brand.mjs --target ./upstream --check` |
| Check a deployment is branded | `node infra/overlay/smoke-test.mjs --url <url>` |
| Run the stack locally | `docker compose -f infra/docker-compose.yml up -d` |
| Change plan limits | `packages/provisioning/src/limits.ts` + `apps/web/src/content/pricing.ts` |
| Change anything else in the app | Stop. Ask whether it belongs in the sidecar instead. |
