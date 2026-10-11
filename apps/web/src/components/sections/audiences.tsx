import type { ReactNode } from 'react';
import { Section, SectionHeading } from '@/components/ui/section';
import { audiences, type Audience } from '@/content/features';
import { primaryNav } from '@/content/nav';

/**
 * Who the product is for: three cards straight off `audiences`.
 *
 * The icons are drawn here rather than pulled from an icon package — the site
 * ships no icon dependency, and these are the only four keys the Audience type
 * allows, so the map below is exhaustive by construction.
 */

const icons: Record<Audience['icon'], ReactNode> = {
  sparkles: (
    <>
      <path d="M10.5 3.4 12.1 8.1 16.8 9.7 12.1 11.3 10.5 16 8.9 11.3 4.2 9.7 8.9 8.1 10.5 3.4Z" />
      <path d="M17.2 14 18 16.2 20.2 17 18 17.8 17.2 20 16.4 17.8 14.2 17 16.4 16.2 17.2 14Z" />
    </>
  ),
  code: (
    <>
      <path d="M9 7.5 4.5 12 9 16.5" />
      <path d="M15 7.5 19.5 12 15 16.5" />
      <path d="M13.3 4.4 10.7 19.6" />
    </>
  ),
  workflow: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6" rx="2" />
      <rect x="14" y="14.5" width="6.5" height="6" rx="2" />
      <path d="M6.75 9.5v6a2 2 0 0 0 2 2H14" />
    </>
  ),
  users: (
    <>
      <circle cx="9.4" cy="8" r="3.2" />
      <path d="M3.8 19.4c0-3.1 2.5-5.3 5.6-5.3s5.6 2.2 5.6 5.3" />
      <path d="M15.9 5.2a3.2 3.2 0 0 1 0 5.6" />
      <path d="M17.1 14.4c1.9.7 3.1 2.5 3.1 5" />
    </>
  ),
};

/** The nav already describes this section; reuse its words instead of new ones. */
const howItWorks = primaryNav
  .flatMap((group) => group.children ?? [])
  .find((link) => link.href === '/#how-it-works');

function AudienceIcon({ name }: { name: Audience['icon'] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icons[name]}
    </svg>
  );
}

export function Audiences() {
  return (
    <Section id="how-it-works">
      <div className="shell">
        <SectionHeading
          eyebrow={howItWorks?.label ?? 'How it works'}
          title={howItWorks?.description ?? 'Write once, publish everywhere'}
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
          {audiences.map((audience) => (
            <li key={audience.id} className="card flex flex-col gap-5 p-7 sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-white/[0.06] text-accent shadow-hairline">
                <AudienceIcon name={audience.icon} />
              </span>
              <h3 className="font-display text-heading-sm text-white sm:text-heading-md">
                {audience.title}
              </h3>
              <p className="text-body-md text-muted">{audience.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
