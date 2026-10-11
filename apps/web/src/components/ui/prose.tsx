import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Long-form text styling for the dark theme.
 *
 * Hand-written descendant selectors instead of @tailwindcss/typography: the plugin
 * is a dependency we do not need, and its defaults are tuned for a light ground and
 * a different type scale — overriding it back to this one costs more lines than
 * writing the rules.
 *
 * Every value here is a design token, so prose inherits the site's scale rather
 * than inventing a second one. Two deliberate choices:
 *
 *  - No colour uses an opacity modifier on a palette token. The palette is CSS
 *    variables holding hex strings, so `text-muted/70` compiles to nothing at all.
 *    Tints come from `white/x`, which is a literal and does work.
 *  - No `max-width` is set. A measure belongs to the layout around the text — a
 *    legal page wants a single narrow column, a feature page wants prose beside a
 *    card — and setting it here would mean fighting class order to undo it.
 *    Wrap in `max-w-prose` (680px) or a `ch` measure at the call site.
 *
 * Spacing is applied as top margins with a `:first-child` reset, so a block never
 * pushes space above the start of the container, and headings keep their own
 * tighter gap to the paragraph that follows them.
 */

const PROSE = [
  'text-body-md text-muted',

  // Headings. h2 is the section level inside a page whose h1 is the PageHeader.
  '[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-heading-sm [&_h2]:font-bold [&_h2]:leading-[1.2] [&_h2]:text-white',
  '[&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-body-xl [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:text-white',
  '[&_h4]:mt-7 [&_h4]:font-display [&_h4]:text-body-lg [&_h4]:font-semibold [&_h4]:text-white',

  // Paragraphs.
  '[&_p]:mt-5 [&_p]:text-body-md [&_p]:text-muted',
  '[&_h2+p]:mt-4 [&_h3+p]:mt-3 [&_h4+p]:mt-3',

  // Lists. Markers are dimmed so the text stays the loudest thing in the row.
  '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5',
  '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-5',
  '[&_li]:pl-1.5 [&_li]:text-body-md [&_li]:text-muted',
  '[&_li]:marker:text-dim',
  '[&_li_p]:mt-2',

  // Inline.
  '[&_strong]:font-semibold [&_strong]:text-white',
  '[&_em]:italic',
  '[&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-[5px]',
  '[&_a:hover]:decoration-white',
  '[&_code]:rounded-[6px] [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-white [&_code]:shadow-hairline',

  // Blocks.
  '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:text-body-md [&_blockquote]:text-muted',
  '[&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-separator',
  '[&_dt]:mt-6 [&_dt]:font-semibold [&_dt]:text-white',
  '[&_dd]:mt-2 [&_dd]:text-muted',

  // Nothing adds space above the first thing in the container.
  '[&>:first-child]:mt-0',
].join(' ');

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(PROSE, className)}>{children}</div>;
}
