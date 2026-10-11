import {
  TEMPLATE_NOTICE,
  placeholders,
  unresolvedPlaceholders,
  type LegalBlock,
  type LegalDocument,
  type PlaceholderKey,
} from '@/content/legal';
import { Section } from '@/components/ui/section';
import { Prose } from '@/components/ui/prose';
import { cn } from '@/lib/cn';

/**
 * Renderer for the two legal documents.
 *
 * Both pages are the same shape — a notice, an intro, numbered sections, a
 * contents list — so they share this instead of each hand-numbering its own
 * headings. The number is derived from array position, so inserting a clause in
 * src/content/legal.ts renumbers the document and its contents list together.
 *
 * The two things worth knowing:
 *
 *  1. `[[token]]` markers in the content are replaced here. A token whose value is
 *     set in brand.json renders as ordinary text; one that is unset renders as a
 *     highlighted `<mark>` naming what is missing. That is deliberate: an unfilled
 *     legal document should look unfinished on the page, not quietly read as if a
 *     blank were intentional.
 *  2. Every section heading is an `<h2>` with a stable slug id, so a platform
 *     reviewer or a customer can link to a specific clause.
 */

/* ------------------------------------------------------------------ tokens */

const TOKEN = /\[\[(entity|jurisdiction|address)\]\]/g;

const isPlaceholderKey = (value: string): value is PlaceholderKey =>
  value === 'entity' || value === 'jurisdiction' || value === 'address';

function Unset({ label }: { label: string }) {
  return (
    <mark className="rounded-[5px] bg-white/10 px-1.5 py-0.5 font-semibold text-warn shadow-hairline">
      {label}
    </mark>
  );
}

/** Splits a string on `[[token]]` and substitutes each one. */
function Tokenised({ text }: { text: string }) {
  // String.split with a capturing group alternates literal, capture, literal…
  const parts = text.split(TOKEN);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        if (!isPlaceholderKey(part)) return part;

        const placeholder = placeholders[part];
        return placeholder.value.length > 0 ? (
          placeholder.value
        ) : (
          <Unset key={`${part}-${i}`} label={placeholder.label} />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ notice */

function WarningGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      className="mt-0.5 shrink-0 text-warn"
    >
      <path
        d="M10 2.9 18.2 17H1.8L10 2.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.6v4.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * The "a lawyer has not read this" panel. Exported separately so a future legal
 * page can carry the same notice without going through `LegalDoc`.
 */
export function TemplateNotice({ className }: { className?: string }) {
  return (
    <aside
      className={cn('card border-l-4 border-l-warn p-6 sm:p-7', className)}
      aria-labelledby="template-notice-title"
    >
      <div className="flex gap-4">
        <WarningGlyph />
        <div className="min-w-0">
          <p className="text-eyebrow uppercase tracking-[0.08em] text-warn">
            {TEMPLATE_NOTICE.eyebrow}
          </p>
          <h2
            id="template-notice-title"
            className="mt-2 font-display text-body-lg font-bold leading-[1.3] text-white"
          >
            {TEMPLATE_NOTICE.title}
          </h2>
          <p className="mt-3 max-w-[70ch] text-body-sm leading-[1.65] text-muted">
            {TEMPLATE_NOTICE.body}
          </p>
          {unresolvedPlaceholders.length > 0 ? (
            <p className="mt-3 max-w-[70ch] text-body-xs leading-[1.6] text-dim">
              {TEMPLATE_NOTICE.placeholderHint}
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ blocks */

const slug = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === 'p') {
          return (
            <p key={i}>
              <Tokenised text={block.text} />
            </p>
          );
        }

        if (block.kind === 'sub') {
          return (
            <div key={i}>
              <h3>{block.heading}</h3>
              <p>
                <Tokenised text={block.text} />
              </p>
            </div>
          );
        }

        const items = block.items.map((item, j) => (
          <li key={j}>
            <Tokenised text={item} />
          </li>
        ));

        return block.kind === 'steps' ? (
          <ol key={i}>{items}</ol>
        ) : (
          <ul key={i}>{items}</ul>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ document */

export function LegalDoc({ doc }: { doc: LegalDocument }) {
  const entries = doc.sections.map((section, i) => ({
    number: i + 1,
    id: slug(section.heading),
    section,
  }));

  return (
    <Section tight>
      <div className="shell">
        <TemplateNotice />

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          {/* Contents. First in the DOM because it is first in reading order on a
              phone too — a 19-clause document needs a way past clause one. */}
          <nav aria-label="Document sections" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-eyebrow uppercase text-dim">On this page</p>
            <ol className="scrollbar-slim mt-4 max-h-[320px] space-y-2.5 overflow-y-auto pr-2 lg:max-h-[min(70dvh,620px)]">
              {entries.map((entry) => (
                <li key={entry.id} className="flex gap-2.5">
                  <span aria-hidden className="w-4 shrink-0 text-body-xs text-dim">
                    {entry.number}
                  </span>
                  <a
                    href={`#${entry.id}`}
                    className="text-body-xs leading-[1.5] text-muted underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {entry.section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0">
            <p className="text-body-xs uppercase tracking-[0.08em] text-dim">
              Drafted {doc.drafted}
            </p>

            <Prose className="mt-6 max-w-[74ch]">
              {doc.intro.map((paragraph, i) => (
                <p key={i} className="first:text-body-lg first:text-white">
                  <Tokenised text={paragraph} />
                </p>
              ))}

              {entries.map((entry) => (
                <section key={entry.id} aria-labelledby={entry.id}>
                  <h2 id={entry.id} className="scroll-mt-28">
                    <span aria-hidden className="mr-2.5 text-dim">
                      {entry.number}.
                    </span>
                    {entry.section.heading}
                  </h2>
                  <Blocks blocks={entry.section.blocks} />
                </section>
              ))}
            </Prose>
          </article>
        </div>
      </div>
    </Section>
  );
}
