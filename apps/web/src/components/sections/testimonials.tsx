import { testimonials } from '@/content/testimonials';
import { previewImage } from '@/lib/preview-media';
import { TestimonialsWall } from '@/components/sections/testimonials-wall';

/**
 * Social proof, laid out as the reference design's quote wall: a heading with a
 * hand-drawn heart, then cards dealt into balanced columns (see
 * testimonials-wall.tsx).
 *
 * Three deliberate behaviours:
 *
 * 1. It renders NOTHING when `testimonials` is empty. An absent section is a
 *    better empty state than a heading over white space.
 * 2. While ANY entry carries `placeholder: true` it says so: a dashed amber
 *    notice above the wall, and every such card dimmed and tagged. The
 *    build-time warning in src/lib/guards.ts only reaches whoever reads the
 *    build log; this is the version a human scrolling the page cannot miss.
 * 3. The cards carry only what the content file has: no handles, avatars or
 *    source links are invented. Each card shows the person's initial where the
 *    reference shows a photo, and the role where it shows a handle.
 */

/** Section chrome. No content home for these yet; see Capabilities for the same pattern. */
const HEADING = {
  title: 'What people say about it',
};

const NOTICE = {
  title: 'These are placeholder quotes, not real customers.',
  body:
    'They exist to size and shape this section while the page is being designed. Replace them in src/content/testimonials.ts with real, permissioned quotes — or remove this section entirely — before the site goes live.',
};

function PlaceholderNotice() {
  return (
    <div className="flex max-w-[720px] flex-col gap-2 rounded-[20px] border-2 border-dashed border-warn bg-white/[0.04] p-5 text-left sm:p-6">
      <p className="text-[16px] font-semibold leading-[1.3] text-warn">{NOTICE.title}</p>
      <p className="text-[14px] leading-[1.6] text-[#d1d1d1]">{NOTICE.body}</p>
    </div>
  );
}

export function Testimonials() {
  // Nothing to show: render nothing, not an empty heading.
  if (testimonials.length === 0) return null;

  const hasPlaceholders = testimonials.some((item) => item.placeholder);
  const heart = previewImage('testimonials/heart.svg');

  return (
    <section id="testimonials" className="section-pz gap-[60px]">
      <div className="flex flex-col-reverse items-center gap-[13px] sm:flex-row">
        <h2 className="h2-pz">{HEADING.title}</h2>
        {heart ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heart} alt="" aria-hidden width={57} height={51} loading="lazy" />
        ) : null}
      </div>

      {hasPlaceholders ? <PlaceholderNotice /> : null}

      <TestimonialsWall items={testimonials} />
    </section>
  );
}
