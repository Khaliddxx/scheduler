import type { ReactNode } from 'react';
import {
  TEMPLATE_NOTICE,
  placeholders,
  unresolvedPlaceholders,
  type LegalBlock,
  type LegalDocument,
  type PlaceholderKey,
} from '@/content/legal';
import { cn } from '@/lib/cn';

/**
 * Renderer for the legal pages.
 *
 * The page shell and the typography are the reference site's legal template:
 * one 840px column (720px measure), a left-aligned 40/70px title, then running
 * text at 17/18px with hairline-ruled section headings, lilac links and list
 * markers, and a lilac-ruled callout. There is no sidebar or contents list,
 * as in the reference; every section heading keeps a stable slug id so a
 * platform reviewer or a customer can still link to a specific clause.
 *
 * Terms and privacy are the same shape — a notice, an intro, numbered sections —
 * so they share this instead of each hand-numbering its own headings. The number
 * is derived from array position, so inserting a clause in src/content/legal.ts
 * renumbers the document.
 *
 * `[[token]]` markers in the content are replaced here. A token whose value is
 * set in brand.json renders as ordinary text; one that is unset renders as a
 * highlighted `<mark>` naming what is missing. That is deliberate: an unfilled
 * legal document should look unfinished on the page, not quietly read as if a
 * blank were intentional.
 */

/* ------------------------------------------------------------- typography */

/** Running text of the reference's `.content` block. */
export const LEGAL_TEXT =
  'text-[17px] leading-[1.65] tracking-[-0.005em] text-[rgba(255,255,255,0.84)] md:text-[18px] md:leading-[1.7]';

const MEASURE = 'max-w-[720px]';

const HEADING =
  'font-jakarta font-[700] leading-[1.25] tracking-[-0.02em] text-white [text-wrap:balance]';

export const LEGAL_P = cn('mb-[1.35rem] mt-0', MEASURE);

export const LEGAL_LINK =
  'font-[500] text-[#b094ff] underline decoration-[rgba(176,148,255,0.45)] decoration-1 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white';

const H2 = cn(
  HEADING,
  MEASURE,
  'scroll-mt-28 border-t border-[rgba(255,255,255,0.1)]',
  'mb-4 mt-10 pt-6 text-[26px] md:mb-5 md:mt-14 md:pt-8 md:text-[32px]',
);

const H3 = cn(HEADING, MEASURE, 'mb-3 text-[21px] md:mb-4 md:text-[24px]');

const LIST = cn(
  MEASURE,
  'mb-[1.35rem] pl-6 [&>li+li]:mt-[0.55rem] [&>li]:pl-[0.35rem] [&>li::marker]:font-[600] [&>li::marker]:text-[#b094ff]',
);

/** The page shell: header-clear top padding, 840px column, 50px under the title. */
export function LegalShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    // The reference pads 92px / 136px from the top of the document; the root
    // layout's 60px / 81px header spacer already provides the first part.
    <div className="pb-[100px] pt-[32px] sm:pb-[180px] sm:pt-[55px]">
      <div className={cn('relative mx-auto max-w-[840px] px-[20px]', LEGAL_TEXT)}>
        <h1
          className={cn(
            HEADING,
            MEASURE,
            'mb-[50px] text-left text-[40px] sm:text-[70px]',
          )}
        >
          {title}
        </h1>
        <div className="[&>:last-child]:!mb-0">{children}</div>
      </div>
    </div>
  );
}

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

/**
 * The "a lawyer has not read this" notice, set as the reference's callout
 * (lilac rule on the left, faint lilac wash). Exported separately so a legal
 * page can carry the same notice without going through `LegalDoc`.
 */
export function TemplateNotice({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'my-6 rounded-r-[14px] border-l-[3px] border-[#b094ff] bg-[rgba(176,148,255,0.07)] px-[1.15rem] py-4 text-[1.02em] leading-[1.65] text-[rgba(255,255,255,0.92)] md:my-8 md:px-6 md:py-5',
        MEASURE,
        className,
      )}
      aria-labelledby="template-notice-title"
    >
      <p className="text-[13px] font-[600] uppercase leading-[1.4] tracking-[0.08em] text-[#b094ff]">
        {TEMPLATE_NOTICE.eyebrow}
      </p>
      <p id="template-notice-title" className="mt-[0.85rem] font-[700] text-white">
        {TEMPLATE_NOTICE.title}
      </p>
      <p className="mt-[0.85rem]">{TEMPLATE_NOTICE.body}</p>
      {unresolvedPlaceholders.length > 0 ? (
        <p className="mt-[0.85rem] text-[0.85em] text-[rgba(255,255,255,0.55)]">
          {TEMPLATE_NOTICE.placeholderHint}
        </p>
      ) : null}
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
            <p key={i} className={LEGAL_P}>
              <Tokenised text={block.text} />
            </p>
          );
        }

        if (block.kind === 'sub') {
          return (
            <div key={i}>
              {/* Directly under the section heading the gap tightens, as `h2 + h3` does in the reference. */}
              <h3 className={cn(H3, i === 0 ? 'mt-5' : 'mt-8 md:mt-10')}>{block.heading}</h3>
              <p className={LEGAL_P}>
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
          <ol key={i} className={cn(LIST, 'list-decimal')}>
            {items}
          </ol>
        ) : (
          <ul key={i} className={cn(LIST, 'list-disc')}>
            {items}
          </ul>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ document */

export function LegalDoc({ doc }: { doc: LegalDocument }) {
  return (
    <LegalShell title={doc.title}>
      <p className={LEGAL_P}>
        <em className="text-white">Drafted {doc.drafted}</em>
      </p>

      <TemplateNotice />

      {doc.intro.map((paragraph, i) => (
        <p key={i} className={LEGAL_P}>
          <Tokenised text={paragraph} />
        </p>
      ))}

      {doc.sections.map((section, i) => {
        const id = slug(section.heading);
        return (
          <section key={id} aria-labelledby={id}>
            <h2 id={id} className={H2}>
              {i + 1}. {section.heading}
            </h2>
            <Blocks blocks={section.blocks} />
          </section>
        );
      })}
    </LegalShell>
  );
}
