import { brand } from '@scheduler/brand';
import { previewClip, previewPoster } from '@/lib/preview-media';
import { VideoFrame } from '@/components/ui/video-frame';
import { InActionPlayBadge, InActionPlayer } from './in-action-player';

/**
 * "See it in action": a centred heading and one line of copy over a single
 * 16:9 demo frame, to the reference design's spec: the frame is 900px wide,
 * 1100px from `lg` and 1280px from `xl`, 20px radius with a 10% white hairline,
 * sitting on a blurred brand-gradient glow, with the red play badge centred.
 *
 * The frame is the `in-action` media slot (public/preview/in-action.webm, see
 * that folder's README). Until our own demo is recorded it is an empty frame
 * with the badge drawn on it; once the file is there, the badge becomes a real
 * button that plays the clip with sound.
 */
export function InAction() {
  const label = `${brand.name} demo`;
  const hasMedia = Boolean(previewClip('in-action') ?? previewPoster('in-action'));

  return (
    <section className="section-pz w-full space-y-[40px] text-white sm:space-y-[60px]">
      <div className="space-y-3 text-center">
        <h2 className="h2-pz max-w-[768px]">See {brand.name} in action</h2>
        <p className="mx-auto max-w-[600px] text-[18px] leading-[23.44px] text-white/80 sm:text-[22px] sm:leading-[28.64px]">
          Follow one post from first draft to every network it goes out on.
        </p>
      </div>

      <div className="relative w-full max-w-[900px] lg:max-w-[1100px] xl:max-w-[1280px]">
        <div
          aria-hidden
          className="absolute -inset-1 rounded-[24px] bg-gradient-to-r from-[#8217C3] via-[#4C27E1] to-[#B611B0] opacity-50 blur-lg"
        />
        <div className="relative aspect-video overflow-hidden rounded-[20px] border border-white/10 bg-black/50">
          {hasMedia ? (
            <InActionPlayer label={label}>
              <VideoFrame name="in-action" fit="cover" label={label} />
            </InActionPlayer>
          ) : (
            // Nothing recorded yet: the empty frame, badge and all, with nothing to press.
            <div className="absolute inset-0 flex items-center justify-center">
              <InActionPlayBadge />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
