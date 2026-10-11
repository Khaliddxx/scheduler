import { NextResponse } from 'next/server';
import { brand } from '@scheduler/brand';

/**
 * POST /api/contact — the contact form.
 *
 * Deliberately minimal and deliberately not wired to an email provider yet:
 * picking one is a decision with privacy-policy consequences (it becomes a
 * sub-processor). Until then this validates, rate-limits and logs, so the form
 * is honest about having received the message rather than silently dropping it.
 */

export const runtime = 'nodejs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 200, topic: 60, message: 5000 };

// Coarse in-memory rate limit. Resets on deploy and is per-instance, so it is
// a speed bump against casual abuse, not a real defence. Put a proper limiter
// in front of this before launch.
const hits = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60_000;
const LIMIT = 5;

const limited = (ip: string): boolean => {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    hits.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > LIMIT;
};

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (limited(ip)) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again shortly.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const str = (k: string): string =>
    typeof body[k] === 'string' ? (body[k] as string).trim() : '';

  const name = str('name');
  const email = str('email');
  const topic = str('topic');
  const message = str('message');

  // A hidden field real users never fill in. Cheap, and it catches most bots.
  if (str('website')) {
    return NextResponse.json({ ok: true });
  }

  const errors: Record<string, string> = {};
  if (!name || name.length > MAX.name) errors.name = 'Please give your name.';
  if (!email || !EMAIL.test(email) || email.length > MAX.email)
    errors.email = 'Please give a valid email address.';
  if (!message || message.length < 10) errors.message = 'Please say a little more.';
  if (message.length > MAX.message) errors.message = 'That is too long for this form.';
  if (topic.length > MAX.topic) errors.topic = 'Unknown topic.';

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // eslint-disable-next-line no-console
  console.info('[contact]', { name, email, topic, length: message.length });

  // TODO before launch: deliver this somewhere a human reads. Whatever you
  // choose becomes a sub-processor and must appear in the privacy policy.
  return NextResponse.json({
    ok: true,
    detail: `Thanks — we will reply to ${email}. If it is urgent, email ${brand.supportEmail}.`,
  });
}
