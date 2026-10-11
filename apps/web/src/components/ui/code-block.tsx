import { cn } from '@/lib/cn';

/**
 * A code example.
 *
 * `<figure>` + `<figcaption>` rather than a bare `<pre>`, so the caption is
 * programmatically tied to the sample instead of being a floating line above it.
 *
 * The `<pre>` is a scroll container, so it carries `tabIndex={0}`: a region that
 * scrolls must be reachable by keyboard, or a long line is simply unreadable
 * without a mouse. Wrapping is not an option here — a wrapped shell command reads
 * as two commands.
 *
 * No syntax highlighting. That needs a tokeniser dependency, and at this size the
 * only thing highlighting would buy is colour for its own sake.
 */
export function CodeBlock({
  label,
  language,
  code,
  className,
}: {
  /** What the sample shows. Printed as the caption. */
  label: string;
  /** Short language tag shown on the right of the caption, e.g. "bash". */
  language?: string;
  code: string;
  className?: string;
}) {
  return (
    <figure className={cn('card overflow-hidden', className)}>
      <figcaption className="flex items-center justify-between gap-4 border-b border-separator px-5 py-3">
        <span className="text-body-xs font-medium text-white">{label}</span>
        {language ? (
          <span className="shrink-0 text-eyebrow uppercase text-dim">{language}</span>
        ) : null}
      </figcaption>

      <pre
        tabIndex={0}
        className="scrollbar-slim overflow-x-auto px-5 py-4 text-left"
      >
        <code className="font-mono text-[13px] leading-[1.75] text-muted">{code}</code>
      </pre>
    </figure>
  );
}
