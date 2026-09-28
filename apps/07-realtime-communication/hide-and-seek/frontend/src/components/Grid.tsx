import type { CSSProperties, ReactElement } from 'react';
import { useSocketStore } from '@/store/socketStore';
import type { ItemType, MatchState, Role } from '@/types';

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
  const own =
    role === 'seeker' || role === 'hider'
      ? match.players[role]?.position
      : undefined;
  const label = own
    ? `Game board, you are at column ${own.x + 1}, row ${own.y + 1}`
    : 'Game board';

  for (let y = 0; y < match.gridSize; y++) {
    for (let x = 0; x < match.gridSize; x++) {
      const classes = ['cell'];
      if (ice.has(`${x},${y}`)) classes.push('ice');
      const portalIndex =
        match.portals?.findIndex((p) => p.x === x && p.y === y) ?? -1;
      if (portalIndex >= 0) {
        classes.push(portalIndex === 0 ? 'portal-a' : 'portal-b');
      }
      const wallRight = walls.has(`${x},${y}-${x + 1},${y}`);
      const wallBottom = walls.has(`${x},${y}-${x},${y + 1}`);
      const item = items.get(`${x},${y}`);
      cells.push(
        <div key={`${x}-${y}`} className={classes.join(' ')}>
          {wallRight && <span className="wall wall-right" />}
          {wallBottom && <span className="wall wall-bottom" />}
          {portalIndex >= 0 && match.teleportCount > 0 && (
            <span
              key={`flash-${match.teleportCount}`}
              className="portal-flash"
            />
          )}
          {item && (
            <span key={item.id} className="item">
              {ITEM_ICON[item.type]}
            </span>
          )}
        </div>,
      );
    }
  }

  return (
    <div
      className={frozen ? 'grid-board frozen' : 'grid-board'}
      style={{ '--grid-size': match.gridSize } as CSSProperties}
      role="img"
      aria-label={label}
    >
      {cells}
      <div className="token-layer" aria-hidden>
        {(['seeker', 'hider'] as const).map((owner) => (
          <PlayerToken
            key={`${owner}-${match.status}-${match.teleportCount}`}
            match={match}
            owner={owner}
            isYou={role === owner}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerToken({
  match,
  owner,
  isYou,
}: {
  match: MatchState;
  owner: Role;
  isYou: boolean;
}) {
  const position = match.players[owner]?.position;
  if (!position) return null;
  const other = match.players[owner === 'seeker' ? 'hider' : 'seeker'];
  const sharesCell =
    owner === 'hider' &&
    other?.position.x === position.x &&
    other?.position.y === position.y;

  return (
    <span
      className={`token player-marker ${owner} ${isYou ? 'you' : ''}`}
      style={
        {
          '--x': position.x + (sharesCell ? 0.35 : 0),
          '--y': position.y,
        } as CSSProperties
      }
    >
      {owner === 'seeker' ? '🔍' : '🙈'}
    </span>
  );
}
