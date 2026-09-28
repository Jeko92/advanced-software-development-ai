import { useSocketStore } from '@/store/socketStore';
import type { ClientRole, MatchState } from '@/types';

function announcement(match: MatchState, role: ClientRole | null) {
  const isPlayer = role === 'seeker' || role === 'hider';
  switch (match.status) {
    case 'waiting':
      return 'Waiting for a hider to join.';
    case 'ready-check':
      return `Ready check. Seeker ${match.ready.seeker ? 'ready' : 'not ready'}, hider ${match.ready.hider ? 'ready' : 'not ready'}.`;
    case 'countdown':
      return 'Round starting.';
    case 'paused':
      return 'Game paused.';
    case 'finished': {
      if (match.mode === 'coop') {
        return match.winner === 'team'
          ? 'The players found each other.'
          : 'Time ran out before the players met.';
      }
      const reason =
        match.endReason === 'caught'
          ? 'The seeker found the hider.'
          : 'Time ran out.';
      if (!isPlayer) {
        return `${match.winner === 'seeker' ? 'Seeker' : 'Hider'} wins. ${reason}`;
      }
      return `${match.winner === role ? 'You win.' : 'You lose.'} ${reason}`;
    }
    case 'running':
      if (isPlayer && match.effects[role]?.type === 'frozen') {
        return 'You are frozen.';
      }
      if (
        isPlayer &&
        match.pauseRequestedBy &&
        match.pauseRequestedBy !== role
      ) {
        return 'Your opponent wants to pause.';
      }
      return 'Round in progress.';
  }
}

export function Announcer({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  return (
    <div className="sr-only" aria-live="polite">
      {announcement(match, role)}
    </div>
  );
}
