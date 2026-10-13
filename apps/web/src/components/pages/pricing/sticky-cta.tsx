import { registerUrl } from '@scheduler/brand';
import { STICKY_CTA } from '@/components/pricing/copy';
import { PillLink } from '@/components/pricing/pill-link';

/**
 * Below 1024px the reference pins its main call to action to the bottom of the
 * screen: a full-width 52px white pill on a black fade (16px side and bottom
 * inset, 12px above), with an 88px spacer at the end of the page so the footer
 * is never hidden behind it. From 1024px both are gone.
 *
 * z-40 keeps the bar above the site-wide support pill (z-50, bottom-right),
 * which would otherwise sit on top of the button's right end on a phone.
 */
export function StickyCta() {
  return (
    <>
      <div aria-hidden className="h-[88px] lg:hidden" />
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent px-4 pb-4 pt-3 lg:hidden">
        <div className="flex justify-center">
          <PillLink href={registerUrl()} variant="primary" className="!h-[52px] !w-full justify-center">
            {STICKY_CTA}
          </PillLink>
        </div>
      </div>
    </>
  );
}
