import { Announcer } from '@/components/Announcer';
import { ChatPanel } from '@/components/ChatPanel';
import { CheerLayer } from '@/components/CheerLayer';
import { DPad } from '@/components/DPad';
import { Grid } from '@/components/Grid';
import { Hud } from '@/components/Hud';
import { Legend } from '@/components/Legend';
import {
  GameOverOverlay,
  PausedOverlay,
  WaitingOverlay,
} from '@/components/Overlays';
import { PausePrompt } from '@/components/PausePrompt';
import { StartDialog } from '@/components/StartDialog';
import { useMovementKeys } from '@/hooks/useMovementKeys';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';

export function GameScreen() {
  const match = useSocketStore((s) => s.matchState);
  useMovementKeys();
  if (!match) return null;
  const lastSeconds =
    match.status === 'running' &&
    match.timeRemaining !== null &&
    match.timeRemaining <= 5;

  return (
    <section className="grid justify-items-center gap-4">
      <Hud match={match} />
      <PausePrompt match={match} />
      <div className="grid w-full justify-items-center gap-4 lg:grid-cols-[1fr_18rem] lg:items-start">
        <div className="grid justify-items-center gap-3">
          <div
            className={cn(
              'relative rounded-lg',
              lastSeconds &&
                'ring-3 ring-destructive motion-safe:animate-pulse',
            )}
          >
            <Grid match={match} />
            {match.status === 'waiting' && (
              <WaitingOverlay roomId={match.roomId} />
            )}
            {match.status === 'finished' && <GameOverOverlay match={match} />}
            {match.status === 'paused' && <PausedOverlay match={match} />}
            <CheerLayer />
          </div>
          <DPad />
          <Legend match={match} />
        </div>
        <ChatPanel />
      </div>
      <StartDialog match={match} />
      <Announcer match={match} />
    </section>
  );
}
