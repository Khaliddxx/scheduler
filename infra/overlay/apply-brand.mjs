#!/usr/bin/env node
/**
 * apply-brand.mjs — rebrand a checkout of the upstream application, in place.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT A FORK OR A PATCH SERIES
 * ----------------------------------------------------------
 * The rebrand we need is entirely presentational: a colour palette, a logo, a
 * product name, a favicon. It touches no application logic. There are three
 * ways to carry such a change across upstream releases:
 *
 *   a fork          — diverges immediately, every upgrade is a merge, and after
 *                     a few months you are maintaining a product, not a brand.
 *   a patch series  — a stored diff rebased onto each new tag. Conflicts every
 *                     time upstream touches a line you also touched, and the
 *                     conflict is in THEIR code, which you do not know.
 *   a codemod       — this file. Nothing is stored as a diff. The change is
 *                     re-derived from whatever the current upstream source says.
 *
 * A codemod cannot conflict. It can only fail to find what it expected, and
 * that is the whole trick: every transform declares an ANCHOR it must match,
 * and a missing anchor is a hard error naming the file and what changed. So an
 * upgrade either rebrands cleanly or stops with a precise, actionable message —
 * it never half-applies and never silently ships upstream's branding.
 *
 * USAGE
 *   node apply-brand.mjs --target /path/to/upstream-checkout
 *   node apply-brand.mjs --target /path/to/checkout --check    # verify only
 *   node apply-brand.mjs --target /path/to/checkout --dry-run  # report, write nothing
 *
 * AGPL NOTE
 * Everything this script changes is a modification under AGPL-3.0 section 13,
 * so the result must be offered to users. That is fine and costs nothing: this
 * file IS the modification, it lives in a public repo, and the footer links to
 * it. See docs/06-agpl-compliance.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const TARGET = path.resolve(
  opt('target', process.env.UPSTREAM_DIR || './upstream'),
);
const CHECK_ONLY = flag('check');
const DRY_RUN = flag('dry-run');

const brand = JSON.parse(
  fs.readFileSync(path.join(REPO, 'packages', 'brand', 'brand.json'), 'utf8'),
);

/* ------------------------------------------------------------------ */
/* Reporting                                                           */
/* ------------------------------------------------------------------ */

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const problems = [];
const applied = [];
const notes = [];

const fail = (transform, message, hint) => {
  problems.push({ transform, message, hint });
};

/* ------------------------------------------------------------------ */
/* Colour maths                                                        */
/* ------------------------------------------------------------------ */

const hexToRgb = (hex) => {
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  '#' +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');

const rgbToHsl = ({ r, g, b }) => {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6;
    else if (max === G) h = ((B - R) / d + 2) / 6;
    else h = ((R - G) / d + 4) / 6;
  }
  return { h: h * 360, s, l };
};

const hslToRgb = ({ h, s, l }) => {
  const H = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const conv = (t) => {
    let T = t;
    if (T < 0) T += 1;
    if (T > 1) T -= 1;
    if (T < 1 / 6) return p + (q - p) * 6 * T;
    if (T < 1 / 2) return q;
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6;
    return p;
  };
  return { r: conv(H + 1 / 3) * 255, g: conv(H) * 255, b: conv(H - 1 / 3) * 255 };
};

/**
 * Upstream's brand hue, used as the reference point for the remap below.
 * Every purple in upstream's palette is expressed as an offset from this, so
 * shifting one colour shifts the whole family coherently instead of leaving a
 * dozen stray violets behind.
 */
const UPSTREAM_BASE = '#612bd3';

/**
 * How far from the upstream brand hue a colour can sit and still be considered
 * part of the brand family.
 *
 * This window is the whole reason the remap is safe. A blanket hue rotation
 * over every saturated colour also rotates the SEMANTIC ones — error red,
 * destructive red, success green, warning amber — and a destructive button that
 * has quietly turned violet no longer reads as dangerous. It also rotates
 * PLATFORM colours, so the network's own blue stops matching its brand.
 *
 * +/-25 degrees around the base captures the violet/indigo family the product
 * actually uses for branding, and leaves everything else exactly as upstream
 * shipped it.
 */
const BRAND_HUE_WINDOW = 25;

/**
 * Colours never touched, whatever their hue: semantic states and third-party
 * platform brand colours. Listed explicitly so the intent survives someone
 * later widening the hue window.
 */
