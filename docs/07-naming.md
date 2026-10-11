# Naming

The name is **not decided**. `packages/brand/brand.json` ships `"Kolo"` with
`"placeholder": true`, which makes the build warn and keeps the site
`noindex`. It exists so the site is demoable, nothing more.

## Why this blocks more than it looks like it does

The name picks the domain, and the domain is baked into `MAIN_URL`,
`FRONTEND_URL` and `NEXT_PUBLIC_BACKEND_URL` — which derive **every OAuth
redirect URI registered with every social platform**.

Changing it after registration means re-registering everywhere, and **on
LinkedIn a rejected app cannot be resurrected**. Three platforms verify or
review the domain.

So the order is: **name → domain → platform registrations.** Not any other way.

It is still step 8 of 9, not step 1 — everything else can be built first. But
it must land before a single app registration is submitted.

## What is already known about the taste

From four rejected rounds:

- **Liked:** "Postiz" itself — short, coined, playful, light.
- **Rejected:** ceremonial English nouns (Herald, Fanfare, Chorus).
- **Rejected:** formulaic suffixes (Dropiz, Castiz).
- **Rejected:** plain light words (Spool, Outpost, Slate).

So the target is a **coined, short, soft-sounding word** that is not an
existing English noun and does not look like a suffix bolted onto a stem.

## Hard constraints

1. **Nothing resembling "Postiz".** Upstream's own Terms §10 claim the Postiz
   name, logo and trademarks for Gitroom Limited / Gitroom LLC. The AGPL grants
   no trademark rights whatever. This is a separate body of law from the
   licence and the licence is no defence.
2. **The .com should be gettable.** Not essential, but a social tool with a
   hyphenated domain starts at a disadvantage.
3. **Check the trademark registers** (USPTO, EUIPO, and your own jurisdiction)
   in the relevant class before buying anything.
4. **Say it out loud.** It goes in support emails and on calls.

## Before suggesting more

The handover's advice, which still stands: **ask him to name two or three
brands he likes from any industry first.** Four rounds of rejection without
that is four rounds of guessing. The signal that actually came out of those
rounds was one word — "Postiz" — which is a thin basis for generating from.

## When the name is chosen

```bash
# 1. Edit packages/brand/brand.json
#      "name": "<the name>"
#      "legalName": "<the entity>"
#      "domain": "<the domain>"
#      "placeholder": false
#      "app": { "url": "https://app.<domain>" }

# 2. Re-skin both halves
pnpm brand:apply
node infra/overlay/apply-brand.mjs --target ./upstream

# 3. Confirm nothing upstream survived
node infra/overlay/apply-brand.mjs --target ./upstream --check
```

Setting `placeholder: false` also flips the marketing site from `noindex` to
indexable, so do not do it until you mean it.

The product name appears in exactly one place in each codebase. That was the
point of building it this way: the name is the last decision, and it costs
nothing to defer.
