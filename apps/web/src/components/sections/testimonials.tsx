import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/ui/section';
import { testimonials, type Testimonial } from '@/content/testimonials';

/**
 * Social proof.
 *
 * Three things make this component unusual, and all three are deliberate:
 *
 * 1. It renders NOTHING when `testimonials` is empty. An absent section is a
 *    better empty state than a heading over white space.
 * 2. While ANY entry carries `placeholder: true` it shouts about it — a dashed
 *    amber notice above the grid, every card dimmed and tagged. The build-time
 *    warning in src/lib/guards.ts only reaches whoever reads the build log;
 *    this is the version a human scrolling the page cannot miss, which is the
 *    point: fabricated endorsements attributed to named people must not ship.
 * 3. Once the placeholders are gone the notice and the muting disappear on
 *    their own, with no code change — the condition is the data.
 *
 * Layout is CSS multi-column rather than a grid, so cards of different lengths
 * flow into a masonry instead of leaving ragged gaps. `weight: 'tall'` cannot
 * widen a column, so it reads as a larger quote size from `sm` up; that is what
 * gives the columns their uneven, hand-set rhythm.
 */

/** Section chrome. No content home for these yet; see Capabilities for the same pattern. */
const HEADING = {
  eyebrow: 'Social proof',
  title: 'What people say about it',
};

const NOTICE = {
  title: 'These are placeholder quotes, not real customers.',
  body:
    'They exist to size and shape this section while the page is being designed. Replace them in src/content/testimonials.ts with real, permissioned quotes — or remove this section entirely — before the site goes live.',
};

function NoticeIcon() {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 shrink-0 text-warn"
    >
      <path
        d="M12 3.6 2.6 20h18.8L12 3.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5v4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" />
    </svg>
  );
}

// Note for whoever edits the amber below: the palette colours resolve to bare
// var(--x), so Tailwind cannot apply an opacity modifier to them — `border-warn/40`
// compiles to nothing at all. Tint with white/alpha and use the token at full strength.
function PlaceholderNotice() {
  return (
    <div className="mx-auto mt-10 flex max-w-[720px] items-start gap-4 rounded-card border-2 border-dashed border-warn bg-white/[0.04] p-5 text-left sm:p-6">
      <NoticeIcon />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-body-sm font-semibold text-warn">{NOTICE.title}</p>
        <p className="text-body-xs leading-[1.6] text-muted">{NOTICE.body}</p>
      </div>
    </div>
  );
}

function PlaceholderTag() {
  return (
    <span className="inline-flex w-fit items-center rounded-control border border-dashed border-warn px-2.5 py-1 text-eyebrow uppercase text-warn">
      Placeholder
    </span>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    // mb-* rather than a gap: in a multi-column flow the margin is what separates
    // stacked cards, while `gap` on the list only sets the column gutter.
    <li className="mb-4 break-inside-avoid sm:mb-5">
      <figure
        className={cn(
          'card flex flex-col gap-5 p-6 sm:p-7',
          item.placeholder &&
            'border border-dashed border-warn opacity-50 saturate-[0.6]',
        )}
      >
        {item.placeholder ? <PlaceholderTag /> : null}

        <blockquote
          className={cn(
            // `body` may contain newlines, and the content file promises to keep them.
            'whitespace-pre-line text-body-md text-muted',
            item.weight === 'tall' && 'sm:text-body-lg',
          )}
        >
          {item.body}
        </blockquote>

        <figcaption className="flex flex-col gap-1">
          <span className="text-body-sm font-semibold text-white">{item.name}</span>
          <span className="text-body-xs leading-[1.5] text-dim">
            {item.role ? `${item.handle} · ${item.role}` : item.handle}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

export function Testimonials() {
  // Nothing to show: render nothing, not an empty heading.
  if (testimonials.length === 0) return null;

  const hasPlaceholders = testimonials.some((item) => item.placeholder);

  return (
    <Section id="testimonials">
      <div className="shell">
        <SectionHeading eyebrow={HEADING.eyebrow} title={HEADING.title} />

        {hasPlaceholders ? <PlaceholderNotice /> : null}

        <ul className="mt-12 columns-1 gap-4 sm:mt-14 sm:columns-2 sm:gap-5 lg:columns-3">
          {testimonials.map((item) => (
            <QuoteCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
