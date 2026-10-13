import { brand as site } from '@scheduler/brand';
import { previewImage } from '@/lib/preview-media';
import { cn } from '@/lib/cn';
import { PzIcon } from './icons';

/**
 * The square tile that stands for an integration: its logo from
 * public/preview/agents/ when there is one, otherwise a dark tile with a line
 * glyph (the automation tools and feeds have no logo file). `brand` draws the
 * site's own mark instead. Sized entirely by `className`.
 */
export function IntegrationMark({
  logo,
  glyph,
  brand = false,
  className,
  ring = true,
}: {
  logo?: string;
  glyph?: string;
  brand?: boolean;
  className?: string;
  /** The thin inner ring the reference puts on hero badges. */
  ring?: boolean;
}) {
  const src = logo ? previewImage(`agents/${logo}.svg`) : null;
  const ringClass = ring ? 'ring-1 ring-inset ring-white/25' : '';

  if (src) {
    return (
      // Static SVG tile with its own background; no optimisation pass needed.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={24}
        height={24}
        draggable={false}
        className={cn('shrink-0 select-none rounded-[27%]', ringClass, className)}
      />
    );
  }

  if (brand) {
    return (
      <span
        aria-hidden
        className={cn(
          'flex shrink-0 items-center justify-center rounded-[27%] bg-white [container-type:inline-size]',
          ringClass,
          className,
        )}
      >
        <span className="flex h-[62%] w-[62%] items-center justify-center rounded-[24%] bg-brand font-jakarta text-[34cqw] font-extrabold leading-none text-white">
          {site.name.charAt(0).toUpperCase()}
        </span>
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-[27%] bg-[#3B3B38] text-white',
        ringClass,
        className,
      )}
    >
      <PzIcon name={glyph ?? 'plug'} strokeWidth={1.7} className="h-[58%] w-[58%]" />
    </span>
  );
}
