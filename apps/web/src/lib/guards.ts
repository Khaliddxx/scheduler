/**
 * Build-time guards against shipping placeholder content.
 *
 * Two things in this repo are stand-ins that would be embarrassing or unlawful
 * to publish: the product name, and the testimonials. These guards make the
 * build complain rather than letting either slip out quietly.
 *
 * Set ALLOW_PLACEHOLDERS=1 to silence them while you are still building.
 */
import { brand } from '@scheduler/brand';
import { hasPlaceholderProof } from '@/content/testimonials';

const allow = process.env.ALLOW_PLACEHOLDERS === '1';

export interface PlaceholderWarning {
  what: string;
  why: string;
  fix: string;
}

export const placeholderWarnings = (): PlaceholderWarning[] => {
  const out: PlaceholderWarning[] = [];

  if (brand.placeholder) {
    out.push({
      what: `Product name is still the placeholder "${brand.name}"`,
      why: 'The name feeds OAuth callback URLs registered with every social platform, so changing it after launch means re-registering all of them.',
      fix: 'Set `name`, `domain` and `placeholder: false` in packages/brand/brand.json, then run `pnpm brand:apply`.',
    });
  }

  if (hasPlaceholderProof) {
    out.push({
      what: 'Testimonials are fabricated placeholders',
      why: 'Publishing invented endorsements attributed to named people breaches advertising rules in the US, UK and EU, and is trivially detectable.',
      fix: 'Replace them in src/content/testimonials.ts with real permissioned quotes, or remove the section until you have some.',
    });
  }

  return out;
};

/**
 * Called from the root layout. Logs loudly during build and dev; never throws,
 * because a half-built site that refuses to render is harder to work on than
 * one that nags.
 */
export const reportPlaceholders = (): void => {
  if (allow) return;
  const warnings = placeholderWarnings();
  if (!warnings.length) return;

  const lines = warnings.map(
    (w, i) => `  ${i + 1}. ${w.what}\n     why: ${w.why}\n     fix: ${w.fix}`,
  );
  // eslint-disable-next-line no-console
  console.warn(
    `\n\x1b[33m[placeholder content]\x1b[0m ${warnings.length} item(s) must be resolved before launch:\n${lines.join('\n')}\n     (set ALLOW_PLACEHOLDERS=1 to silence)\n`,
  );
};

export const isPlaceholderBrand = brand.placeholder;
