import Link from 'next/link';
import { brand } from '@scheduler/brand';
import { footerColumns } from '@/content/nav';
import { Logo } from '@/components/ui/logo';

const YEAR = 2026;

/**
 * Giant wordmark that sits above the footer columns and is cut off by them.
 *
 * Purely decorative, so it is hidden from assistive tech and cannot be
 * selected or clicked. The geometry works in `em` of the band's own font size,
 * so the clip stays proportional as the clamp() scales from phone to desktop:
 *
 *   - `leading-none` gives the line box a height of 1em; the glyph tops of
 *     Plus Jakarta Sans sit roughly 0.18em below that box's top edge.
 *   - The text is pulled up 0.4em and then translated down 30% of its own
 *     height, which lands the cap tops ~0.08em below the band's top edge and
 *     the baseline ~0.8em down.
 *   - The band's own height is therefore 0.6em, so the footer's top edge cuts
 *     through the letters at about 70% of cap height: the bottom third is
 *     gone, as in the reference.
 *
 * The band is overflow-hidden in both axes and the text never wraps, so a long
 * brand name clips rather than widening the page at 390px.
 */
function Wordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative select-none overflow-hidden text-[length:clamp(96px,22vw,320px)]"
    >
      <p className="-mt-[0.4em] translate-y-[30%] whitespace-nowrap text-center font-display font-extrabold leading-none tracking-[-0.04em] text-accent">
        {brand.name}
      </p>
      {/* Soft top fade so the letters emerge from the page rather than start abruptly. */}
      <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-bg to-transparent" />
    </div>
  );
}

/**
 * Footer.
 *
 * The "source" line is not decoration. The engine is AGPL-3.0, and section 13
 * obliges an operator of a modified network service to offer that modified
 * source to its users. A persistent, prominent link discharges that obligation
 * and costs nothing. Do not remove it. See docs/06-agpl-compliance.md.
 */
export function Footer() {
  return (
    <footer className="bg-bg">
      <Wordmark />

      <div className="border-t border-white/[0.07]">
        <div className="shell py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div className="flex flex-col gap-5">
              <Logo />
              <p className="max-w-[34ch] text-body-sm leading-relaxed text-dim">
                {brand.tagline}.
              </p>
              {brand.supportEmail ? (
                <a
                  href={`mailto:${brand.supportEmail}`}
                  className="text-body-sm text-muted underline-offset-4 hover:text-white hover:underline"
                >
                  {brand.supportEmail}
                </a>
              ) : null}
            </div>

            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <p className="text-body-sm font-bold text-white">{col.title}</p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-dim transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-xs text-dim">
              &copy; {brand.legalName || brand.name}, {YEAR}. All rights reserved.
            </p>

            <p className="max-w-[62ch] text-body-xs leading-relaxed text-dim">
              Built on{' '}
              <a
                href={brand.upstream.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline underline-offset-4 hover:text-white"
              >
                {brand.upstream.project}
              </a>
              , licensed {brand.upstream.licence}.{' '}
              <a
                href={brand.upstream.sourceOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline underline-offset-4 hover:text-white"
              >
                Source for the version we run
              </a>
              . {brand.name} is not affiliated with or endorsed by the{' '}
              {brand.upstream.project} project.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
