'use client';

import { useEffect, useState } from 'react';
import { brand } from '@scheduler/brand';

/**
 * Remembered for the browser tab only. A visitor who hides the pill should not
 * see it again on the next page, but a fresh visit tomorrow may show it again.
 */
const STORAGE_KEY = 'support-pill:hidden';

const readHidden = (): boolean => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const writeHidden = (): void => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* Private mode or blocked storage: the pill simply returns on the next page. */
  }
};

/** Speech bubble with three dots. Drawn here so there is no icon dependency. */
const ChatBubble = () => (
  <svg
    aria-hidden
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M12 3.75c-4.97 0-9 3.3-9 7.37 0 2.08 1.05 3.95 2.74 5.3L5 20.25l4.26-1.98c.86.22 1.78.34 2.74.34 4.97 0 9-3.3 9-7.37s-4.03-7.49-9-7.49Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="8.6" cy="11.2" r="1.1" fill="currentColor" />
    <circle cx="12" cy="11.2" r="1.1" fill="currentColor" />
    <circle cx="15.4" cy="11.2" r="1.1" fill="currentColor" />
  </svg>
);

/**
 * Floating "Support" pill, fixed to the bottom-right corner.
 *
 * A plain mailto link rather than a chat widget: there is no third-party
 * script to load, nothing to add to the privacy policy, and it works with no
 * JavaScript at all. The only client-side behaviour is the dismiss button.
 *
 * Rendered after mount so a visitor who dismissed it on the previous page does
 * not see it flash in and vanish while React hydrates.
 */
export function SupportPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readHidden()) setVisible(true);
  }, []);

  if (!visible || !brand.supportEmail) return null;

  const dismiss = () => {
    writeHidden();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 print:hidden">
      <div className="relative">
        <a
          href={`mailto:${brand.supportEmail}`}
          className="inline-flex h-12 w-12 items-center justify-center rounded-control bg-white text-[#0e0e0e] shadow-lift transition-all duration-200 hover:bg-white/90 active:bg-white/80 sm:h-[52px] sm:w-auto sm:gap-2.5 sm:px-5"
        >
          <ChatBubble />
          <span className="sr-only text-body-sm font-semibold sm:not-sr-only">
            Support
          </span>
        </a>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide support"
          className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bgInner text-muted shadow-hairline-strong transition-colors hover:bg-bgLine hover:text-white"
        >
          <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 1.5l7 7M8.5 1.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
