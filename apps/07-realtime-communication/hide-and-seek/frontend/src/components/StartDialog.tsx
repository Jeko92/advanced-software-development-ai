import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SwapRoles } from '@/components/SwapRoles';
import { useSocketStore } from '@/store/socketStore';
import type { MatchState } from '@/types';

export function StartDialog({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const ready = useSocketStore((s) => s.ready);
  const isPlayer = role === 'seeker' || role === 'hider';
  const counting = match.status === 'countdown';
  const imReady = isPlayer && match.ready[role];

  return (
    <AlertDialog open={match.status === 'ready-check' || counting}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {counting ? 'Get ready!' : 'Ready?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {counting
              ? 'The round starts in…'
              : 'The countdown starts once both players are ready.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {counting ? (
          <span
            key={match.countdown}
            className="countdown-number"
            aria-live="assertive"
          >
            {match.countdown}
          </span>
        ) : (
          <div className="flex justify-center gap-2">
            <Badge variant={match.ready.seeker ? 'default' : 'outline'}>
              🔍 Seeker {match.ready.seeker ? '✓' : '…'}
            </Badge>
            <Badge variant={match.ready.hider ? 'default' : 'outline'}>
              🙈 Hider {match.ready.hider ? '✓' : '…'}
            </Badge>
          </div>
        )}

        {!counting && <SwapRoles match={match} />}

        {!counting && (
          <AlertDialogFooter>
            {isPlayer ? (
              <Button onClick={ready} disabled={imReady}>
                {imReady ? 'Waiting for opponent…' : "I'm ready"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Waiting for both players to get ready.
              </p>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
