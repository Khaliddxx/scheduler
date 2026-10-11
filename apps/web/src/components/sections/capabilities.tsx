import type { ComponentType } from 'react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/ui/section';
import { capabilities, type Capability } from '@/content/features';
import {
  AgentChatMock,
  AnalyticsMock,
  CalendarMock,
  EditorMock,
  PlugsMock,
  TeamMock,
} from '@/components/visuals';

/**
 * The capability bento: one card per entry in `capabilities`, each pairing its
 * copy with the matching product illustration.
 *
 * Layout and surface both come from the content entry, so the rhythm of the grid
 * is a content decision: `span: 'full'` makes a card text-left / visual-right
 * across both columns, and the two ids in `brandCards` carry the gradient panel
 * so the column of dark cards is broken up twice rather than never or everywhere.
 *
 * The illustrations are decorative and already carry `aria-hidden` themselves
 * (see components/visuals), so nothing inside them is announced or focusable.
 */

type MockProps = { className?: string };

/** Exhaustive by construction: the key type is the `visual` union from content. */
const visuals: Record<Capability['visual'], ComponentType<MockProps>> = {
  calendar: CalendarMock,
  agents: AgentChatMock,
  editor: EditorMock,
  team: TeamMock,
  plugs: PlugsMock,
  analytics: AnalyticsMock,
};

/** Two gradient panels, spaced so no single viewport shows both. */
const brandCards: ReadonlySet<string> = new Set(['agents', 'analytics']);

/**
 * Section chrome. Every other string here resolves from src/content; this heading
 * has no content home yet, so it sits as a named constant rather than being
 * buried in the markup — moving it into content later is a one-line change.
 */
const HEADING = {
  eyebrow: 'Capabilities',
  title: 'The whole publishing loop, in one place',
  body:
    'Plan the week, let an agent draft it, design the image, get it approved, publish it and see what travelled — without leaving the calendar.',
};

function CapabilityCard({ item }: { item: Capability }) {
  const Visual = visuals[item.visual];
  const onBrand = brandCards.has(item.id);
  const full = item.span === 'full';

  return (
    <li
      className={cn(
        // overflow-hidden is what keeps a mock inside the card's radius.
        'flex flex-col overflow-hidden p-7 sm:p-9',
        onBrand ? 'panel-brand' : 'card rounded-card-lg',
        full && 'md:col-span-2',
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-7',
          full && 'md:grid md:grid-cols-2 md:items-center md:gap-10',
        )}
      >
        <div className="flex min-w-0 flex-col items-start gap-4">
          <span className="eyebrow">{item.eyebrow}</span>
          <h3 className="font-display text-heading-sm text-white sm:text-heading-md">
            {item.title}
          </h3>
          <p
            className={cn(
              'text-body-md',
              full && 'md:max-w-[46ch]',
              onBrand ? 'text-white/85' : 'text-muted',
            )}
          >
            {item.body}
          </p>
        </div>

        <div className={cn('min-w-0 overflow-hidden rounded-card', !full && 'mt-auto')}>
          <Visual />
        </div>
      </div>
    </li>
  );
}

export function Capabilities() {
  return (
    <Section id="capabilities">
      <div className="shell">
        <SectionHeading
          eyebrow={HEADING.eyebrow}
          title={HEADING.title}
          body={HEADING.body}
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2">
          {capabilities.map((item) => (
            <CapabilityCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
