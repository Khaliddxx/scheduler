/**
 * Typed accessor for the single brand source of truth (brand.json).
 *
 * Every product-name, colour and URL in the marketing site resolves through here.
 * Environment variables win over the file so a deployment can be rebranded without
 * a rebuild — which is also how a white-label or staging instance is run.
 */
import raw from './brand.json';

export interface BrandColors {
  bg: string; bgInner: string; bgLine: string; surface: string;
  border: string; separator: string;
  text: string; textMuted: string; textDim: string;
  primary: string; primaryHover: string; accent: string; accentDeep: string;
  gradientFrom: string; gradientVia: string; gradientTo: string;
  success: string; warning: string; danger: string;
}

export interface Brand {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  domain: string;
  supportEmail: string;
  /** True while the name is still a stand-in. Surfaces a build-time warning. */
  placeholder: boolean;
  app: { url: string; loginPath: string; registerPath: string };
  upstream: {
    project: string; repo: string; pinnedTag: string;
    licence: string; sourceOfferUrl: string;
  };
  colors: BrandColors;
  radii: Record<string, string>;
  fonts: { display: string; body: string };
  social: Record<string, string>;
  legal: Record<string, string>;
}

const env = (key: string, fallback: string): string => {
  const v = process.env[key];
  return v && v.length > 0 ? v : fallback;
};

const base = raw as unknown as Brand;

export const brand: Brand = {
  ...base,
  name: env('NEXT_PUBLIC_BRAND_NAME', base.name),
  tagline: env('NEXT_PUBLIC_BRAND_TAGLINE', base.tagline),
  domain: env('NEXT_PUBLIC_BRAND_DOMAIN', base.domain),
  supportEmail: env('NEXT_PUBLIC_SUPPORT_EMAIL', base.supportEmail),
  app: {
    ...base.app,
    url: env('NEXT_PUBLIC_APP_URL', base.app.url),
  },
};

/** Absolute URL into the deployed scheduling application. */
export const appUrl = (path = ''): string =>
  `${brand.app.url.replace(/\/$/, '')}${path}`;

export const loginUrl = (): string => appUrl(brand.app.loginPath);
export const registerUrl = (): string => appUrl(brand.app.registerPath);

/** The marketing site's own origin, used for canonical URLs and OG tags. */
export const siteUrl = (path = ''): string => {
  const origin = env('NEXT_PUBLIC_SITE_URL', `https://${brand.domain}`).replace(/\/$/, '');
  return `${origin}${path}`;
};

export default brand;
