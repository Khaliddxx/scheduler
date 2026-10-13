import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { TextLink } from './blocks';

/**
 * Renders copy with `[label](href)` segments as links. Nothing else is parsed.
 * `plain` links are white-underlined (the hero footnote); the default ones
 * take the page accent.
 */
export function Rich({ text, plain = false }: { text: string; plain?: boolean }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      plain ? (
        <Link key={m.index} href={m[2]} className="underline underline-offset-2 transition-colors hover:text-white">
          {m[1]}
        </Link>
      ) : (
        <TextLink key={m.index} href={m[2]}>
          {m[1]}
        </TextLink>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return (
    <>
      {out.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
