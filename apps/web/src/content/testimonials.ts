/**
 * Social proof.
 *
 * ============================ READ THIS ============================
 * EVERY ENTRY BELOW IS A PLACEHOLDER with `placeholder: true`.
 *
 * They exist so the section has realistic shape and length while you design.
 * They are NOT real customers and must NOT ship. Publishing invented
 * testimonials attributed to named people is a straightforward consumer-
 * protection violation in the US, UK and EU, and it is the single easiest
 * thing for a prospect to catch.
 *
 * The build fails if any entry still has `placeholder: true` when
 * NEXT_PUBLIC_ALLOW_PLACEHOLDER_PROOF is not set — see lib/guards.ts.
 * Replace them with real, permissioned quotes, or delete the section until
 * you have some. An honest empty state beats fabricated proof.
 * ===================================================================
 */

export interface Testimonial {
  id: string;
  /** The quote body. Line breaks are preserved. */
  body: string;
  name: string;
  handle: string;
  /** Optional role/company line. */
  role?: string;
  /** Larger quotes get a wider card in the masonry. */
  weight?: 'normal' | 'tall';
  placeholder: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 'p1',
    body:
      'We were posting to five networks by hand and quietly skipping two of them most weeks. Now the whole month is laid out on a Monday and I stop thinking about it.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    role: 'Founder, placeholder company',
    weight: 'normal',
    placeholder: true,
  },
  {
    id: 'p2',
    body:
      'The part that sold me was per-network overrides. One idea, four versions, each one written the way that platform actually reads. Everything else I tried made you choose between identical posts or doing it four times.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    role: 'Content lead',
    weight: 'tall',
    placeholder: true,
  },
  {
    id: 'p3',
    body:
      'I run eleven client accounts. Separate workspaces and an approval step before anything goes out is the entire reason I moved.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    role: 'Agency owner',
    weight: 'normal',
    placeholder: true,
  },
  {
    id: 'p4',
    body:
      'My assistant drafts the week, it all lands as drafts in the calendar, and I spend ten minutes approving instead of two hours writing.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    weight: 'normal',
    placeholder: true,
  },
  {
    id: 'p5',
    body:
      'Support answered on a Sunday when a token expired and a launch post was due. That is what I am paying for.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    role: 'Marketing manager',
    weight: 'normal',
    placeholder: true,
  },
  {
    id: 'p6',
    body:
      'Being able to drive it from the API meant I could wire it into the pipeline we already had, rather than adding another place someone has to remember to log into.',
    name: 'Placeholder Name',
    handle: '@placeholder',
    role: 'Engineer',
    weight: 'tall',
    placeholder: true,
  },
];

/** True while any testimonial is still a placeholder. */
export const hasPlaceholderProof = testimonials.some((t) => t.placeholder);

export const realTestimonials = testimonials.filter((t) => !t.placeholder);
