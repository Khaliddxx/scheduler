import { previewImage } from '@/lib/preview-media';
import type { FeatureCardCopy } from '@/components/pages/channels/copy';

/**
 * Four cards in a 2 x 2 grid (one column below 768px), each with a large
 * hand-drawn icon, a bold title and a paragraph: the block that follows the
 * hero on the reference design's channel pages. Card, type and spacing values
 * are the reference's.
 */
export function FeatureCards({ items }: { items: FeatureCardCopy[] }) {
  return (
    <section className="section-pz">
      <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => {
          const icon = previewImage(`channels/icon-${item.icon}.svg`);
          return (
            <li
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-[#1A1919] p-6 pb-8 sm:rounded-[20px] sm:p-8 sm:pb-10"
            >
              {icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={icon}
                  alt=""
                  aria-hidden
                  width={100}
                  height={100}
                  loading="lazy"
                  className="h-20 w-20 sm:h-[100px] sm:w-[100px]"
                />
              ) : (
                <span aria-hidden className="h-20 w-20 sm:h-[100px] sm:w-[100px]" />
              )}
              <h3 className="text-[22px] font-bold leading-[28.64px] sm:text-[34px] sm:leading-[44.27px]">
                {item.title}
              </h3>
              <p className="text-left text-[18px] font-normal leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]">
                {item.body}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
