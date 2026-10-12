import type { Metadata, Viewport } from 'next';
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import { brand, siteUrl } from '@scheduler/brand';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SupportPill } from '@/components/layout/support-pill';
import { reportPlaceholders } from '@/lib/guards';
import './globals.css';

// Self-hosted by next/font: no runtime request to Google, which keeps the site
// fast and avoids a third-party dependency in the privacy policy.
const body = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s — ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    url: siteUrl(),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  robots: {
    // Keep the placeholder build out of search results until the name is real.
    index: !brand.placeholder,
    follow: !brand.placeholder,
  },
};

export const viewport: Viewport = {
  themeColor: '#0e0e0e',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  reportPlaceholders();

  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-bg font-sans text-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-white focus:px-4 focus:py-2 focus:text-[#0e0e0e]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SupportPill />
      </body>
    </html>
  );
}
