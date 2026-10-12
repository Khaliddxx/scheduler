import { Section } from '@/components/ui/section';
import { ChannelIcon } from '@/components/ui/channel-icon';
import { proofStats, statChannel, statsArePlaceholder, type ProofStat } from '@/content/proof-stats';
import { cn } from '@/lib/cn';

/**
 * Two bands of outcome cards drifting in opposite directions.
 *
 * Opposing directions matter: two rows travelling the same way read as one
 * sheet sliding, which the eye tunes out. Counter-motion keeps the band alive
 * at the edge of vision without demanding attention.
 *
 * Each row is rendered twice and the track translates -50%, which is what
 * makes the loop seamless — the second copy is `aria-hidden` so a screen
 * reader hears each card once.
 */

function StatCard({ stat }: { stat: ProofStat }) {
  const channel = statChannel(stat.channel);

  return (
    <li
      className={cn(
        'flex w-[230px] shrink-0 flex-col justify-between gap-4 rounded-card p-5',
        'bg-gradient-to-br shadow-hairline',
        stat.tone,
      )}
    >
      <div>
        <p className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-white">
          {stat.value}
        </p>
        <p className="mt-1.5 text-body-sm leading-snug text-white/80">{stat.label}</p>
      </div>

      <div className="flex items-center gap-2">
        {channel ? <ChannelIcon channel={channel} size={22} /> : null}
        <span className="truncate text-body-xs text-white/70">{stat.name}</span>
      </div>
    </li>
  );
}

function Row({
  stats,
  reverse,
}: {
  stats: ProofStat[];
  reverse?: boolean;
}) {
  const cards = stats.map((s) => <StatCard key={s.value + s.name} stat={s} />);

  return (
    <div className="mask-x w-full overflow-hidden">
      <div
        className={cn(
          'marquee-track flex w-max gap-3',
          reverse ? 'animate-marquee-slow [animation-direction:reverse]' : 'animate-marquee-slow',
        )}
      >
        <ul className="flex shrink-0 gap-3">{cards}</ul>
        <ul aria-hidden className="flex shrink-0 gap-3">
          {cards}
        </ul>
      </div>
    </div>
  );
}

export function StatMarquee() {
  const half = Math.ceil(proofStats.length / 2);

  return (
    <Section tight className="overflow-hidden">
      <div className="shell">
        <p className="text-center text-body-md text-muted">
          What a week looks like once it is all in one calendar
        </p>

        {statsArePlaceholder ? (
          <p className="mt-2 text-center text-body-xs text-dim">
            Illustrative figures — replaced with measured results before launch.
          </p>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <Row stats={proofStats.slice(0, half)} />
        <Row stats={proofStats.slice(half)} reverse />
      </div>
    </Section>
  );
}
