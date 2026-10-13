import { previewImage } from '@/lib/preview-media';
import { CtaPill } from '@/components/pages/channels/cta-pill';

/**
 * The solid violet band before a channel page's FAQ: heading and one line of
 * copy on the left, the white pill on the right with a hand-drawn arrow
 * pointing at it; stacked and left-aligned below 1024px. Same frame as the
 * home page's closing band, in the channel pages' own #4423CA.
 */
export function ChannelBand({ title, body }: { title: string; body: string }) {
  const doodle = previewImage('cta-band/doodle-cta.svg');
  const doodleMobile = previewImage('cta-band/doodle-cta-mobile.svg');

  return (
    <section className="section-pz">
      <div
        style={{ backgroundColor: '#4423CA' }}
        className="flex w-full flex-col justify-between gap-10 rounded-[20px] px-5 py-10 sm:p-15 lg:flex-row lg:items-center"
      >
        <div className="space-y-5 sm:space-y-4 lg:mr-[130px]">
          <h2 className="text-left font-jakarta text-[30px] font-bold leading-[33px] text-white sm:text-[48px] sm:leading-[52.8px]">
            {title}
          </h2>
          <p className="max-w-[620px] text-left text-[18px] font-normal leading-[23.44px] text-white sm:text-[22px] sm:leading-[28.64px]">
            {body}
          </p>
        </div>

        <div className="relative">
          <div className="min-w-[192px]">
            <div className="relative w-fit">
              <CtaPill />
              {doodleMobile ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doodleMobile}
                  alt=""
                  aria-hidden
                  width={87}
                  height={93}
                  loading="lazy"
                  className="pointer-events-none absolute left-[calc(100%+3px)] top-[-36px] block max-w-none sm:left-[calc(100%+15px)] sm:top-[-30px] lg:hidden"
                />
              ) : null}
            </div>
          </div>
          {doodle ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doodle}
              alt=""
              aria-hidden
              width={115}
              height={126}
              loading="lazy"
              className="pointer-events-none absolute left-[-130px] top-[-50px] hidden max-w-none lg:block"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
