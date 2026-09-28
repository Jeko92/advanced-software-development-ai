import type { CSSProperties, ReactElement } from 'react';
import { useSocketStore } from '@/store/socketStore';
import type { ItemType, MatchState, Position, Role } from '@/types';

const ITEM_ICON: Record<ItemType, string> = {
  speedBoost: '⚡',
  freeze: '🥶',
  clock: '⏱️',
};

export function Grid({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role);
  const walls = new Set(match.wallEdges);
  const ice = new Set(match.iceCells.map((c) => `${c.x},${c.y}`));
  const items = new Map(
    match.items.map((i) => [`${i.position.x},${i.position.y}`, i]),
  );
  const frozen =
    (role === 'seeker' || role === 'hider') &&
    match.effects[role]?.type === 'frozen';
  const cells: ReactElement[] = [];

  for (let y = 0; y < match.gridSize; y++) {
    for (let x = 0; x < match.gridSize; x++) {
      const at = (p?: Position) => p?.x === x && p?.y === y;
      const classes = ['cell'];
      if (ice.has(`${x},${y}`)) classes.push('ice');
      const wallRight = walls.has(`${x},${y}-${x + 1},${y}`);
      const wallBottom = walls.has(`${x},${y}-${x},${y + 1}`);
      const item = items.get(`${x},${y}`);
      cells.push(
        <div key={`${x}-${y}`} className={classes.join(' ')}>
          {wallRight && <span className="wall wall-right" />}
          {wallBottom && <span className="wall wall-bottom" />}
          {item && (
            <span key={item.id} className="item">
              {ITEM_ICON[item.type]}
            </span>
          )}
          {at(match.players.seeker?.position) && (
            <PlayerMarker role="seeker" isYou={role === 'seeker'} />
          )}
          {at(match.players.hider?.position) && (
            <PlayerMarker role="hider" isYou={role === 'hider'} />
          )}
        </div>,
      );
    }
  }

  return (
    <div
      className={frozen ? 'grid-board frozen' : 'grid-board'}
      style={{ '--grid-size': match.gridSize } as CSSProperties}
      aria-label="Game board"
    >
      {cells}
    </div>
  );
}

function PlayerMarker({ role, isYou }: { role: Role; isYou: boolean }) {
  return (
    <span className={`player-marker ${role} ${isYou ? 'you' : ''}`}>
      {role === 'seeker' ? '🔍' : '🙈'}
    </span>
  );
}
