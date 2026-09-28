import { ChatPanel } from '@/components/ChatPanel';
import { Grid } from '@/components/Grid';
import { Hud } from '@/components/Hud';
import {
  GameOverOverlay,
  PausedOverlay,
  WaitingOverlay,
} from '@/components/Overlays';
import { PausePrompt } from '@/components/PausePrompt';
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
      <PausePrompt match={match} />
      <div className="grid w-full justify-items-center gap-4 lg:grid-cols-[1fr_18rem] lg:items-start">
        <div className="relative">
          <Grid match={match} />
          {match.status === 'waiting' && (
            <WaitingOverlay roomId={match.roomId} />
          )}
          {match.status === 'finished' && <GameOverOverlay match={match} />}
          {match.status === 'paused' && <PausedOverlay />}
        </div>
        <ChatPanel />
      </div>
      <StartDialog match={match} />
    </section>
  );
}
