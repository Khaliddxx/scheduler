import { brand } from '@scheduler/brand';
import { cn } from '@/lib/cn';
import { previewImage } from '@/lib/preview-media';
import { Section, SectionHeading } from '@/components/ui/section';
import { VideoFrame } from '@/components/ui/video-frame';
import { assistants } from '@/content/assistants';

/**
 * "Power your content" — six cards, one per assistant that can drive the
 * calendar, each with its footage underneath the copy.
 */
export function Assistants() {
  return (
    <Section id="assistants">
      <div className="shell">
        <SectionHeading
          eyebrow="Agentic scheduling"
          title="Power your content from the assistant you already use"
          body={`Ask for a week of posts where you already work. Every draft lands in your ${brand.name} calendar for you to approve before anything publishes.`}
        />

        <ul className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {assistants.map((item) => {
            const logo = previewImage(`agents/${item.logo}.svg`);

            return (
              <li
                key={item.id}
                className="card flex flex-col overflow-hidden rounded-card-lg p-6 sm:p-7"
              >
                <div className="flex items-center gap-3">
                  {logo ? (
                    // The SVGs carry their own tile background, so no wrapper tint.
                    // Plain <img>: a static SVG from /public needs no optimisation pass.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-input shadow-hairline"
                    />
                  ) : (
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-input font-display text-body-sm font-bold shadow-hairline',
                        item.tile === 'light' ? 'bg-white text-[#0e0e0e]' : 'bg-white/10 text-white',
                      )}
                    >
                      {item.via[0]}
                    </span>
                  )}
                  <h3 className="font-display text-heading-sm text-white">Via {item.via}</h3>
                </div>

                <p className="mt-4 text-body-md text-muted">{item.body}</p>

                <div className="mt-6 overflow-hidden rounded-card">
                  <VideoFrame
                    name={item.clip}
                    ratio={item.ratio}
                    label={`${item.via} drafting posts`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
