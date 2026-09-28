import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
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
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
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

  let title: string;
  if (isPlayer) {
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
              isPlayer && (won ? 'text-success' : 'text-destructive'),
            )}
          >
            {title}
          </CardTitle>
          {match.endReason && (
            <CardDescription>{REASON_TEXT[match.endReason]}</CardDescription>
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
