import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ConnectionState } from '@/lib/types';

const STATES: Record<
  ConnectionState,
  { label: string; badge: string; dot: string }
> = {
  connecting: {
    label: 'Connecting',
    badge: 'bg-secondary text-secondary-foreground',
    dot: 'bg-muted-foreground animate-pulse',
  },
  live: {
    label: 'Live',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500 animate-pulse',
  },
  reconnecting: {
    label: 'Reconnecting',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500 animate-pulse',
  },
  offline: {
    label: 'Offline',
    badge: 'bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
  },
  closed: {
    label: 'Closed',
    badge: 'border-border bg-transparent text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
};

export function ConnectionBadge({ state }: { state: ConnectionState }) {
  const { label, badge, dot } = STATES[state];

  return (
    <Badge className={badge} aria-live="polite">
      <span className={cn('size-1.5 rounded-full', dot)} aria-hidden />
      {label}
    </Badge>
  );
}
