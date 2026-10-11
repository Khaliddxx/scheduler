'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brand, loginUrl, registerUrl } from '@scheduler/brand';
import { primaryNav } from '@/content/nav';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Condense the bar once the page moves, so the hero gets the full height
  // but the nav stays legible over content further down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

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
          {primaryNav.map((group) =>
            group.children ? (
              <div key={group.label} className="group relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
                  aria-haspopup="true"
                >
                  {group.label}
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-200 group-hover:rotate-180"
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="invisible absolute left-0 top-full z-50 w-[320px] pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="card-lg overflow-hidden bg-bgInner/95 p-2 shadow-lift backdrop-blur-xl">
                    {group.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex flex-col gap-0.5 rounded-[14px] px-3.5 py-3 transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="text-body-sm font-medium text-white">
                          {child.label}
                        </span>
                        {child.description ? (
                          <span className="text-body-xs text-dim">
                            {child.description}
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={group.label}
                href={group.href ?? '#'}
                className="rounded-control px-3.5 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {group.label}
              </Link>
            ),
          )}
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
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          'fixed inset-x-0 top-[72px] z-40 origin-top overflow-y-auto border-t border-white/[0.07] bg-bg/98 backdrop-blur-xl transition-all duration-200 lg:hidden',
          open
            ? 'pointer-events-auto max-h-[calc(100dvh-72px)] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0',
        )}
      >
        <div className="shell flex flex-col gap-1 py-6">
          {primaryNav.map((group) => (
            <div key={group.label} className="py-1">
              {group.children ? (
                <>
                  <p className="px-1 pb-1 pt-3 text-eyebrow uppercase text-dim">
                    {group.label}
                  </p>
                  {group.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-[14px] px-1 py-3 text-body-lg text-white/90"
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={group.href ?? '#'}
                  onClick={() => setOpen(false)}
                  className="block rounded-[14px] px-1 py-3 text-body-lg font-medium text-white"
                >
                  {group.label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-6">
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
