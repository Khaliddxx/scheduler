'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brand, loginUrl, registerUrl } from '@scheduler/brand';
import { primaryNav, agentMenu, resourceMenu, type MenuItem } from '@/content/nav';
import { sellableChannels } from '@/content/channels';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { IntegrationGlyph } from '@/components/ui/integration-glyph';
import { cn } from '@/lib/cn';

/**
 * Site header.
 *
 * The two wide menus are the point of this component. A short dropdown says
 * "we have some integrations"; a three-column panel of twenty-odd recognisable
 * names says "it already works with what you use", which is the actual pitch
 * and lands before a visitor reads a word of copy.
 *
 * They open on hover AND on focus, so the panel is reachable by keyboard
 * rather than being a mouse-only affordance.
 */

const Chevron = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    aria-hidden
    className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
  >
    <path
      d="M1 1l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** One row inside a mega-menu column. */
function MenuRow({ item }: { item: MenuItem }) {
  return (
    <Link
      href={item.href}
      className="group/row flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
    >
      <IntegrationGlyph name={item.glyph} />
      <span className="truncate text-body-sm text-white/85 transition-colors group-hover/row:text-white">
        {item.label}
      </span>
    </Link>
  );
}

/** Splits a flat list into N balanced columns, filling down then across. */
const columns = <T,>(items: T[], count: number): T[][] => {
  const per = Math.ceil(items.length / count);
  return Array.from({ length: count }, (_, i) => items.slice(i * per, (i + 1) * per));
};

function MegaPanel({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className={cn(
        'invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0',
        'transition-all duration-200',
        'group-hover:visible group-hover:opacity-100',
        'group-focus-within:visible group-focus-within:opacity-100',
        wide ? 'w-[680px]' : 'w-[420px]',
      )}
    >
      <div className="card-lg bg-bgInner/97 p-3 shadow-lift backdrop-blur-xl">{children}</div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const agentCols = columns(agentMenu, 3);
  const channelCols = columns(sellableChannels.slice(0, 18), 3);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-white/[0.07] bg-bg/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden lg:flex lg:items-center lg:gap-1">
          {/* Agents and integrations */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
              aria-haspopup="true"
            >
              Integrations
              <Chevron />
            </button>
            <MegaPanel wide>
              <div className="grid grid-cols-3 gap-x-2">
                {agentCols.map((col, i) => (
                  <div key={i} className="flex flex-col">
                    {col.map((item) => (
                      <MenuRow key={item.label + item.href} item={item} />
                    ))}
                  </div>
                ))}
              </div>
              <Link
                href="/developers"
                className="mt-2 flex items-center justify-between rounded-[10px] bg-white/[0.04] px-3 py-2.5 text-body-sm text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                Build on the API
                <span aria-hidden>→</span>
              </Link>
            </MegaPanel>
          </div>

          {/* Channels */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
              aria-haspopup="true"
            >
              Channels
              <Chevron />
            </button>
            <MegaPanel wide>
              <div className="grid grid-cols-3 gap-x-2">
                {channelCols.map((col, i) => (
                  <div key={i} className="flex flex-col">
                    {col.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/channels/${c.slug}`}
                        className="flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <ChannelIcon channel={c} size={28} />
                        <span className="truncate text-body-sm text-white/85">{c.name}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <Link
                href="/channels"
                className="mt-2 flex items-center justify-between rounded-[10px] bg-white/[0.04] px-3 py-2.5 text-body-sm text-white/70 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                See every network
                <span aria-hidden>→</span>
              </Link>
            </MegaPanel>
          </div>

          <Link
            href="/pricing"
            className="rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Pricing
          </Link>

          {/* Resources */}
          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
              aria-haspopup="true"
            >
              Resources
              <Chevron />
            </button>
            <MegaPanel>
              <div className="flex flex-col">
                {resourceMenu.map((item) => (
                  <MenuRow key={item.href} item={item} />
                ))}
              </div>
            </MegaPanel>
          </div>

          <Link
            href="/about"
            className="rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button href={loginUrl()} external variant="secondary" size="sm">
            Log in
          </Button>
          <Button href={registerUrl()} external variant="primary" size="sm" withChevron>
            Start free
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-control text-white lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            {open ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet. The mega-menus collapse to plain grouped lists. */}
      <div
        className={cn(
          'fixed inset-x-0 top-[72px] z-40 origin-top overflow-y-auto border-t border-white/[0.07] bg-bg/98 backdrop-blur-xl transition-all duration-200 lg:hidden',
          open
            ? 'pointer-events-auto max-h-[calc(100dvh-72px)] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <div className="shell flex flex-col gap-1 py-6">
          {primaryNav
            .filter((g) => g.href)
            .map((group) => (
              <Link
                key={group.label}
                href={group.href ?? '#'}
                onClick={() => setOpen(false)}
                className="block rounded-[14px] px-1 py-3 text-body-lg font-medium text-white"
              >
                {group.label}
              </Link>
            ))}

          <p className="px-1 pb-1 pt-4 text-eyebrow uppercase text-dim">Integrations</p>
          <div className="grid grid-cols-2 gap-x-3">
            {agentMenu.slice(0, 10).map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 py-2 text-body-sm text-white/85"
              >
                <IntegrationGlyph name={item.glyph} />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] pt-6">
            <Button href={loginUrl()} external variant="secondary" size="lg">
              Log in
            </Button>
            <Button href={registerUrl()} external variant="primary" size="lg" withChevron>
              Start your {brand.name} trial
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
