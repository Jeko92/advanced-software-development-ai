import type { ReactNode } from 'react';
import { Loader2, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SwapRoles } from '@/components/SwapRoles';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';
import type { EndReason, MatchState } from '@/types';

const REASON_TEXT: Record<EndReason, string> = {
  caught: 'The seeker found the hider.',
  timeout: 'Time ran out — the hider stayed hidden.',
  met: 'The players met in the maze.',
};

export function BoardOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-lg bg-background/70 p-4 backdrop-blur-[2px]">
      {children}
    </div>
  );
}

export function WaitingOverlay({ roomId }: { roomId: string }) {
  return (
    <BoardOverlay>
      <Card className="w-full max-w-xs text-center">
        <CardHeader className="justify-items-center">
          <Loader2 className="size-6 motion-safe:animate-spin text-muted-foreground" />
          <CardTitle>Waiting for a hider…</CardTitle>
          <CardDescription>
            Share the room name <strong>{roomId}</strong> — it's listed in the
            lobby.
          </CardDescription>
        </CardHeader>
      </Card>
    </BoardOverlay>
  );
}

export function GameOverOverlay({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const ready = useSocketStore((s) => s.ready);
  const leaveRoom = useSocketStore((s) => s.leaveRoom);
  const isPlayer = role === 'seeker' || role === 'hider';
  const won = isPlayer && match.winner === role;

  const coopWon = match.mode === 'coop' && match.winner === 'team';
  let title: string;
  if (match.mode === 'coop') {
    if (isPlayer) {
      title = coopWon
        ? 'You found each other! 🎉'
        : "Time's up — you didn't meet";
    } else {
      title = coopWon ? 'They found each other!' : "They didn't meet";
    }
  } else if (isPlayer) {
    title = won ? 'You win! 🎉' : 'You lose';
  } else {
    title = match.winner === 'seeker' ? 'Seeker wins!' : 'Hider wins!';
  }

  return (
    <BoardOverlay>
      <Card className="w-full max-w-xs text-center">
        <CardHeader>
          <CardTitle
            className={cn(
              'text-2xl',
              isPlayer &&
                (won || coopWon ? 'text-success' : 'text-destructive'),
            )}
          >
            {title}
          </CardTitle>
          {match.endReason && (
            <CardDescription>
              {match.mode === 'coop' && match.endReason === 'timeout'
                ? 'Time ran out before you met.'
                : REASON_TEXT[match.endReason]}
            </CardDescription>
          )}
        </CardHeader>
        {isPlayer && (
          <CardContent className="grid">
            <SwapRoles match={match} />
          </CardContent>
        )}
        <CardFooter className="justify-center gap-2">
          {isPlayer && (
            <Button autoFocus onClick={ready}>
              Play again
            </Button>
          )}
          <Button variant="outline" onClick={leaveRoom}>
            Back to lobby
          </Button>
        </CardFooter>
      </Card>
    </BoardOverlay>
  );
}

export function PausedOverlay({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const resumeMatch = useSocketStore((s) => s.resumeMatch);
  const isPlayer = role === 'seeker' || role === 'hider';
  const imReady = isPlayer && match.ready[role];

  return (
    <BoardOverlay>
      <Card className="w-full max-w-xs text-center">
        <CardHeader>
          <CardTitle className="text-2xl">⏸ Paused</CardTitle>
          <CardDescription>
            The round continues with a 3-2-1 once both players are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-2">
          <Badge variant={match.ready.seeker ? 'default' : 'outline'}>
            🔍 Seeker {match.ready.seeker ? '✓' : '…'}
          </Badge>
          <Badge variant={match.ready.hider ? 'default' : 'outline'}>
            🙈 Hider {match.ready.hider ? '✓' : '…'}
          </Badge>
        </CardContent>
        {isPlayer && (
          <CardFooter className="justify-center">
            <Button autoFocus disabled={imReady} onClick={resumeMatch}>
              <Play /> {imReady ? 'Waiting for opponent…' : 'Ready to resume'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </BoardOverlay>
  );
}
