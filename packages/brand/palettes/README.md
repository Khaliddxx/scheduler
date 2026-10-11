# Alternate palettes

`brand.json` ships with the **violet** palette, which deliberately matches the
reference design the marketing site was built against — that was the brief.

It is also, however, the upstream project's own palette. Two reasons you may
want to move off it before you sell:

1. **Differentiation.** When the software is functionally identical to a free
   open-source product, the brand is doing most of the work. Sharing the
   upstream's exact colour signature spends that advantage for nothing.
2. **Trade dress.** Copyright and trademark are separate from the AGPL. A look
   and feel closely imitating another product's can raise a trade-dress
   question even where the licence plainly permits the code. A different
   palette removes the argument cheaply.

## Swapping

Copy a palette's `colors` block over the `colors` block in
`packages/brand/brand.json`, then:

```bash
pnpm brand:apply                       # re-skins the marketing site
node infra/overlay/apply-brand.mjs --target ./upstream   # re-skins the app
```

The application's palette is **derived**, not hand-mapped: `apply-brand.mjs`
measures the hue, saturation and lightness delta between the upstream base
violet and your `primary`, then applies that shift to every saturated colour in
the app's stylesheet. Neutral greys are left alone. So one colour change moves
the whole product coherently instead of leaving stray violets behind.
