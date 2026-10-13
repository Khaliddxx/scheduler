import type { ReactNode } from 'react';

/**
 * The stacked gradient panels of a channel page: a centred h2 and intro, then
 * five full-colour panels, each a title + paragraph beside an illustration.
 *
 * Measurements are the reference design's: panels are 335px wide (550px from
 * 640px) with the illustration above the copy, and from 1360px they are
 * 1320px wide with the 698px illustration beside the copy, alternating sides.
 * The five gradients and their order are the reference's.
 */

export interface Panel {
  title: string;
  body: string;
  illustration: ReactNode;
  /** Extra content under the paragraph (the cross-post panel's channel links). */
  extra?: ReactNode;
}

const TONES: Array<{ gradient: string; flip: boolean }> = [
  { gradient: 'bg-gradient-to-br from-[#4A0047] to-[#B611B0]', flip: true },
  { gradient: 'bg-gradient-to-br from-[#9033ED] to-[#3C0078]', flip: false },
  { gradient: 'bg-gradient-to-br from-[#002584] to-[#164CD9]', flip: true },
  { gradient: 'bg-gradient-to-br from-[#4C27E1] to-[#2F007B]', flip: false },
  { gradient: 'bg-gradient-to-bl from-[#7B08D5] to-[#390053]', flip: true },
];

export function FeaturePanels({
  heading,
  intro,
  panels,
}: {
  heading: ReactNode;
  intro: ReactNode;
  panels: Panel[];
}) {
  return (
    <section className="section-pz space-y-[40px] sm:space-y-[60px]">
      <div className="flex flex-col items-center gap-8 sm:gap-10">
        <h2 className="h2-pz text-white">{heading}</h2>
        <p className="max-w-[670px] text-center text-[18px] font-normal leading-[23.44px] text-[#d1d1d1] sm:text-[22px] sm:leading-[28.64px]">
          {intro}
        </p>
      </div>

      <div className="flex flex-col justify-center gap-2 sm:gap-3">
        {panels.map((panel, i) => {
          const tone = TONES[i % TONES.length];
          return (
            <article
              key={panel.title}
              className={[
                'flex w-[335px] max-w-full flex-col-reverse justify-between gap-5 rounded-[16px] border border-white/10 p-5 sm:w-[550px] sm:gap-[38px] sm:rounded-[32px] sm:p-10 2xl:w-[1320px] 2xl:items-center',
                tone.gradient,
                tone.flip ? '2xl:flex-row-reverse' : '2xl:flex-row',
              ].join(' ')}
            >
              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-3">
                  <h3 className="text-balance font-jakarta text-[22px] font-semibold leading-[24.2px] text-white sm:text-[38px] sm:leading-[41.8px]">
                    {panel.title}
                  </h3>
                  <p className="max-w-[570px] text-[18px] leading-[23.44px] text-white sm:text-[22px] sm:leading-[28.64px]">
                    {panel.body}
                  </p>
                </div>
                {panel.extra}
              </div>
              <div className="relative w-full overflow-hidden rounded-[16px] 2xl:max-w-[698px] 2xl:shrink-0">
                {panel.illustration}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
