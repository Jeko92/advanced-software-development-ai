import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { classifyResponses, type ResponseKind } from '@/lib/response-stats';
import type { PollResponse } from '@/lib/types';

type NetworkStatsCardProps = {
  requestCount: number;
  history: PollResponse[];
  requestLabel?: string;
};

const KIND_STYLES: Record<ResponseKind, string> = {
  changed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  unchanged: 'bg-destructive/20 text-destructive',
  empty: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
};

export function NetworkStatsCard({
  requestCount,
  history,
  requestLabel = 'Requests sent',
}: NetworkStatsCardProps) {
  const kinds = classifyResponses(history);
  const changed = kinds.filter((kind) => kind === 'changed').length;
  const unchanged = kinds.filter((kind) => kind === 'unchanged').length;
  const empty = kinds.filter((kind) => kind === 'empty').length;
  const wasted = unchanged + empty;
  const wastedPercent =
    history.length === 0 ? 0 : Math.round((wasted / history.length) * 100);

  const stats = [
    { label: requestLabel, value: requestCount, className: 'text-foreground' },
    {
      label: 'New info',
      value: changed,
      className: 'text-emerald-700 dark:text-emerald-400',
    },
    { label: 'Same info', value: unchanged, className: 'text-destructive' },
    {
      label: 'Empty (204)',
      value: empty,
      className: 'text-amber-700 dark:text-amber-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network traffic</CardTitle>
        <CardDescription>
          {wasted} of {history.length} responses told the client nothing new (
          {wastedPercent}% wasted).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-muted/50 p-2 text-center"
            >
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd
                className={cn(
                  'text-xl font-semibold tabular-nums',
                  stat.className,
                )}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="mb-1 text-xs text-muted-foreground">
            Every response received, in order (number = stageIndex). Green = new
            stage, red = same stage as before, amber = empty 204.
          </p>
          <div className="grid grid-cols-8 gap-1">
            {history.map((value, index) => (
              <div
                key={index}
                title={kinds[index]}
                className={cn(
                  'rounded-sm py-1 text-center text-xs tabular-nums',
                  KIND_STYLES[kinds[index] ?? 'changed'],
                )}
              >
                {value ?? '204'}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
