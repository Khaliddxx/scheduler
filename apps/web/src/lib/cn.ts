/** Join class names, dropping falsy values. Keeps conditional classes readable. */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');
