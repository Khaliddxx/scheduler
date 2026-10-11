import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/ui/section';
import { agentIntegrations } from '@/content/features';
import { primaryNav } from '@/content/nav';

/**
 * The automation surfaces, as a bento grid straight off `agentIntegrations`.
 *
 * Each card's colour is the `tone` gradient carried in the content entry, so the
 * palette of this section is editable without touching this file. The gradients
 * are the only colour here on purpose — the glyph tiles are neutral white veils —
 * because six saturated panels plus accents would read as a template.
 *
 * The glyphs are drawn here rather than pulled from an icon package: the site
 * ships no icon dependency. `glyphs` is keyed by the six ids that exist in
 * content today; a new integration with no glyph renders without one rather than
 * crashing, which is what the type guard below is for.
 */

/** The nav entry already names this section; reuse its words instead of new ones. */
const developers = primaryNav
  .flatMap((group) => group.children ?? [])
  .find((link) => link.href === '/developers');

/**
 * Section chrome. Every other string in this file resolves from src/content; this
 * heading has no content home yet, so it sits here as a named constant rather
 * than buried in the markup — moving it into content later is a one-line change.
 */
const TITLE = 'Drive it from whatever you already use';

type GlyphKey = 'mcp' | 'cli' | 'api' | 'automations' | 'rss' | 'webhooks';

const glyphs: Record<GlyphKey, ReactNode> = {
  // A server with clients hanging off it.
  mcp: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="4.8" cy="6.4" r="2" />
      <circle cx="19.2" cy="6.4" r="2" />
      <circle cx="12" cy="20" r="2" />
      <path d="M6.5 7.7 9.6 10.2" />
      <path d="M17.5 7.7 14.4 10.2" />
      <path d="M12 15v3" />
    </>
  ),
  // A terminal window with a prompt.
  cli: (
    <>
      <rect x="2.8" y="4.4" width="18.4" height="15.2" rx="3" />
      <path d="M2.8 8.8h18.4" />
      <path d="M6.9 12.6 9.1 14.8 6.9 17" />
      <path d="M11.8 17h5.3" />
    </>
  ),
  // Braces around a payload.
  api: (
    <>
      <path d="M9 4.8C6.6 5.6 7.8 10.6 4.8 12c3 1.4 1.8 6.4 4.2 7.2" />
      <path d="M15 4.8c2.4.8 1.2 5.8 4.2 7.2-3 1.4-1.8 6.4-4.2 7.2" />
      <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  // A workflow branching into two steps.
  automations: (
    <>
      <rect x="2.6" y="9.4" width="6" height="5.2" rx="2" />
      <rect x="15.4" y="3.6" width="6" height="5.2" rx="2" />
      <rect x="15.4" y="15.2" width="6" height="5.2" rx="2" />
      <path d="M8.6 12h2.4a1.6 1.6 0 0 0 1.6-1.6V7.8a1.6 1.6 0 0 1 1.6-1.6h1.2" />
      <path d="M8.6 12h2.4a1.6 1.6 0 0 1 1.6 1.6v2.6a1.6 1.6 0 0 0 1.6 1.6h1.2" />
    </>
  ),
  // The feed mark: broadcast arcs from a point.
  rss: (
    <>
      <circle cx="6.2" cy="17.8" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4.6 11.6a7.8 7.8 0 0 1 7.8 7.8" />
      <path d="M4.6 6a13.4 13.4 0 0 1 13.4 13.4" />
    </>
  ),
  // Traffic leaving and arriving.
  webhooks: (
    <>
      <rect x="2.8" y="4.4" width="7.2" height="15.2" rx="2.6" />
      <path d="M13.2 8.8h7.6" />
      <path d="M18.3 6.3 20.8 8.8 18.3 11.3" />
      <path d="M20.8 15.2h-7.6" />
      <path d="M15.7 12.7 13.2 15.2 15.7 17.7" />
    </>
  ),
};

const isGlyphKey = (id: string): id is GlyphKey =>
  Object.prototype.hasOwnProperty.call(glyphs, id);

function Glyph({ name }: { name: GlyphKey }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {glyphs[name]}
    </svg>
  );
}

export function Integrations() {
  return (
    <Section id="automation">
      <div className="shell">
        <SectionHeading
          eyebrow={developers?.label ?? 'Automation and API'}
          title={TITLE}
          body={developers?.description ?? 'REST, webhooks, MCP and CLI'}
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2">
          {agentIntegrations.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex flex-col overflow-hidden rounded-card-lg bg-gradient-to-br p-8 shadow-hairline sm:p-10',
                item.tone,
                item.wide && 'md:col-span-2',
              )}
            >
              {isGlyphKey(item.id) ? (
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-white/15 text-white shadow-hairline">
                  <Glyph name={item.id} />
                </span>
              ) : null}

              <h3 className="mt-7 font-display text-heading-md text-white sm:mt-8 sm:text-display-sm">
                {item.name}
              </h3>
              <p className="mt-4 max-w-[46ch] text-body-md text-white/75">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
