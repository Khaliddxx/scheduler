#!/usr/bin/env node
/**
 * smoke-test.mjs — prove a deployed instance is actually branded and actually working.
 *
 * Run this after every upgrade, against the new deployment, BEFORE cutting
 * production over. It answers the question the codemod cannot: the build
 * succeeded, but does the thing a customer loads in a browser say your name?
 *
 *   node infra/overlay/smoke-test.mjs --url https://app.example.com
 *
 * Exit code 0 = safe to promote. Non-zero = do not promote.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const brand = JSON.parse(
  fs.readFileSync(path.join(REPO, 'packages', 'brand', 'brand.json'), 'utf8'),
);

const argv = process.argv.slice(2);
const opt = (n, d = null) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const BASE = (opt('url', process.env.APP_URL || brand.app.url) || '').replace(/\/$/, '');
const TIMEOUT = Number(opt('timeout', '20000'));

if (!BASE) {
  console.error('No URL. Pass --url https://your-app, or set APP_URL.');
  process.exit(2);
}

const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const results = [];
const record = (name, ok, detail, fatal = true) =>
  results.push({ name, ok, detail, fatal });

const fetchText = async (url) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'brand-smoke-test' },
    });
    return { status: res.status, body: await res.text(), headers: res.headers };
  } finally {
    clearTimeout(t);
  }
};

const run = async () => {
  console.log(`\n${C.bold('smoke test')} ${C.dim(BASE)}\n`);

  /* 1. The app responds at all. */
  let login;
  try {
    login = await fetchText(`${BASE}${brand.app.loginPath}`);
    record('reachable', login.status < 500, `HTTP ${login.status} on ${brand.app.loginPath}`);
  } catch (e) {
    record('reachable', false, `request failed: ${e.message}`);
    report();
    return;
  }

  const html = login.body;

  /* 2. It says OUR name. This is the check that catches a broken rebrand. */
  const hasBrand = html.includes(brand.name);
  record(
    'brand name present',
    hasBrand,
    hasBrand ? `found "${brand.name}"` : `"${brand.name}" does not appear in the login page HTML`,
  );

  /* 3. It does NOT say upstream's. */
  const leaks = ['Postiz', 'Gitroom'].filter((n) => {
    // Ignore identifier-shaped occurrences, which are expected and harmless.
    const userFacing = html
      .split('\n')
      .filter((l) => !/@gitroom\/|gitroomhq|\.postiz\.com/.test(l))
      .join('\n');
    return new RegExp(`\\b${n}\\b`).test(userFacing);
  });
  record(
    'no upstream branding',
    leaks.length === 0,
    leaks.length ? `leaked: ${leaks.join(', ')}` : 'none visible',
  );

  /* 4. The brand colour reached the compiled stylesheet. */
  const cssHrefs = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]);
  if (cssHrefs.length === 0) {
    record('brand colour in CSS', false, 'no stylesheet link found in the HTML', false);
  } else {
    let found = false;
    const want = brand.colors.primary.toLowerCase().replace('#', '');
    for (const href of cssHrefs.slice(0, 6)) {
      const url = href.startsWith('http') ? href : `${BASE}${href.startsWith('/') ? '' : '/'}${href}`;
      try {
        const css = await fetchText(url);
        if (css.body.toLowerCase().includes(want)) {
          found = true;
          break;
        }
      } catch {
        /* a missing stylesheet is caught by the check below */
      }
    }
    record(
      'brand colour in CSS',
      found,
      found
        ? `${brand.colors.primary} present in compiled CSS`
        : `${brand.colors.primary} NOT found — the palette did not reach the build`,
    );
  }

  /* 5. Registration is open. A product nobody can sign up for is not selling. */
  try {
    const reg = await fetchText(`${BASE}${brand.app.registerPath}`);
    const closed = reg.status === 404 || /registration (is )?(closed|disabled)/i.test(reg.body);
    record(
      'registration open',
      !closed,
      closed
        ? 'signup appears closed — DISABLE_REGISTRATION is probably still set'
        : `HTTP ${reg.status}`,
      false,
    );
  } catch (e) {
    record('registration open', false, `could not check: ${e.message}`, false);
  }

  /* 6. The AGPL source offer is reachable. */
  try {
    const src = await fetchText(brand.upstream.sourceOfferUrl);
    record(
      'source offer reachable',
      src.status < 400,
      `HTTP ${src.status} on ${brand.upstream.sourceOfferUrl}`,
      false,
    );
  } catch (e) {
    record('source offer reachable', false, e.message, false);
  }

  report();
};

const report = () => {
  for (const r of results) {
    const mark = r.ok ? C.green('PASS') : r.fatal ? C.red('FAIL') : C.yellow('WARN');
    console.log(`  ${mark}  ${r.name.padEnd(24)} ${C.dim(r.detail)}`);
  }

  const fatal = results.filter((r) => !r.ok && r.fatal);
  const warn = results.filter((r) => !r.ok && !r.fatal);

  console.log('');
  if (fatal.length) {
    console.log(C.red(C.bold(`  ${fatal.length} blocking failure(s). Do not promote this build.\n`)));
    process.exit(1);
  }
  if (warn.length) {
    console.log(C.yellow(`  ${warn.length} warning(s). Safe to promote, but look at them.\n`));
  } else {
    console.log(C.green(C.bold('  All checks passed.\n')));
  }
};

run().catch((e) => {
  console.error(C.red(`\nsmoke test crashed: ${e.message}\n`));
  process.exit(2);
});
