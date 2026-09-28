import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MatchInfo, Pair, StadiumStats } from '@/lib/types';

type StatsPanelProps = {
  info: MatchInfo | null;
  stats: StadiumStats | null;
};

const ROWS: { key: keyof Omit<StadiumStats, 'viewers'>; label: string }[] = [
  { key: 'shots', label: 'Shots' },
  { key: 'shotsOnTarget', label: 'On target' },
  { key: 'corners', label: 'Corners' },
  { key: 'fouls', label: 'Fouls' },
  { key: 'yellowCards', label: 'Yellow cards' },
  { key: 'redCards', label: 'Red cards' },
  { key: 'offsides', label: 'Offsides' },
];

export function StatsPanel({ info, stats }: StatsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Stadium stats
          <span className="text-xs font-normal text-muted-foreground">
            👀 {stats?.viewers ?? 0} watching now
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>{info?.home.abbreviation ?? 'HOME'}</span>
          <span>{info?.away.abbreviation ?? 'AWAY'}</span>
        </div>
        {ROWS.map((row) => (
          <StatRow
            key={row.key}
            label={row.label}
            pair={stats?.[row.key] ?? { home: 0, away: 0 }}
          />
        ))}
        {info?.attendance && (
          <p className="pt-1 text-xs text-muted-foreground">
            Attendance: {info.attendance.toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({ label, pair }: { label: string; pair: Pair }) {
  const total = pair.home + pair.away;
  const homeShare = total === 0 ? 50 : (pair.home / total) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm tabular-nums">
        <span>{pair.home}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span>{pair.away}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-primary transition-all duration-500"
          style={{ width: `${homeShare}%` }}
        />
        <div className="flex-1 bg-muted-foreground/30" />
      </div>
    </div>
  );
}
