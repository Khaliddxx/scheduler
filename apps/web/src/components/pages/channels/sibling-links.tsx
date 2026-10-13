import Link from 'next/link';
import { channelCount, type Channel } from '@/content/channels';
import { previewImage } from '@/lib/preview-media';

/**
 * "Also publishes to": eight sibling channels as small icon pills, plus a link
 * back to the directory. Sits under the cross-post panel's copy so every
 * channel page links sideways and up, which keeps the whole directory
 * crawlable from any one page.
 */
export function SiblingLinks({ siblings }: { siblings: Channel[] }) {
  return (
    <nav aria-label="Also publishes to" className="space-y-3">
      <ul className="flex flex-wrap gap-1 sm:gap-2">
        {siblings.map((sibling) => {
          const icon = previewImage(`socials/${sibling.slug}.svg`);
          return (
            <li key={sibling.slug}>
              <Link
                href={`/channels/${sibling.slug}`}
                aria-label={sibling.name}
                className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 text-[15px] leading-5 text-white transition-colors hover:bg-white/20 sm:pr-3.5"
              >
                {icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={icon}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                    className="h-5 w-5 rounded-[5px]"
                  />
                ) : null}
                <span aria-hidden className="hidden sm:inline">
                  {sibling.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/channels"
        className="inline-block text-[15px] leading-5 text-white/80 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
      >
        All {channelCount} channels
      </Link>
    </nav>
  );
}
