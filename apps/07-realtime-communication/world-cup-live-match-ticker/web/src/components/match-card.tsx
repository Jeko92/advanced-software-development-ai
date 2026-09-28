import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MatchSummary, Team } from '@/lib/types';

export function MatchCard({ match }: { match: MatchSummary }) {
  const { info, score, clock, viewers } = match;
  const isFullTime = clock === 'FT';
  const round = info.title.replace(/^2026 FIFA World Cup,\s*/, '');

  return (
    <Link
      href={`/matches/${info.matchId}`}
      className="group rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="h-full transition-colors group-hover:bg-muted/40">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{round}</span>
            <Badge
              className={cn(
                'tabular-nums',
                isFullTime
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
              )}
            >
              {!isFullTime && (
                <span
                  className="size-1.5 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden
                />
              )}
              {isFullTime ? 'Full time' : `Live ${clock}`}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <TeamRow team={info.home} goals={score.home} />
            <TeamRow team={info.away} goals={score.away} />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{info.venue}</span>
            <span>👀 {viewers}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TeamRow({ team, goals }: { team: Team; goals: number }) {
  return (
    <div className="flex items-center gap-3">
      {team.logo && (
        <Image
          src={team.logo}
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
        />
      )}
      <span className="flex-1 font-medium">{team.name}</span>
      <span
        key={goals}
        className="animate-in text-xl font-bold tabular-nums duration-500 zoom-in-90"
      >
        {goals}
      </span>
    </div>
  );
}
