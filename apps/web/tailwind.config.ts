import type { Config } from 'tailwindcss';
import brandJson from '../../packages/brand/brand.json';

// Colours resolve from the shared brand file at build time, and are *also* emitted as
// CSS custom properties in globals.css. Tailwind utilities point at the variables rather
// than the literals, so a running deployment can be re-skinned by overriding the
// variables alone — the same mechanism the self-hosted app uses (see infra/overlay).
const c = brandJson.colors;

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/brand/*.ts',
  ],
  theme: {
    // Breakpoints of the reference design. `mobile` and a 1360px `2xl` are not
    // Tailwind defaults; ordered so that larger screens win in the cascade.
    screens: {
      mobile: '376px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1360px',
    },
    extend: {
      colors: {
        pink: '#FF4CE2',
        bg: 'var(--bg)',
        bgInner: 'var(--bg-inner)',
        bgLine: 'var(--bg-line)',
        surface: 'var(--surface)',
        line: 'var(--border)',
        separator: 'var(--separator)',
        body: 'var(--text)',
        muted: 'var(--text-muted)',
        dim: 'var(--text-dim)',
        primary: 'var(--primary)',
        primaryHover: 'var(--primary-hover)',
        accent: 'var(--accent)',
        accentDeep: 'var(--accent-deep)',
        ok: 'var(--success)',
        warn: 'var(--warning)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Aliases matching the reference markup: Plus Jakarta Sans and DM Sans.
        jakarta: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        dm: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
      },
      spacing: {
        15: '3.75rem',
      },
      borderRadius: {
        card: brandJson.radii.card,
        'card-lg': brandJson.radii.cardLarge,
        control: brandJson.radii.control,
        input: brandJson.radii.input,
      },
      fontSize: {
        // Type scale measured off the reference design, kept as named steps so
        // sections stay consistent instead of each picking its own px value.
        'display-xl': ['70px', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-lg': ['60px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.015em' }],
        'display-sm': ['38px', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.01em' }],
        'heading-lg': ['34px', { lineHeight: '1.1', fontWeight: '700' }],
        'heading-md': ['30px', { lineHeight: '1.27', fontWeight: '700' }],
        'heading-sm': ['24px', { lineHeight: '1.1', fontWeight: '700' }],
        'body-xl': ['22px', { lineHeight: '1.5' }],
        'body-lg': ['19px', { lineHeight: '1.47' }],
        'body-md': ['18px', { lineHeight: '1.7', letterSpacing: '-0.005em' }],
        'body-sm': ['16px', { lineHeight: '1.3' }],
        'body-xs': ['14px', { lineHeight: '1.3' }],
        eyebrow: ['12px', { lineHeight: '1.1', fontWeight: '500', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        shell: '1200px',
        prose: '680px',
      },
      boxShadow: {
        // The signature inset hairline that defines every card edge on a dark surface.
        hairline: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
        'hairline-strong': 'inset 0 0 0 1px rgba(255,255,255,0.25)',
        glow: '0 0 80px -20px var(--primary)',
        lift: '0 24px 60px -24px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        brand: `linear-gradient(to right, ${c.gradientFrom}, ${c.gradientVia}, ${c.gradientTo})`,
        'brand-diag': `linear-gradient(138deg, ${c.gradientVia} 10%, #2F007B 76%)`,
        // Card fills from the reference design.
        boxOne: 'linear-gradient(327deg, #164cd9 4.25%, #002584 74.87%)',
        boxTwo: 'linear-gradient(199deg, #b611b0 -9.68%, #4a0047 109.72%)',
        boxThree: 'linear-gradient(52deg, #7b08d5 9.85%, #390053 106.98%)',
        boxFour: 'linear-gradient(138deg, #4c27e1 9.56%, #2f007b 76.16%)',
        gradientBlue: 'linear-gradient(238deg, #5608d5, #24005e)',
      },
      keyframes: {
        marqueeX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'marquee-slow': 'marqueeX 70s linear infinite',
        'marquee-fast': 'marqueeX 45s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out both',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
