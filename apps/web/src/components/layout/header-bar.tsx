'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { loginUrl, registerUrl } from '@scheduler/brand';
import type { HeaderNavEntry } from '@/content/nav';
import { Logo } from '@/components/ui/logo';
import { Chevron, DoubleChevron, MenuIcon, startPillClass } from '@/components/layout/header-icons';
import { cn } from '@/lib/cn';

/**
 * The interactive part of the site header (header.tsx renders it).
 *
 * Desktop (>= 1024px): a fixed 60/81px black bar. "AI Agents" and "Channels"
 * open a three-column panel while the pointer is over them, and also on
 * keyboard focus; Escape or tabbing out closes it.
 *
 * Mobile: the bar grows into a full-screen black menu. "AI Agents" and
 * "Channels" drill down into a two-column list with a "Back" button.
 */

export interface HeaderMenuItem {
  key: string;
  label: string;
  href: string;
  /** Rendered on the server (see header.tsx). */
  icon: ReactNode;
}

/* Shared text styles of the bar. */
const ITEM_TEXT = 'text-[18px] leading-[23.44px] sm:text-[16px] sm:leading-[20.83px]';

function MenuLinks({ items, onNavigate }: { items: HeaderMenuItem[]; onNavigate: () => void }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          {item.icon}
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(ITEM_TEXT, 'cursor-pointer whitespace-nowrap transition-all hover:text-pink')}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </>
  );
}

