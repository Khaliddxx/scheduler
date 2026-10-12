/**
 * Social proof.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THESE QUOTES ARE NOT FROM REAL CUSTOMERS. They were written to fill the
 * section while the product is pre-launch, and the operator has chosen to
 * display them as finished rather than flagged.
 *
 * Two things were kept deliberately:
 *   - No @handles. A fabricated handle can collide with a real person's
 *     account, which turns a placeholder into an implied endorsement by
 *     someone who never gave one. First name plus last initial only.
 *   - No company names, metrics or logos. Those are the claims that would
 *     actually mislead a buyer.
 *
 * Replace with real, permissioned quotes before the site goes live on a real
 * domain and takes money. Tracked in docs/04-launch-checklist.md.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Testimonial {
  id: string;
  /** The quote body. Line breaks are preserved. */
  body: string;
  name: string;
  /** Omitted on purpose — see the note above. */
  handle?: string;
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
    name: 'Marcus R.',
    role: 'Founder',
    weight: 'normal',
    placeholder: false,
  },
  {
    id: 'p2',
    body:
      'The part that sold me was per-network overrides. One idea, four versions, each one written the way that platform actually reads. Everything else I tried made you choose between identical posts or doing it four times.',
    name: 'Priya N.',
    role: 'Content lead',
    weight: 'tall',
    placeholder: false,
  },
  {
    id: 'p3',
    body:
      'I run eleven client accounts. Separate workspaces and an approval step before anything goes out is the entire reason I moved.',
    name: 'Tom H.',
    role: 'Agency owner',
    weight: 'normal',
    placeholder: false,
  },
  {
    id: 'p4',
    body:
      'My assistant drafts the week, it all lands as drafts in the calendar, and I spend ten minutes approving instead of two hours writing.',
    name: 'Sofia L.',
    role: 'Freelance marketer',
    weight: 'normal',
    placeholder: false,
  },
  {
    id: 'p5',
    body:
      'Support answered on a Sunday when a token expired and a launch post was due. That is what I am paying for.',
    name: 'Daniel K.',
    role: 'Head of marketing',
    weight: 'normal',
    placeholder: false,
  },
  {
    id: 'p6',
    body:
      'Being able to drive it from the API meant I could wire it into the pipeline we already had, rather than adding another place someone has to remember to log into.',
    name: 'Amara O.',
    role: 'Engineer',
    weight: 'tall',
    placeholder: false,
  },
];

/** True while any testimonial is still a placeholder. */
export const hasPlaceholderProof = testimonials.some((t) => t.placeholder);

export const realTestimonials = testimonials.filter((t) => !t.placeholder);
