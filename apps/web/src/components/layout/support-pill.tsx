'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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

/**
 * Solid speech bubble with three dots knocked out, drawn to sit in the same
 * 32px box (and carry the same weight) as the reference pill's icon. Uses
 * currentColor, so it turns white with the label on hover.
 */
const ChatBubble = () => (
  <svg aria-hidden width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 6.5c-7.18 0-13 4.53-13 10.12 0 3.06 1.75 5.8 4.5 7.66l-1.2 4.22 5.08-2.5c1.43.4 2.99.62 4.62.62 7.18 0 13-4.53 13-10.12S23.18 6.5 16 6.5ZM10.4 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Zm5.6 0a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Zm7.5-1.9a1.9 1.9 0 1 1-3.8 0 1.9 1.9 0 0 1 3.8 0Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Floating "Support" pill, fixed to the bottom-right corner (same size, radius,
 * colours and position as the reference design's pill; the label hides below
 * 640px, leaving a round icon button).
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
  const pathname = usePathname();

  useEffect(() => {
    if (!readHidden()) setVisible(true);
  }, []);

  // The pricing page pins its own call to action to the bottom of phone screens,
  // and the reference shows no pill there.
  if (!visible || !brand.supportEmail || pathname === '/pricing') return null;

  const dismiss = () => {
    writeHidden();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      <a
        href={`mailto:${brand.supportEmail}`}
        aria-label="Support"
        className="flex h-fit w-fit items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white px-[16px] py-[13px] text-[16px] font-medium leading-[21px] text-[#0e0e0e] transition-all hover:bg-pink hover:text-white"
      >
        <ChatBubble />
        <span className="max-sm:hidden">Support</span>
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
  );
}
