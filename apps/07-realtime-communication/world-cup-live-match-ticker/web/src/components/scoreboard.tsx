import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectionBadge } from '@/components/connection-badge';
import { cn } from '@/lib/utils';
import type { ConnectionState } from '@/hooks/use-match-stream';
import type { MatchInfo, ScoreUpdate, Team } from '@/lib/types';

type ScoreboardProps = {
  info: MatchInfo | null;
  score: ScoreUpdate | null;
  connectionState: ConnectionState;
};

export function Scoreboard({ info, score, connectionState }: ScoreboardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {info ? `${info.title} · ${info.venue}` : 'Loading match…'}
          </span>
          <ConnectionBadge state={connectionState} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <TeamLabel team={info?.home} align="end" />
          <div
            key={`${score?.home}-${score?.away}`}
            className="animate-in rounded-lg bg-muted px-4 py-2 text-center text-4xl font-bold tabular-nums duration-500 zoom-in-90"
          >
            {score ? `${score.home} – ${score.away}` : '– –'}
          </div>
          <TeamLabel team={info?.away} align="start" />
        </div>

        <p className="min-h-5 text-center text-sm text-muted-foreground">
          {score?.side ? `⚽ ${score.minute} ${score.text}` : score?.text}
        </p>

        {info && (
          <p className="text-center text-xs text-muted-foreground">
            Replay of the real match ({new Date(info.kickoff).toDateString()},
            data: {info.source})
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function TeamLabel({
  team,
  align,
}: {
  team: Team | undefined;
  align: 'start' | 'end';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        align === 'end' ? 'flex-row-reverse text-right' : 'text-left',
      )}
    >
      {team?.logo && (
        <Image
          src={team.logo}
          alt=""
          width={40}
          height={40}
          className="size-10 object-contain"
        />
      )}
      <div>
        <div className="text-lg font-semibold">{team?.name ?? '…'}</div>
        <div className="text-xs text-muted-foreground">
          {team?.abbreviation}
        </div>
      </div>
    </div>
  );
}