/** One mega-menu entry: the trigger, the desktop panel and the mobile drill-down. */
function MegaMenu({
  title,
  items,
  mobile,
  open,
  setOpen,
  onNavigate,
}: {
  title: string;
  items: HeaderMenuItem[];
  /** True while the full-screen mobile menu is showing. */
  mobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavigate: () => void;
}) {
  const panelId = useId();
  const liRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Set while focus is returned to the trigger after Escape, so that focus
  // does not immediately reopen the panel it just closed.
  const returningFocus = useRef(false);

  const close = () => setOpen(false);
  const navigate = () => {
    setOpen(false);
    onNavigate();
  };

  return (
    <li
      ref={liRef}
      className={cn('relative cursor-pointer transition-all', ITEM_TEXT)}
      onMouseEnter={() => !mobile && setOpen(true)}
      onMouseLeave={() => !mobile && setOpen(false)}
      onClick={() => {
        if (mobile && !open) setOpen(true);
      }}
      onFocus={(e) => {
        if (mobile || returningFocus.current) return;
        const target = e.target as Element;
        if (target === triggerRef.current && target.matches(':focus-visible')) setOpen(true);
      }}
      onBlur={(e) => {
        if (mobile) return;
        if (!liRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !open) return;
        e.stopPropagation();
        setOpen(false);
        returningFocus.current = true;
        triggerRef.current?.focus();
        returningFocus.current = false;
      }}
    >
      <div>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={(e) => {
            // Keyboard activation (detail 0) toggles; a mouse click on desktop
            // only ever opens, because hovering has already opened it.
            if (!mobile) setOpen(e.detail === 0 ? !open : true);
          }}
          className="group flex cursor-pointer items-center transition-all hover:text-[#FF4CE2]"
        >
          {title}
          {mobile ? (
            <Chevron className="-rotate-90 stroke-white group-hover:stroke-pink" />
          ) : (
            <Chevron
              className={cn(
                'stroke-white transition-all group-hover:stroke-pink',
                open ? 'rotate-180' : 'rotate-0',
              )}
            />
          )}
        </button>

        <div id={panelId} className={cn(!open && 'hidden', 'absolute left-[-20px] top-0 pt-[25px]')}>
          {/* Desktop panel */}
          <div className="z-10 hidden w-[40rem] grid-cols-3 gap-x-4 gap-y-6 rounded-[14px] bg-[#242323] px-6 py-5 lg:grid">
            <MenuLinks items={items} onNavigate={navigate} />
          </div>

          {/* Mobile drill-down */}
          <div className="fixed left-0 top-[80px] z-[99999] flex h-full w-full justify-center bg-[#0e0e0e] lg:hidden">
            <div className="relative grid grid-cols-2 content-start gap-x-2 gap-y-2 pt-[40px]">
              <MenuLinks items={items} onNavigate={navigate} />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className="group absolute left-0 top-0 flex items-center hover:text-pink"
              >
                <Chevron className="rotate-90 stroke-white group-hover:stroke-pink" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function HeaderBar({
  nav,
  agents,
  channels,
}: {
  nav: HeaderNavEntry[];
  agents: HeaderMenuItem[];
  channels: HeaderMenuItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<'agents' | 'channels' | null>(null);
  const panelRef = useRef(openPanel);
  panelRef.current = openPanel;
  const pathname = usePathname();

  const closeAll = () => {
    setMenuOpen(false);
    setOpenPanel(null);
  };

  // Leaving the page closes everything (the header persists across routes).
  useEffect(() => {
    setMenuOpen(false);
    setOpenPanel(null);
  }, [pathname]);

  // Widening past the mobile breakpoint closes the mobile menu.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The full-screen menu owns the viewport: no page scroll behind it, and
  // Escape backs out one level at a time.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (panelRef.current) setOpenPanel(null);
      else setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setOpenPanel(null);
    setMenuOpen((v) => !v);
  };

  return (
    <>
      {/* z-[90]: above every section, below the skip link (z-[100]) in the root layout. */}
      <header className="fixed z-[90] flex w-full flex-col items-center bg-[#0e0e0e]">
        <div
          className={cn(
            'flex px-[20px] py-[16px] sm:px-[60px] sm:py-[18px]',
            menuOpen
              ? 'h-screen w-screen flex-col gap-[60px]'
              : 'h-[60px] w-full max-w-[1440px] items-center justify-between sm:h-[81px]',
          )}
        >
          <div className="flex w-full justify-between lg:w-auto">
            <Logo className="max-sm:gap-2 max-sm:[&>span:first-child]:h-7 max-sm:[&>span:first-child]:w-7 max-sm:[&>span:first-child]:rounded-[9px] max-sm:[&>span:first-child]:text-[15px] max-sm:[&>span:last-child]:text-[19px]" />
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="block lg:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>

          <nav
            aria-label="Main"
            className={cn(
              'gap-[32px] sm:gap-[50px]',
              menuOpen ? 'flex flex-col items-center' : 'hidden flex-row lg:flex',
            )}
          >
            <ul className="contents">
              {nav.map((entry) =>
                entry.menu ? (
                  <MegaMenu
                    key={entry.label}
                    title={entry.label}
                    items={entry.menu === 'agents' ? agents : channels}
                    mobile={menuOpen}
                    open={openPanel === entry.menu}
                    setOpen={(o) => setOpenPanel(o ? entry.menu ?? null : null)}
                    onNavigate={closeAll}
                  />
                ) : (
                  <li
                    key={entry.label}
                    className={cn('relative z-[200] transition-all hover:text-[#FF4CE2]', ITEM_TEXT)}
                  >
                    <Link href={entry.href ?? '/'} onClick={closeAll}>
                      {entry.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div
            className={cn(
              'items-center gap-2',
              menuOpen ? 'flex flex-col' : 'hidden lg:flex',
            )}
          >
            <a
              href={loginUrl()}
              className={cn(
                'flex h-[48.63px] items-center justify-center gap-[6px] whitespace-nowrap rounded-full border border-white px-6 py-3 text-[16px] font-medium leading-[20.83px] text-white transition-all hover:border-pink',
                menuOpen ? 'w-[154.46px]' : 'w-fit',
              )}
            >
              Log In
            </a>
            <div>
              <a href={registerUrl()} className={startPillClass('sm')}>
                Start for $0
                <DoubleChevron className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
          </div>
        </div>
      </header>
      {/* The bar is fixed; this keeps every page's content clear of it. */}
      <div aria-hidden className="h-[60px] sm:h-[81px]" />
    </>
  );
}
