import { registerUrl } from '@scheduler/brand';

/**
 * The white call-to-action pill used across the channel pages: white with
 * black text, turning pink with white text on hover, a double chevron after
 * the label. Sizes follow the reference button (16px / 57px tall from 640px).
 * It goes to the application's own sign-up, never to a payment page.
 */
export function CtaPill({ className }: { className?: string }) {
  return (
    <a
      href={registerUrl()}
      className={[
        'flex h-fit w-fit cursor-pointer items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white stroke-[#0e0e0e] py-[12px] pl-[24px] pr-[16px] text-[16px] font-medium leading-[20.83px] text-[#0e0e0e] transition-all hover:bg-pink hover:stroke-white hover:text-white sm:h-[57px] sm:py-[16px] sm:pl-[32px] sm:pr-[24px] sm:text-[19px] sm:leading-[25px] lg:leading-[24.74px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Same label as the header and footer pills: the first 7 days cost $0. */}
      Start for $0
      <svg
        aria-hidden
        width="24"
        height="24"
        viewBox="0 0 25 25"
        fill="none"
        stroke="inherit"
        className="h-5 w-5 md:h-6 md:w-6"
      >
        <path
          d="M6.4 17.5l5-5-5-5M13.4 17.5l5-5-5-5"
          stroke="inherit"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