const PRESERVE_HEX = new Set(
  [
    '#f97066', // error / destructive foreground
    '#b91c1c', // destructive background
    '#32d583', // success
    '#ffac30', // warning
    '#eaff00', // highlight
    '#1d9bf0', // X brand blue
    '#e4b895', // avatar/skin tone in illustrations
  ].map((h) => h.toLowerCase()),
);

const hueDistance = (a, b) => {
  const d = Math.abs(((a - b + 180 + 360) % 360) - 180);
  return d;
};

const makeRemap = (fromHex, toHex) => {
  const from = rgbToHsl(hexToRgb(fromHex));
  const to = rgbToHsl(hexToRgb(toHex));
  const dh = to.h - from.h;
  // Guard against a grey target collapsing saturation to zero across the family.
  const sRatio = from.s === 0 ? 1 : to.s / from.s;
  const dl = to.l - from.l;

  const baseHue = from.h;

  return (hex) => {
    if (PRESERVE_HEX.has(hex.toLowerCase())) return hex;
    const hsl = rgbToHsl(hexToRgb(hex));
    // Leave neutrals alone: they are chrome, not brand.
    if (hsl.s < 0.08) return hex;
    // Leave anything outside the brand hue family alone: semantic states and
    // third-party platform colours must survive a rebrand unchanged.
    if (hueDistance(hsl.h, baseHue) > BRAND_HUE_WINDOW) return hex;
    return rgbToHex(
      hslToRgb({
        h: hsl.h + dh,
        s: Math.max(0, Math.min(1, hsl.s * sRatio)),
        // Nudge lightness, but only a fraction, so contrast ratios survive.
        l: Math.max(0.02, Math.min(0.98, hsl.l + dl * 0.35)),
      }),
    );
  };
};

const remap = makeRemap(UPSTREAM_BASE, brand.colors.primary);

/**
 * Named tokens we set outright rather than deriving, because they carry
 * specific meaning in the UI and should match the marketing site exactly.
 */
const EXPLICIT_TOKENS = {
  '--new-btn-primary': brand.colors.primary,
  '--new-ai-btn': brand.colors.accentDeep,
  '--new-table-text-focused': brand.colors.accent,
  '--new-bgColor': brand.colors.bg,
  '--new-bgColorInner': brand.colors.bgInner,
  '--new-bgLineColor': brand.colors.bgLine,
  '--new-border': brand.colors.border,
  '--new-blockSeparator': brand.colors.separator,
  '--new-big-strips': brand.colors.surface,
  '--new-textItemBlur': brand.colors.textDim,
  '--color-forth': brand.colors.primary,
  '--color-seventh': brand.colors.primaryHover,
};

/* ------------------------------------------------------------------ */
/* File helpers                                                        */
/* ------------------------------------------------------------------ */

const abs = (rel) => path.join(TARGET, rel);
const exists = (rel) => fs.existsSync(abs(rel));
const read = (rel) => fs.readFileSync(abs(rel), 'utf8');

const write = (rel, content) => {
  if (DRY_RUN || CHECK_ONLY) return;
  fs.mkdirSync(path.dirname(abs(rel)), { recursive: true });
  fs.writeFileSync(abs(rel), content, 'utf8');
};

/* ------------------------------------------------------------------ */
/* Transforms                                                          */
/* ------------------------------------------------------------------ */

/**
 * Each transform is: where it acts, what it must find (the anchor), and what it
 * does. `verify` answers "is this already applied?" for --check mode.
 */
