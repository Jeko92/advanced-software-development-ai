import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Channel, ConnectionState } from '@/hooks/use-match-stream';

type StreamPanelProps = {
  connectionState: ConnectionState;
  connections: number;
  received: Record<Channel, number>;
  lastEventId: number | null;
  onReconnect: () => void;
  onSimulateDrop: () => void;
};

export function StreamPanel({
  connectionState,
  connections,
  received,
  lastEventId,
  onReconnect,
  onSimulateDrop,
}: StreamPanelProps) {
  const rows = [
    ['Connections opened', connections],
    ['Via onmessage', received.message],
    ['Via named listeners', received.named],
    ['Last event id', lastEventId ?? '—'],
  ] as const;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Stream</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onSimulateDrop}
            disabled={connectionState !== 'live'}
          >
            Simulate network drop
          </Button>
          {connectionState === 'offline' && (
            <Button size="sm" onClick={onReconnect}>
              Reconnect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
