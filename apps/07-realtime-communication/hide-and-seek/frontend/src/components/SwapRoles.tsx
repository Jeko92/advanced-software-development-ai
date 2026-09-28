import { ArrowLeftRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/store/socketStore';
import type { MatchState } from '@/types';

export function SwapRoles({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const requestSwap = useSocketStore((s) => s.requestSwap);
  const respondToSwap = useSocketStore((s) => s.respondToSwap);

  if (role !== 'seeker' && role !== 'hider') return null;
  const nobodyReady = !match.ready.seeker && !match.ready.hider;
  const canSwap =
    match.status === 'finished' ||
    (match.status === 'ready-check' && nobodyReady);
  if (!canSwap || match.mode === 'coop') return null;

  if (match.swapRequestedBy && match.swapRequestedBy !== role) {
    return (
      <Alert className="text-left">
        <ArrowLeftRight />
        <AlertTitle>Opponent wants to swap roles</AlertTitle>
        <AlertDescription className="flex gap-2 pt-1">
          <Button size="sm" onClick={() => respondToSwap(true)}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => respondToSwap(false)}
          >
            Decline
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const requested = match.swapRequestedBy === role;
  return (
    <Button
      variant="outline"
      className="justify-self-center"
      disabled={requested}
      onClick={requestSwap}
    >
      <ArrowLeftRight />
      {requested ? 'Swap requested…' : 'Swap roles'}
    </Button>
  );
}
