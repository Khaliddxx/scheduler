import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'brand';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  // The site's main action: a solid white pill on a near-black ground.
  primary:
    'bg-white text-[#0e0e0e] hover:bg-white/90 active:bg-white/80 shadow-hairline-strong',
  // Outlined pill for the secondary action next to it.
  secondary:
    'bg-white/5 text-white hover:bg-white/10 active:bg-white/15 shadow-hairline',
  ghost: 'text-white/80 hover:text-white hover:bg-white/5',
  // Gradient fill, used sparingly — one per viewport at most.
  brand:
    'text-white bg-brand bg-[length:200%_auto] hover:bg-right shadow-hairline-strong',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-body-sm gap-1.5',
  md: 'h-12 px-5 text-body-sm gap-2',
  lg: 'h-14 px-7 text-body-lg gap-2.5',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Renders the chevron affordance used on the site's main calls to action. */
  withChevron?: boolean;
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
  type?: never;
  onClick?: never;
  disabled?: never;
}

interface ButtonProps extends BaseProps {
  href?: never;
  external?: never;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const Chevron = () => (
  <span
    aria-hidden
    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-current/10"
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 6h7M6 3l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const base =
  'inline-flex items-center justify-center rounded-control font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none';

export function Button(props: LinkProps | ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    withChevron,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      {children}
      {withChevron ? <Chevron /> : null}
    </>
  );

  if ('href' in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {inner}
      </Link>
    );
  }

  const { type = 'button', onClick, disabled } = props as ButtonProps;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}
