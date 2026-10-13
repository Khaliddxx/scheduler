import type { CSSProperties } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { proofRows, type ProofStat } from '@/content/proof-stats';
import { cn } from '@/lib/cn';

/**
 * The band under the hero: a one-line heading over two rows of gradient cards
 * drifting in opposite directions (the reference design's "trusted by" block).
 *
 * The rows reproduce the reference's marquee exactly, but in CSS and rendered
 * on the server rather than measured on the client:
 *   - 50px per second, linear, forever. A row's period is one copy of its
 *     cards plus the trailing gap, so the duration is that width / 50:
 *     n x (160 + 4) px on phones and n x (270 + 12) px from `sm`.
 *   - Top row travels right, bottom row left.
 *   - Hovering a row pauses it.
 *   - A 120px fade from the page colour (#0E0E0E) at both ends.
 * Each row is rendered twice and the track translates -50%, which is what makes
 * the loop seamless; the second copy is `aria-hidden` so a screen reader hears
 * each card once. Reduced motion: the rows stand still.
 *
 * The cards say what each network can be sent from the calendar rather than
 * quoting customers we do not have yet (see content/proof-stats.ts).
 */

function StatCard({ stat }: { stat: ProofStat }) {
  return (
    <li
      className="w-[160px] shrink-0 space-y-2 rounded-[12px] bg-[#3E30D8] p-3 sm:w-[270px] sm:space-y-[14px] sm:rounded-[20px] sm:p-6"
      style={{ background: `linear-gradient(to left, ${stat.from}, ${stat.to})` }}
    >
      <div className="space-y-0 sm:space-y-[2px]">
        <p className="font-jakarta text-[20px] font-[700] leading-[22px] sm:text-[34px] sm:leading-[37.4px]">
          {stat.value}
        </p>
        <p className="line-clamp-1 text-[12px] leading-[15.62px] sm:text-[18px] sm:leading-[23.4px]">
          {stat.label}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* The name sits right next to the mark, so the mark itself is decorative. */}
        <span aria-hidden className="flex shrink-0">
          <SocialIcon channel={stat.channel} className="h-3 w-3 sm:h-6 sm:w-6" />
        </span>
        <p className="text-[8px] leading-[9.6px] sm:text-[16px] sm:leading-[19.2px]">
          {stat.channel.name}
        </p>
      </div>
    </li>
  );
}

function MarqueeRow({ stats, toRight }: { stats: ProofStat[]; toRight: boolean }) {
  // The reference puts the inter-copy gap after the cards on the rightward row
  // and before them on the leftward one.
  const copy = cn('flex shrink-0 gap-1 sm:gap-3', toRight ? 'mr-1 sm:mr-3' : 'ml-1 sm:ml-3');
  const cards = stats.map((s) => <StatCard key={s.channel.slug + s.value} stat={s} />);

  return (
    <div className="group relative flex w-full overflow-x-hidden">
      {/* Edge fades, above the cards. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute left-0 top-0 h-full w-[120px] bg-[linear-gradient(to_right,#0E0E0E,rgba(255,255,255,0))]" />
        <div className="absolute right-0 top-0 h-full w-[120px] rotate-180 bg-[linear-gradient(to_right,#0E0E0E,rgba(255,255,255,0))]" />
      </div>

      <div
        className={cn(
          'z-[1] flex w-max shrink-0 items-center',
          'animate-[marqueeX_40s_linear_infinite] ![animation-duration:var(--mq)]',
          '[--mq:calc(var(--n)*3.28s)] sm:[--mq:calc(var(--n)*5.64s)]',
          toRight && '[animation-direction:reverse]',
          'group-hover:[animation-play-state:paused] motion-reduce:animate-none',
        )}
        style={{ '--n': stats.length } as CSSProperties}
      >
        <ul className={copy}>{cards}</ul>
        <ul aria-hidden className={copy}>
          {cards}
        </ul>
      </div>
    </div>
  );
}

export function StatMarquee() {
  return (
    <section className="section-pz max-w-[1440px] space-y-[40px] !px-0 text-white sm:space-y-[60px]">
      <h2 className="text-center font-jakarta text-[22px] font-[700] leading-[24.2px] sm:text-[34px] sm:leading-[37.4px]">
        Built for the way each network likes to post
      </h2>
      <div className="w-full max-w-full space-y-1 sm:space-y-3">
        {proofRows.map((row, i) => (
          <MarqueeRow key={i} stats={row} toRight={i === 0} />
        ))}
      </div>
    </section>
  );
}
