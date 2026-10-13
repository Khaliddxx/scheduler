'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { DoubleChevron } from '@/components/layout/header-icons';
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
 * values, because the route validates against them. They are rendered as a radio
 * group styled as the reference's filter chips; the checked one is submitted as
 * `topic`, exactly as the old `<select>` was.
 *
 * Fields are uncontrolled and read through FormData on submit. That keeps this file
 * small and the server the authority on what is valid — the checks below are a
 * courtesy so an obvious mistake does not cost a round trip, not a second
 * validation layer to keep in step. Client errors are shown exactly like server
 * ones, and clear as soon as a field is edited.
 *
 * Visuals follow the reference's only text field (the grey 20px-radius well
 * around its tool textarea) inside its standard dark card, with a pink border
 * on focus so keyboard users can see where they are.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Record<string, string>;

const CARD = 'rounded-[20px] border border-[#FFFFFF0D] bg-[#1A1919]';

/** The grey well around each field. */
const well =
  'flex rounded-[20px] border border-[#3D3D3D] bg-[#3D3D3D] p-1 transition-colors ' +
  'hover:border-[#5a5a5a] focus-within:border-pink focus-within:shadow-[0_0_0_1px_#FF4CE2]';

const wellInvalid = '!border-[#ff0033] shadow-[0_0_0_1px_#ff0033]';

/** The field itself: transparent, 16/22 on phones and 19/24.74 from 640px. */
const control =
  'w-full bg-transparent text-[16px] leading-[22px] text-white outline-none ' +
  'placeholder:text-white/40 sm:text-[19px] sm:leading-[24.74px]';

const label = 'text-[16px] font-[500] leading-[20.83px] text-white';

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
    <p id={id} className="text-[14px] leading-[18px] text-[#ff0033]">
      {children}
    </p>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full max-w-[900px] flex-col items-center gap-[40px] sm:gap-[60px]">
      <h2 className="h2-pz">{FORM.legend}</h2>
      {children}
    </div>
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
      <Frame>
        <div
          className={cn(CARD, 'flex w-full flex-col items-center gap-3 p-6 text-center sm:p-8')}
          role="status"
        >
          <div className="text-[32px]" aria-hidden="true">
            ✅
          </div>
          <p className="font-jakarta text-[22px] font-[700] leading-[26px]">{FORM.success.title}</p>
          <p className="max-w-[48ch] text-[16px] leading-[22px] text-[#d1d1d1]">{message}</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label={FORM.legend}
        className={cn(CARD, 'relative flex w-full flex-col gap-6 p-6 sm:p-8')}
      >
        {/* Honeypot, consumed by the API route. Visually and programmatically hidden. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Leave this empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label htmlFor="name" className={label}>
              {FORM.name.label}
            </label>
            <div className={cn(well, errors.name && wellInvalid)}>
              <input
                id="name"
                name="name"
                required
                autoComplete={FORM.name.autoComplete}
                onChange={() => clearError('name')}
                className={cn(control, 'px-5 py-4')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
            </div>
            {errors.name ? <FieldError id="name-error">{errors.name}</FieldError> : null}
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="email" className={label}>
              {FORM.email.label}
            </label>
            <div className={cn(well, errors.email && wellInvalid)}>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                required
                autoComplete={FORM.email.autoComplete}
                onChange={() => clearError('email')}
                className={cn(control, 'px-5 py-4')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : 'email-hint'}
              />
            </div>
            {errors.email ? (
              <FieldError id="email-error">{errors.email}</FieldError>
            ) : (
              <p id="email-hint" className="text-[14px] leading-[18px] text-[#d1d1d1]">
                {FORM.email.hint}
              </p>
            )}
          </div>
        </div>

        <fieldset>
          <legend className={cn(label, 'mb-3')}>{FORM.topic.label}</legend>
          <div className="flex flex-wrap gap-[6px]">
            {topics.map((topic, i) => (
              <label key={topic} className="cursor-pointer">
                <input
                  type="radio"
                  name="topic"
                  value={topic}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    'block rounded-full px-[14px] py-[6px] text-[13px] transition-all sm:text-[14px]',
                    'bg-[#3D3D3D] text-white hover:bg-[#4d4d4d]',
                    'peer-checked:bg-white peer-checked:text-black',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pink',
                  )}
                >
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3">
          <label htmlFor="message" className={label}>
            {FORM.message.label}
          </label>
          <div className={cn(well, errors.message && wellInvalid)}>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={FORM.message.placeholder}
              onChange={() => clearError('message')}
              className={cn(control, 'resize-y p-5')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
          </div>
          {errors.message ? <FieldError id="message-error">{errors.message}</FieldError> : null}
        </div>

        {status === 'error' && message ? (
          <p role="alert" className="text-[16px] leading-[22px] text-[#ff0033]">
            {message}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className={cn(
              'flex h-fit w-full cursor-pointer items-center justify-center gap-[6px] whitespace-nowrap rounded-full bg-white font-[500] text-[#0e0e0e] stroke-[#0e0e0e] transition-all',
              'hover:bg-pink hover:text-white hover:stroke-white disabled:cursor-wait disabled:opacity-60',
              'py-[12px] pl-[24px] pr-[16px] text-[16px] leading-[20.83px] sm:w-fit sm:py-4 sm:!pl-8 sm:!pr-6 sm:text-[19px] sm:leading-[25px] min-[1024px]:leading-[24.74px]',
            )}
          >
            {status === 'sending' ? FORM.submitting : FORM.submit}
            {status === 'sending' ? null : <DoubleChevron className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
        </div>
      </form>
    </Frame>
  );
}