const transforms = [
  /* ---------------------------------------------------------------- */
  {
    id: 'colors',
    file: 'apps/frontend/src/app/colors.scss',
    describe: 'Theme palette — remap the brand hue, pin the named tokens',
    anchor: /--new-btn-primary:\s*#[0-9a-fA-F]{3,8}/,
    anchorHint:
      'Upstream renamed or restructured the colour variables. Open the file, find the new primary-button token, and update EXPLICIT_TOKENS in this script.',
    apply(src) {
      let out = src;
      let changed = 0;

      // ORDER MATTERS. The generic remap runs FIRST, over every saturated
      // colour in the file, so no stray upstream violet survives in some custom
      // token we never named. Only then are the named tokens pinned to their
      // exact values. Doing it the other way round lets the generic pass shift
      // the pinned values a second time and the brand colour drifts off-hue.
      out = out.replace(/#[0-9a-fA-F]{6}\b/g, (hex) => {
        const next = remap(hex);
        if (next.toLowerCase() !== hex.toLowerCase()) changed += 1;
        return next;
      });

      for (const [token, value] of Object.entries(EXPLICIT_TOKENS)) {
        const re = new RegExp(`(${token}\\s*:\\s*)(#[0-9a-fA-F]{3,8})`, 'g');
        out = out.replace(re, (_m, head) => {
          changed += 1;
          return `${head}${value}`;
        });
      }

      if (changed === 0) {
        fail('colors', 'Matched the file but changed nothing.', 'Check that brand.json colours actually differ from upstream.');
      }
      return out;
    },
    verify(src) {
      return src.includes(brand.colors.primary.toLowerCase()) ||
        src.includes(brand.colors.primary.toUpperCase());
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'logo-icon',
    file: 'apps/frontend/src/components/new-layout/logo.tsx',
    describe: 'Sidebar logo mark',
    anchor: /export const Logo\s*=/,
    anchorHint:
      'The Logo component was renamed or moved. Find the new sidebar logo component and point this transform at it.',
    apply() {
      return logoComponent('Logo', 40);
    },
    verify(src) {
      return src.includes(BRAND_MARKER);
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'logo-wordmark',
    file: 'apps/frontend/src/components/ui/logo-text.component.tsx',
    describe: 'Wordmark used in the auth screens and header',
    anchor: /export const LogoTextComponent\s*=/,
    anchorHint:
      'The wordmark component was renamed or moved. Search the frontend for the auth-screen logo.',
    apply() {
      return wordmarkComponent();
    },
    verify(src) {
      return src.includes(BRAND_MARKER);
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'public-logos',
    file: 'apps/frontend/public/logo.svg',
    describe: 'Static logo assets served from /public',
    anchor: /<svg/i,
    anchorHint: 'public/logo.svg is missing or is no longer an SVG.',
    apply() {
      // Write the siblings too; they are the same mark at different crops.
      for (const rel of [
        'apps/frontend/public/logo-text.svg',
        'apps/frontend/public/postiz.svg',
        'apps/frontend/public/postiz-text.svg',
      ]) {
        if (exists(rel)) write(rel, markSvg());
      }
      return markSvg();
    },
    verify(src) {
      return src.includes(BRAND_MARKER);
    },
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'product-name-tsx',
    glob: {
      roots: ['apps/frontend/src', 'libraries'],
      exts: ['.tsx', '.ts'],
    },
    describe: 'Product name in UI strings',
    apply: null, // handled by the glob runner below
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'translations',
    glob: {
      roots: ['libraries/react-shared-libraries/src/translation/locales'],
      exts: ['.json'],
    },
    describe: 'Product name in translation bundles (all locales)',
    apply: null,
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'analytics-domain',
    file: 'apps/frontend/src/app/(app)/layout.tsx',
    describe: 'Third-party analytics domain attribute',
    anchor: /data-domain="[^"]*"/,
    anchorHint:
      'The analytics script block moved. Re-check the root layout for hardcoded upstream domains before shipping.',
    optional: true,
    apply(src) {
      return src.replace(/data-domain="[^"]*"/g, `data-domain="${brand.domain}"`);
    },
    verify(src) {
      return src.includes(`data-domain="${brand.domain}"`);
    },
  },
];

/* ------------------------------------------------------------------ */
/* Generated assets                                                    */
/* ------------------------------------------------------------------ */

/** Lets --check tell a branded build from a stock one. */
const BRAND_MARKER = `brand:${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

const initial = brand.name.charAt(0).toUpperCase();

const markSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none" role="img" aria-label="${brand.name}">
  <!-- ${BRAND_MARKER} -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="${brand.colors.gradientFrom}"/>
      <stop offset="0.5" stop-color="${brand.colors.gradientVia}"/>
      <stop offset="1" stop-color="${brand.colors.gradientTo}"/>
    </linearGradient>
  </defs>
  <rect width="60" height="60" rx="16" fill="url(#bg)"/>
  <text x="30" y="31" text-anchor="middle" dominant-baseline="central"
        font-family="Plus Jakarta Sans, DM Sans, system-ui, sans-serif"
        font-size="30" font-weight="800" fill="#ffffff">${initial}</text>
</svg>
`;

const logoComponent = (exportName, size) => `'use client';

// ${BRAND_MARKER}
// GENERATED by infra/overlay/apply-brand.mjs from packages/brand/brand.json.
// Do not edit here — edit brand.json and re-run \`pnpm brand:apply\`.

export const ${exportName} = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 60 60"
      fill="none"
      role="img"
      aria-label="${brand.name}"
      className="mt-[8px]"
    >
      <defs>
        <linearGradient id="brandMarkBg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="${brand.colors.gradientFrom}" />
          <stop offset="0.5" stopColor="${brand.colors.gradientVia}" />
          <stop offset="1" stopColor="${brand.colors.gradientTo}" />
        </linearGradient>
      </defs>
      <rect width="60" height="60" rx="16" fill="url(#brandMarkBg)" />
      <text
        x="30"
        y="31"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Plus Jakarta Sans, DM Sans, system-ui, sans-serif"
        fontSize="30"
        fontWeight="800"
        fill="#ffffff"
      >
        ${initial}
      </text>
    </svg>
  );
};
`;

const wordmarkComponent = () => `import React from 'react';

// ${BRAND_MARKER}
// GENERATED by infra/overlay/apply-brand.mjs from packages/brand/brand.json.

export const LogoTextComponent = () => {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
      aria-label="${brand.name}"
    >
      <svg width="33" height="33" viewBox="0 0 60 60" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="brandWordBg" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="${brand.colors.gradientFrom}" />
            <stop offset="0.5" stopColor="${brand.colors.gradientVia}" />
            <stop offset="1" stopColor="${brand.colors.gradientTo}" />
          </linearGradient>
        </defs>
        <rect width="60" height="60" rx="16" fill="url(#brandWordBg)" />
        <text
          x="30"
          y="31"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Plus Jakarta Sans, DM Sans, system-ui, sans-serif"
          fontSize="30"
          fontWeight="800"
          fill="#ffffff"
        >
          ${initial}
        </text>
      </svg>
      <span
        style={{
          fontFamily: 'Plus Jakarta Sans, DM Sans, system-ui, sans-serif',
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: '-0.02em',
          color: 'currentColor',
        }}
      >
        ${brand.name}
      </span>
    </span>
  );
};
`;

/* ------------------------------------------------------------------ */
/* Product-name replacement                                            */
/* ------------------------------------------------------------------ */

/**
 * Names to replace. 'Gitroom' is upstream's older brand and still appears in
 * the non-general code path; both must go or the UI shows two different product
 * names depending on an env var.
 */
const UPSTREAM_NAMES = ['Postiz', 'postiz', 'POSTIZ', 'Gitroom', 'gitroom'];

/**
 * Paths where the upstream name is an identifier, not user-facing text —
 * package scopes, import paths, env var names, API hostnames. Renaming those
 * breaks the build, which is exactly the kind of damage a blunt find-and-replace
 * does. We skip them.
 */
const NAME_SKIP = [
  /@gitroom\//,              // internal package scope, used in every import
  /gitroomhq/,               // GitHub org in URLs
  /from\s+['"][^'"]*gitroom/, // import specifiers
  /require\(['"][^'"]*gitroom/,
  /process\.env\./,
  /api\.postiz\.com/,
  /docs\.postiz\.com/,
  /\.postiz\.com/,
];

const walk = (dir, exts, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
};

const replaceNames = (content) => {
  let changed = 0;
  const lines = content.split('\n');
  const next = lines.map((line) => {
    if (NAME_SKIP.some((re) => re.test(line))) return line;
    let out = line;
    for (const name of UPSTREAM_NAMES) {
      if (!out.includes(name)) continue;
      const replacement =
        name === name.toUpperCase()
          ? brand.name.toUpperCase()
          : name[0] === name[0].toLowerCase()
            ? brand.name.toLowerCase()
            : brand.name;
      const re = new RegExp(`\\b${name}\\b`, 'g');
      const after = out.replace(re, replacement);
      if (after !== out) changed += 1;
      out = after;
    }
    return out;
  });
  return { content: next.join('\n'), changed };
};

const runGlobTransform = (t) => {
  const files = t.glob.roots.flatMap((root) =>
    walk(path.join(TARGET, root), t.glob.exts),
  );
  let touched = 0;
  let hits = 0;

  for (const full of files) {
    const rel = path.relative(TARGET, full);
    const src = fs.readFileSync(full, 'utf8');
    if (!UPSTREAM_NAMES.some((n) => src.includes(n))) continue;
    const { content, changed } = replaceNames(src);
    if (changed > 0 && content !== src) {
      write(rel, content);
      touched += 1;
      hits += changed;
    }
  }

  if (files.length === 0) {
    fail(t.id, `No files found under ${t.glob.roots.join(', ')}.`, 'The upstream layout changed; update the roots in this transform.');
    return;
  }

  applied.push({ id: t.id, describe: t.describe, detail: `${hits} replacement(s) across ${touched} file(s)` });
};

/* ------------------------------------------------------------------ */
/* Telemetry audit                                                     */
/* ------------------------------------------------------------------ */

/**
 * Upstream ships integrations that phone home when their env var is set:
 * Plausible, PostHog, Sentry, Dub, a Facebook pixel, GTM and Datafast. None
 * activate unless configured, but a reseller must know they exist — both to
 * keep customer data out of someone else's analytics, and because a privacy
 * policy has to list its sub-processors honestly.
 */
const TELEMETRY = [
  ['NEXT_PUBLIC_POSTHOG_KEY', 'PostHog product analytics'],
  ['DATAFAST_WEBSITE_ID', 'Datafast analytics'],
  ['NEXT_PUBLIC_SENTRY_DSN', 'Sentry error reporting'],
  ['SENTRY_DSN', 'Sentry error reporting (server)'],
  ['FACEBOOK_PIXEL_ID', 'Meta pixel'],
  ['GTM_ID', 'Google Tag Manager'],
  ['NEXT_PUBLIC_DUB_ID', 'Dub analytics'],
  ['STRIPE_PUBLISHABLE_KEY', 'Stripe billing AND Plausible analytics'],
];

/**
 * After rebranding, sweep the frontend for anything user-visible that still
 * says the upstream name. Identifier-shaped references (the @gitroom/* package
 * scope, upstream API hostnames) are expected and deliberately skipped by the
 * replacer; what we are hunting is a *string a customer could read*.
 *
 * This is the check that answers "did the upgrade quietly break my branding?".
 */
const auditResidue = () => {
  const files = walk(path.join(TARGET, 'apps', 'frontend', 'src'), ['.tsx', '.ts']);
  const residue = [];

  for (const full of files) {
    const rel = path.relative(TARGET, full);
    const lines = fs.readFileSync(full, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (NAME_SKIP.some((re) => re.test(line))) return;
      if (!/\b(Postiz|Gitroom)\b/.test(line)) return;
      // Only flag it if it sits inside a quoted string — that is what renders.
      if (!/['"`]/.test(line)) return;
      residue.push(`${rel}:${i + 1}  ${line.trim().slice(0, 100)}`);
    });
  }

  if (residue.length) {
    notes.push(
      `${residue.length} user-visible reference(s) to the upstream name survived the rebrand:\n` +
        residue.slice(0, 12).map((r) => `      ${r}`).join('\n') +
        (residue.length > 12 ? `\n      ...and ${residue.length - 12} more` : '') +
        '\n    Add the pattern to UPSTREAM_NAMES or NAME_SKIP in this script as appropriate.',
    );
  } else {
    applied.push({
      id: 'residue-audit',
      describe: 'Residual upstream branding',
      detail: 'none found in user-visible strings',
    });
  }
};

const auditTelemetry = () => {
  const found = TELEMETRY.filter(([key]) => {
    try {
      const hits = walk(path.join(TARGET, 'apps'), ['.ts', '.tsx']).filter((f) =>
        fs.readFileSync(f, 'utf8').includes(key),
      );
      return hits.length > 0;
    } catch {
      return false;
    }
  });
  if (found.length) {
    notes.push(
      `Telemetry hooks present in upstream (inert unless the env var is set): ${found
        .map(([k, what]) => `${k} (${what})`)
        .join(', ')}. Leave them unset, and list any you DO enable in your privacy policy.`,
    );
  }
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const main = () => {
  console.log(
    `\n${C.bold('apply-brand')}  ${C.dim('→')} ${brand.name}  ${C.dim(`(target: ${TARGET})`)}`,
  );

  if (!fs.existsSync(TARGET)) {
    console.error(
      C.red(`\n  Target directory does not exist: ${TARGET}\n`) +
        C.dim('  Pass --target /path/to/upstream-checkout, or set UPSTREAM_DIR.\n'),
    );
    process.exit(2);
  }

  if (brand.placeholder) {
    notes.push(
      `Product name "${brand.name}" is still flagged as a placeholder in brand.json. ` +
        'Set placeholder:false once the real name is chosen — the name is baked into ' +
        'OAuth callback URLs and is expensive to change later.',
    );
  }

  for (const t of transforms) {
    if (t.glob) {
      if (CHECK_ONLY) continue;
      runGlobTransform(t);
      continue;
    }

    if (!exists(t.file)) {
      if (t.optional) {
        notes.push(`Skipped optional transform "${t.id}": ${t.file} not present.`);
        continue;
      }
      fail(t.id, `Expected file is missing: ${t.file}`, t.anchorHint);
      continue;
    }

    const src = read(t.file);

    if (CHECK_ONLY) {
      // An optional transform with nothing to match was correctly skipped on
      // the way in; it must not now be reported as unapplied on the way out.
      if (t.optional && t.anchor && !t.anchor.test(src)) {
        applied.push({ id: t.id, describe: t.describe, detail: 'not applicable' });
      } else if (t.verify && !t.verify(src)) {
        fail(t.id, `Brand NOT applied in ${t.file}`, 'Run apply-brand without --check.');
      } else {
        applied.push({ id: t.id, describe: t.describe, detail: 'verified' });
      }
      continue;
    }

    if (t.anchor && !t.anchor.test(src)) {
      // An OPTIONAL transform targets something upstream may or may not ship
      // (an analytics block, say). Its absence is information, not a failure.
      // A REQUIRED transform's missing anchor means upstream moved something we
      // depend on, and shipping would leak their branding — so that is fatal.
      if (t.optional) {
        notes.push(
          `Skipped optional transform "${t.id}": nothing matching in ${t.file}. ` +
            'Nothing to rebrand here in this upstream version.',
        );
      } else {
        fail(
          t.id,
          `Anchor not found in ${t.file} — upstream changed this file in a way this transform does not understand.`,
          t.anchorHint,
        );
      }
      continue;
    }

    const out = t.apply(src);
    if (typeof out === 'string' && out !== src) {
      write(t.file, out);
      applied.push({ id: t.id, describe: t.describe, detail: t.file });
    } else if (typeof out === 'string') {
      applied.push({ id: t.id, describe: t.describe, detail: `${t.file} (no change needed)` });
    }
  }

  if (!CHECK_ONLY) {
    auditResidue();
    auditTelemetry();
  }

  /* ---- report ---- */

  console.log('');
  for (const a of applied) {
    console.log(`  ${C.green('✓')} ${a.id.padEnd(18)} ${C.dim(a.detail)}`);
  }

  for (const n of notes) {
    console.log(`\n  ${C.yellow('!')} ${n}`);
  }

  if (problems.length) {
    console.error(`\n${C.red(C.bold('  Branding did not fully apply.'))}\n`);
    for (const p of problems) {
      console.error(`  ${C.red('✗')} ${C.bold(p.transform)}: ${p.message}`);
      if (p.hint) console.error(`    ${C.dim('→ ' + p.hint)}`);
    }
    console.error(
      `\n  ${C.dim('This is the designed failure mode: an upstream change moved something this')}` +
        `\n  ${C.dim('script relies on. Fix the transform above rather than hand-editing the')}` +
        `\n  ${C.dim('checkout, so the fix survives the next upgrade too.')}\n`,
    );
    process.exit(1);
  }

  if (!CHECK_ONLY && !DRY_RUN) {
    const manifest = {
      brand: brand.name,
      upstreamTag: brand.upstream.pinnedTag,
      marker: BRAND_MARKER,
      transforms: applied.map((a) => ({ id: a.id, detail: a.detail })),
      note:
        'Generated by infra/overlay/apply-brand.mjs. Lists every modification made ' +
        'to the upstream source, for AGPL-3.0 section 13 disclosure.',
    };
    write('.brand-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  }

  console.log(
    `\n  ${C.green(C.bold(CHECK_ONLY ? 'Brand verified.' : 'Brand applied.'))} ${C.dim(
      `${applied.length} transform(s).`,
    )}\n`,
  );
};

main();
