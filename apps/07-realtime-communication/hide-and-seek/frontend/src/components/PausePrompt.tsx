import { Pause } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/store/socketStore';
import type { MatchState } from '@/types';

export function PausePrompt({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const respondToPause = useSocketStore((s) => s.respondToPause);

  if (role !== 'seeker' && role !== 'hider') return null;
  if (!match.pauseRequestedBy || match.pauseRequestedBy === role) return null;

  return (
    <Alert className="w-full max-w-2xl">
      <Pause />
      <AlertTitle>Opponent wants to pause</AlertTitle>
      <AlertDescription className="flex gap-2 pt-1">
        <Button size="sm" onClick={() => respondToPause(true)}>
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => respondToPause(false)}
        >
          Decline
        </Button>
      </AlertDescription>
    </Alert>
  );
}
