'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A terminal-style window: traffic-light dots, a monospace title, and the code
 * below it, wrapped rather than scrolled. With `copy`, a white pill in the title
 * bar copies the snippet and reads "Copied" for two seconds.
 */
export function CodeWindow({
  title,
  code,
  copy = false,
}: {
  title: string;
  code: string;
  copy?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = useCallback(() => {
    void navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="overflow-hidden rounded-[16px] border border-white border-opacity-10 bg-[#0e0e0e]">
      <div className="flex items-center justify-between border-b border-white border-opacity-10 bg-[#141414] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 font-mono text-[12px] text-[#d1d1d1] text-opacity-60">{title}</span>
        </div>
        {copy ? (
          <button
            type="button"
            onClick={onCopy}
            aria-label={`Copy: ${title}`}
            className="rounded-full bg-white px-3 py-1 font-jakarta text-[12px] font-semibold text-black transition-colors hover:bg-pink hover:text-white"
          >
            <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        ) : null}
      </div>
      <pre className="overflow-x-auto p-4 sm:p-5">
        <code className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[22px] text-[#d1d1d1] sm:text-[14px]">
          {code}
        </code>
      </pre>
    </div>
  );
}
