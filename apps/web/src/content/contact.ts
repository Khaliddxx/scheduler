/**
 * Copy and form shape for /contact.
 *
 * The topic list is content, not markup, because it drives three things at once:
 * the `<select>` on the page, the validation in the client component, and
 * (eventually) the routing on the API side. One source means the form cannot offer
 * a topic the handler does not know about.
 *
 * The response-time line is a promise printed on a page, so keep it one you can
 * actually keep. Better a dull true sentence than a cheerful false one.
 */
import { brand } from '@scheduler/brand';
import { TRIAL_DAYS } from '@/content/pricing';

export const CONTACT = {
  eyebrow: 'Contact',
  title: 'Talk to the people who run it',
  body: `Questions about plans, a dedicated instance, the open-source licence, or something that is not working. Email reaches whoever is on the pager, not a routing queue.`,
  description: `Get in touch about plans, agency workspaces, a dedicated instance, the open-source licence or support. Email ${brand.supportEmail}.`,
} as const;

/**
 * Topic options.
 *
 * THE LABEL IS THE SUBMITTED VALUE. `/api/contact` (owned by another workstream)
 * takes the topic as a free string and only bounds its length, so these can be
 * edited as copy — but if that route ever starts validating against a fixed set,
 * this list is the set it has to match. Keep each one under 60 characters, which
 * is the limit the route enforces today.
 */
export const topics: string[] = [
  'Pricing or plans',
  'Agencies and client workspaces',
  'A dedicated instance',
  'Migrating from another tool',
  'Something is broken',
  'Open source and licensing',
  'Privacy, data and compliance',
  'Something else',
];

/** Field labels, helper text and messages for the form. */
export const FORM = {
  legend: 'Send us a message',
  name: { label: 'Your name', autoComplete: 'name' },
  email: {
    label: 'Email',
    hint: 'We reply to this address.',
    autoComplete: 'email',
  },
  topic: { label: 'What is this about?' },
  message: {
    label: 'Message',
    placeholder:
      'What are you trying to do, and what is in the way? If something failed, the channel and roughly when helps.',
  },
  submit: 'Send message',
  submitting: 'Sending…',
  success: {
    title: 'Message sent',
    /** Fallback when the API returns no detail of its own. */
    body: `It is with us. We reply to everything, usually within one business day — sooner if something is broken.`,
  },
  errors: {
    name: 'Tell us what to call you.',
    email: 'That does not look like an email address we can reply to.',
    message: 'A sentence or two is plenty — we just need something to go on.',
    /** Shown above the submit button when the server rejects the submission. */
    check: 'Please check the highlighted fields.',
    /** Shown when the request itself fails. */
    network: `That did not send. Email ${brand.supportEmail} directly and we will pick it up there.`,
  },
} as const;

/** The three cards beside the form. */
export const CHANNELS_OF_CONTACT: Array<{
  title: string;
  body: string;
  action?: { label: string; href: string; external?: boolean };
}> = [
  {
    title: 'Email',
    body: 'The fastest route for anything specific. It goes to the people who operate the service.',
    action: { label: brand.supportEmail, href: `mailto:${brand.supportEmail}` },
  },
  {
    title: 'Already a customer with something broken?',
    body: 'Say which channel and roughly when it failed. We can read the publish error from this side, which usually saves a round trip.',
  },
  {
    title: 'Evaluating us?',
    body: `Every plan has a ${TRIAL_DAYS}-day trial, so you can test a real publish to a real account before talking to anyone. Start there and write if it does not do what you need.`,
    action: { label: 'See pricing', href: '/pricing' },
  },
];

/** Expectations, printed under the form rather than hidden in an autoresponder. */
export const EXPECTATIONS: string[] = [
  'One business day for a first reply, in English, from a person.',
  'Support questions get the platform’s actual error, not a suggestion to clear your cache.',
  'No sales sequence. If you ask a question, you get an answer to that question.',
  'Privacy and data requests are handled under our privacy policy, within a month and usually much sooner.',
];
