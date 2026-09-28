import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ConnectionBadge } from '@/components/connection-badge';
import { cn } from '@/lib/utils';
import {
  STAGES,
  STAGE_LABELS,
  type ConnectionState,
  type OrderSnapshot,
} from '@/lib/types';

type OrderStatusCardProps = {
  order: OrderSnapshot;
  note?: string | undefined;
  /** Only the SSE page has a persistent connection to show. */
  connectionState?: ConnectionState | undefined;
};

export function OrderStatusCard({
  order,
  note,
  connectionState,
}: OrderStatusCardProps) {
  const progressValue = (order.stageIndex / (STAGES.length - 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Order status
          <Badge variant={order.isFinal ? 'default' : 'secondary'}>
            {STAGE_LABELS[order.status]}
          </Badge>
          {connectionState && (
            <span className="ml-auto">
              <ConnectionBadge state={connectionState} />
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, index) => (
            <div
              key={stage}
              className="flex flex-1 flex-col items-center gap-1 text-center"
            >
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border text-xs font-medium',
                  index <= order.stageIndex
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs text-muted-foreground">
                {STAGE_LABELS[stage]}
              </span>
            </div>
          ))}
        </div>

        <Progress value={progressValue} />

        {note && <p className="text-sm text-muted-foreground">{note}</p>}
      </CardContent>
    </Card>
  );
}
