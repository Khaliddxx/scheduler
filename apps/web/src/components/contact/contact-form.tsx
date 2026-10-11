'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FORM, topics } from '@/content/contact';
import { cn } from '@/lib/cn';

/**
 * The only client component on /contact.
 *
 * It POSTs JSON to `/api/contact`, which is owned by another workstream. Two
 * things here belong to that contract and must not be changed casually:
 *
 *  - the response shape `{ ok, detail?, error?, errors? }`, where `errors` is a
 *    field-name -> message map rendered inline;
 *  - the `website` honeypot input, which that handler uses to drop bots.
 *
 * The topic list lives in src/content/contact.ts and its labels are the submitted
 * values, because the route validates against them.
 *
 * Fields are uncontrolled and read through FormData on submit. That keeps this file
 * small and the server the authority on what is valid — the checks below are a
 * courtesy so an obvious mistake does not cost a round trip, not a second
 * validation layer to keep in step. Client errors are shown exactly like server
 * ones, and clear as soon as a field is edited.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Record<string, string>;

const field =
  'w-full rounded-input bg-surface px-4 py-3 text-body-sm text-white shadow-hairline ' +
  'transition-colors placeholder:text-dim hover:bg-bgInner';

const invalid = 'shadow-[inset_0_0_0_1px_var(--danger)]';

const asString = (value: FormDataEntryValue | undefined): string =>
  typeof value === 'string' ? value.trim() : '';

/** Permissive on purpose: a stricter pattern only rejects real addresses. */
const looksLikeEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

const validate = (data: Record<string, FormDataEntryValue>): Errors => {
  const errors: Errors = {};
  if (asString(data.name).length < 2) errors.name = FORM.errors.name;
  if (!looksLikeEmail(asString(data.email))) errors.email = FORM.errors.email;
  if (asString(data.message).length < 10) errors.message = FORM.errors.message;
  return errors;
};

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="text-body-xs text-danger">
      {children}
    </p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');

  /** Drop a field's error the moment someone starts fixing it. */
  const clearError = (name: string) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    const found = validate(data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus('error');
      setMessage(FORM.errors.check);
      return;
    }

    setStatus('sending');
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as {
        ok?: boolean;
        detail?: string;
        error?: string;
        errors?: Errors;
      };

      if (res.ok && body.ok) {
        setStatus('sent');
        setMessage(body.detail ?? FORM.success.body);
        return;
      }
      if (body.errors) setErrors(body.errors);
      setStatus('error');
      setMessage(body.error ?? FORM.errors.check);
    } catch {
      setStatus('error');
      setMessage(FORM.errors.network);
    }
  };

  if (status === 'sent') {
    return (
      <div className="card flex flex-col items-start gap-3 p-7 sm:p-8" role="status">
        <h2 className="font-display text-heading-sm text-white">{FORM.success.title}</h2>
        <p className="max-w-[48ch] text-body-md text-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-7 sm:p-8">
      <h2 className="font-display text-heading-sm text-white">{FORM.legend}</h2>

      {/* Honeypot, consumed by the API route. Visually and programmatically hidden. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-body-sm font-medium text-white">
            {FORM.name.label}
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete={FORM.name.autoComplete}
            onChange={() => clearError('name')}
            className={cn(field, errors.name && invalid)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? <FieldError id="name-error">{errors.name}</FieldError> : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-body-sm font-medium text-white">
            {FORM.email.label}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete={FORM.email.autoComplete}
            onChange={() => clearError('email')}
            className={cn(field, errors.email && invalid)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          />
          {errors.email ? (
            <FieldError id="email-error">{errors.email}</FieldError>
          ) : (
            <p id="email-hint" className="text-body-xs text-dim">
              {FORM.email.hint}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className="text-body-sm font-medium text-white">
          {FORM.topic.label}
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue={topics[0]}
          className={cn(field, 'appearance-none pr-11')}
          style={{
            // Chevron drawn from two gradients: no icon dependency, and the native
            // select keeps its own keyboard and mobile behaviour.
            backgroundImage:
              'linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)',
            backgroundPosition: 'calc(100% - 22px) 55%, calc(100% - 16px) 55%',
            backgroundSize: '6px 6px, 6px 6px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {topics.map((topic) => (
            <option key={topic} value={topic} className="bg-bgInner">
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-body-sm font-medium text-white">
          {FORM.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={FORM.message.placeholder}
          onChange={() => clearError('message')}
          className={cn(field, 'resize-y leading-[1.6]', errors.message && invalid)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message ? <FieldError id="message-error">{errors.message}</FieldError> : null}
      </div>

      {status === 'error' && message ? (
        <p role="alert" className="text-body-sm leading-[1.5] text-danger">
          {message}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          disabled={status === 'sending'}
          size="lg"
          withChevron={status !== 'sending'}
        >
          {status === 'sending' ? FORM.submitting : FORM.submit}
        </Button>
      </div>
    </form>
  );
}
