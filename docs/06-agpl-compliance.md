# AGPL-3.0 compliance

Read against the actual `LICENSE` file in the upstream repository, not from
memory. This is not legal advice; it is an engineer's reading, written so you
know what to ask a lawyer about if you want one.

---

## The two-sentence version

Selling access to this software is **explicitly permitted**. In exchange, if
you modify it and let people use it over a network, you must offer those people
the source of your modified version — which costs you a public repository and a
footer link, and nothing else.

---

## What the licence actually says

**Section 4** permits conveying copies for a fee:

> You may charge any price or no price for each copy that you convey, and you
> may offer support or warranty protection for a fee.

There are no additional commercial clauses layered on top in this repository.
No Commons Clause, no BSL, no "non-compete" rider.

**Section 13** is the one that applies to a hosted service:

> if you modify the Program, your modified version must prominently offer all
> users interacting with it remotely through a computer network … an
> opportunity to receive the Corresponding Source of your version

Three things follow from the exact wording:

1. **It only bites if you modify.** Running the published image unmodified
   triggers nothing.
2. **The duty runs to *your users*,** not to the public at large. A public repo
   satisfies it comfortably and is simpler than gatekeeping.
3. **"Corresponding Source" means the source of the work you are running** —
   the modified application — not everything you own.

---

## Are you modifying? Yes.

Changing colours, the logo and the product name are modifications. You are in
scope. Don't look for a way around this; the compliant path is cheap.

---

## What you must publish, and what you need not

### Must

- The modified application source, or equivalently everything needed to
  reproduce it: the pinned upstream tag plus `infra/overlay/apply-brand.mjs`
  and `packages/brand/brand.json`. Those two files *are* the modification.
- A prominent offer to users. A permanent footer link is the normal discharge.

### Need not

This is where people over-comply and give away work they did not have to:

- **The marketing site.** A separate program that merely links to the app.
- **The billing and provisioning service.** It talks to the application over a
  network; it is not a derivative of it. Keeping it architecturally separate is
  what preserves this, which is one more reason billing is a sidecar.
- **Your customer list, pricing, configuration or secrets.** Obviously.

The architecture and the licence line up here, and not by accident: the sidecar
design means the only thing you ever have to publish is the thing you were
going to publish anyway.

---

## How this repository discharges it

| Obligation | Where |
|---|---|
| Offer the source | Footer link on every page → `brand.upstream.sourceOfferUrl` |
| Publish the modification | `infra/overlay/apply-brand.mjs` + `packages/brand/brand.json`, public |
| Identify the version | `brand.upstream.pinnedTag`, and `.brand-manifest.json` baked into the image |
| Record what changed | `.brand-manifest.json` lists every transform applied |
| Preserve licence notices | The codemod never touches `LICENSE` or copyright headers |
| State non-affiliation | Footer and `/open-source` |

The footer line is a compliance artifact. Don't let a redesign quietly remove
it.

---

## Trademark: a separate problem the licence does not solve

**The AGPL grants no trademark rights.** Copyright permission to use the code
says nothing about the name.

- **Do not name your product anything resembling the upstream project's name.**
  The handover already landed on this and it is right. A confusingly similar
  name is a trademark question, and the licence is no defence.
- **Nominative use is normally fine.** Saying "built on *X*, licensed AGPL-3.0"
  is accurate attribution, not a claim of endorsement — and §13 pushes you
  toward saying it anyway. Pair it with an explicit non-affiliation line, which
  the footer does.
- **Do not keep upstream's logo** in the shipped application. The codemod
  replaces it. That is a trademark reason as much as a branding one.
- **Trade dress is also separate.** A look and feel closely imitating another
  product can raise a question even where the code licence is satisfied. The
  site here deliberately matches the *structure* you asked for while the
  palette is a one-line swap — `packages/brand/palettes/` has alternates and
  the reasoning.

---

## Practical checklist

- [ ] Public repository containing `infra/overlay/` and `packages/brand/`
- [ ] `brand.upstream.sourceOfferUrl` points at it and resolves (the smoke test
      checks this)
- [ ] Footer source link present on every page
- [ ] Non-affiliation statement in the footer and on `/open-source`
- [ ] `LICENSE` and copyright headers untouched in the built image
- [ ] `.brand-manifest.json` present in the image
- [ ] Product name does not resemble the upstream name
- [ ] Upstream's logo does not ship in your build
- [ ] `/open-source` page live and linked

---

## The commercial reality, stated plainly

The handover put this bluntly and it is worth repeating, because it shapes
where effort should go:

Modifications **buy no moat** — publishing them is compulsory. They **do cost**
merge pain on every upgrade. So the software is not where your advantage can
come from; it is identical to a free product by design.

The advantage has to come from the things the licence does not reach: the
platform app registrations you hold and maintain, the operations, the support,
the brand, and whoever you choose to sell to. That is also exactly where your
costs are — see [`05-pricing-and-packaging.md`](./05-pricing-and-packaging.md)
and [`03-oauth-app-registration.md`](./03-oauth-app-registration.md).
