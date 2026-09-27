import { useEffect } from 'react';
import './App.css';
import { socket } from './socket.ts';
import { useSocketStore } from './store/socketStore.ts';
import { Grid } from './components/Grid.tsx';

function App() {
  const connected = useSocketStore((s) => s.connected);
  const role = useSocketStore((s) => s.role);
  const matchState = useSocketStore((s) => s.matchState);
  const move = useSocketStore((s) => s.move);
  const playAgain = useSocketStore((s) => s.playAgain);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (useSocketStore.getState().matchState?.status !== 'running') return;

      const map: Record<string, string> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = map[e.key];
      if (direction) move(direction);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);

  const opponentLeft =
    !!matchState && (!matchState.players.seeker || !matchState.players.hider);

  return (
    <div>
      <h1>Hide and Seek</h1>
      <p>{connected ? 'Connected' : 'Connecting...'}</p>
      <p>{role ? `You are the ${role}` : 'Assigning role...'}</p>
      {matchState && <p>Room: {matchState.roomId.replace('room-', '')}</p>}
      {matchState?.status === 'waiting' && <p>Waiting for an opponent...</p>}
      {matchState?.status === 'finished' && (
        <div>
          <p>
            {matchState.winner === 'seeker' ? 'Seeker wins!' : 'Hider wins!'}
          </p>
          {opponentLeft && <p>Your opponent left the game.</p>}
          <button onClick={playAgain}>
            {opponentLeft ? 'Find New Opponent' : 'Play Again'}
          </button>
        </div>
      )}
      {matchState && (
        <>
          <p>Time left: {matchState.timeRemaining}s</p>
          <Grid match={matchState} />
        </>
      )}
    </div>
  );
}

export default App;
