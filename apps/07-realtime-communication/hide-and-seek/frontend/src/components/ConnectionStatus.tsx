import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';

export function ConnectionStatus() {
  const connected = useSocketStore((s) => s.connected);

  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        className={cn(
          'size-2 rounded-full',
          connected ? 'bg-success' : 'motion-safe:animate-pulse bg-destructive',
        )}
      />
      {connected ? 'Connected' : 'Reconnecting…'}
    </Badge>
  );
}
