import Link from 'next/link';
import { channelCount, noReviewChannels, type Channel } from '@/content/channels';
import { SocialIcon, channelsInDisplayOrder } from '@/components/ui/social-icon';
import { previewImage } from '@/lib/preview-media';

/**
 * The channel wall: every network we sell as an app-icon tile linking to its own
 * page, laid out as the reference design's offset rows (7 / 6 / 7 / …), with
 * empty tiles padding the last row and the outer edges, and a fade on both sides.
 *
 * Both numbers in this section are computed from the channel list rather than
 * typed, so adding a provider to src/content/channels.ts updates the claim:
 * `pnpm brand:verify` fails the build when the channel list disagrees with
 * infra/overlay/providers.lock, and a hand-typed number here would slip past it.
 *
 * Only `channelsInDisplayOrder` (sellable channels) is shown. Networks the
 * reference wall also shows come first, in its order; the rest follow in
 * catalogue order.
 */

/** The reference wall's order, row by row. Slugs we do not sell are skipped. */
const WALL_ORDER = [
  'discord', 'instagram', 'threads', 'facebook', 'youtube', 'tiktok', 'slack',
  'bluesky', 'linkedin', 'reddit', 'dribbble', 'pinterest', 'mastodon',
  'vk', 'lemmy', 'x', 'warpcast', 'telegram',
];

const wallRank = (slug: string): number => {
  const i = WALL_ORDER.indexOf(slug);
  return i === -1 ? WALL_ORDER.length : i;
};

/** Stable sort, so channels the wall does not list keep the catalogue order. */
const wallChannels: Channel[] = [...channelsInDisplayOrder].sort(
  (a, b) => wallRank(a.slug) - wallRank(b.slug),
);

type Slot = Channel | null;

/**
 * Rows alternate 7 and 6 tiles so each row sits offset from the next. A short
 * last row is centred with empty tiles on both ends, as in the reference.
 */
function toRows(items: Channel[]): Slot[][] {
  const rows: Slot[][] = [];
  let i = 0;
  while (i < items.length) {
    const size = rows.length % 2 === 0 ? 7 : 6;
    const row: Slot[] = items.slice(i, i + size);
    i += size;
    const missing = size - row.length;
    if (missing > 0) {
      const before = Math.floor(missing / 2);
      row.unshift(...Array<Slot>(before).fill(null));
      row.push(...Array<Slot>(missing - before).fill(null));
    }
    rows.push(row);
  }
  return rows;
}

const tile =
  'flex shrink-0 items-center justify-center w-[52px] h-[52px] md:w-[100px] md:h-[100px] xl:w-[154px] xl:h-[154px] border border-[#B491FF]/15 rounded-[8px] md:rounded-[16px] xl:rounded-[30px]';

function EmptyTile({ edge = false }: { edge?: boolean }) {
  return (
    <div
      aria-hidden
      style={{ backgroundColor: '#140C1F' }}
      className={`${tile}${edge ? ' hidden 2xl:block' : ''}`}
    />
  );
}

function ChannelTile({ channel }: { channel: Channel }) {
  return (
    <Link
      href={`/channels/${channel.slug}`}
      style={{ backgroundColor: '#190B30' }}
      className={`${tile} focus-visible:rounded-[8px] md:focus-visible:rounded-[16px] xl:focus-visible:rounded-[30px]`}
    >
      <SocialIcon
        channel={channel}
        className="h-6 w-6 md:h-10 md:w-10 xl:h-[70px] xl:w-[70px]"
      />
    </Link>
  );
}

export function ChannelGrid() {
  const underline = previewImage('channel-grid/providers-underline.svg');
  const rows = toRows(wallChannels);

  return (
    <section id="channels" className="section-pz space-y-10 sm:space-y-[60px]">
      <h2 className="h2-pz max-w-[700px]">
        Publish to {channelCount} networks from{' '}
        <span className="relative inline-block">
          one calendar
          {underline ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={underline}
              alt=""
              aria-hidden
              width={238}
              height={31}
              loading="lazy"
              className="pointer-events-none absolute left-1/2 top-full -mt-[6px] h-auto w-[140px] max-w-none -translate-x-1/2 select-none md:-mt-[2px] md:w-[238px]"
            />
          ) : null}
        </span>
      </h2>

      <p className="max-w-[700px] px-2 text-center text-[18px] font-normal leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]">
        {noReviewChannels.length} of them need no platform review, so they publish as soon
        as you connect them, and every one runs from the same calendar.
      </p>

      <div className="relative flex flex-col gap-1 xl:gap-3">
        {rows.map((row, r) => (
          <div key={r} className="flex justify-center gap-1 xl:gap-3">
            <EmptyTile edge />
            {row.map((slot, s) =>
              slot ? (
                <ChannelTile key={slot.slug} channel={slot} />
              ) : (
                <EmptyTile key={`empty-${s}`} />
              ),
            )}
            <EmptyTile edge />
          </div>
        ))}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0E0E0E] to-[#0B0B0B00] 2xl:left-[60px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0E0E0E] to-[#0B0B0B00] 2xl:right-[60px]"
        />
      </div>
    </section>
  );
}
