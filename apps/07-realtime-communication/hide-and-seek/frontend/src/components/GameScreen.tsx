import { Grid } from '@/components/Grid';
import { Hud } from '@/components/Hud';
import { GameOverOverlay, WaitingOverlay } from '@/components/Overlays';
import { StartDialog } from '@/components/StartDialog';
import { useMovementKeys } from '@/hooks/useMovementKeys';
import { useSocketStore } from '@/store/socketStore';

export function GameScreen() {
  const match = useSocketStore((s) => s.matchState);
  useMovementKeys();
  if (!match) return null;

  return (
    <section className="grid justify-items-center gap-4">
      <Hud match={match} />
      <div className="relative">
        <Grid match={match} />
        {match.status === 'waiting' && <WaitingOverlay roomId={match.roomId} />}
        {match.status === 'finished' && <GameOverOverlay match={match} />}
      </div>
      <StartDialog match={match} />
    </section>
  );
}
