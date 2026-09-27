import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import './App.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid } from '@/components/Grid';
import { Lobby } from '@/components/Lobby';
import { socket } from '@/socket';
import { useSocketStore } from '@/store/socketStore';
import type { ClientRole, EndReason, MatchState } from '@/types';

const KEY_TO_DIRECTION: Record<string, string> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

const REASON_TEXT: Record<EndReason, string> = {
  caught: 'The seeker found the hider.',
  timeout: 'Time ran out — the hider stayed hidden.',
};

function resultTitle(role: ClientRole, match: MatchState) {
  if (role === 'observer') {
    return match.winner === 'seeker' ? 'Seeker wins!' : 'Hider wins!';
  }
  return match.winner === role ? 'You win! 🎉' : 'You lose';
}

const ROLE_LABEL: Record<ClientRole, string> = {
  seeker: '🔍 You are the seeker',
  hider: '🙈 You are the hider',
  observer: '👀 Watching',
};

function App() {
  const connected = useSocketStore((s) => s.connected);
  const role = useSocketStore((s) => s.role);
  const matchState = useSocketStore((s) => s.matchState);
  const move = useSocketStore((s) => s.move);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }
      const { role, matchState } = useSocketStore.getState();
      if (role === 'observer' || matchState?.status !== 'running') return;

      const direction = KEY_TO_DIRECTION[e.key];
      if (direction) move(direction);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Hide and Seek</h1>
        <Badge variant="outline">
          {connected ? 'Connected' : 'Connecting…'}
        </Badge>
      </header>
      {role ? <GameView role={role} matchState={matchState} /> : <Lobby />}
    </main>
  );
}

function GameView({
  role,
  matchState,
}: {
  role: ClientRole;
  matchState: MatchState | null;
}) {
  const playAgain = useSocketStore((s) => s.playAgain);
  const leaveRoom = useSocketStore((s) => s.leaveRoom);
  const isPlayer = role !== 'observer';

  return (
    <section className="grid justify-items-center gap-4">
      <div className="flex w-full flex-wrap items-center gap-2">
        <Badge variant="secondary">{ROLE_LABEL[role]}</Badge>
        {matchState && (
          <Badge variant="outline">Room: {matchState.roomId}</Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={leaveRoom}
        >
          <LogOut /> Leave
        </Button>
      </div>

      {matchState?.status === 'waiting' && (
        <p className="text-muted-foreground">Waiting for a hider to join…</p>
      )}

      {matchState?.status === 'finished' && (
        <div className="grid justify-items-center gap-3">
          <p className="text-xl font-semibold">
            {resultTitle(role, matchState)}
          </p>
          {matchState.endReason && (
            <p className="text-muted-foreground">
              {REASON_TEXT[matchState.endReason]}
            </p>
          )}
          <div className="flex gap-2">
            {isPlayer && <Button onClick={playAgain}>Play again</Button>}
            <Button variant="outline" onClick={leaveRoom}>
              Back to lobby
            </Button>
          </div>
        </div>
      )}

      {matchState && (
        <>
          <p className="tabular-nums">Time left: {matchState.timeRemaining}s</p>
          <Grid match={matchState} />
        </>
      )}
    </section>
  );
}

export default App;
