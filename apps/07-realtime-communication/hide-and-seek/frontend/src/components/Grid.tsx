import type { MatchState } from '../types.ts';
import type { CSSProperties, ReactElement } from 'react';

export function Grid({ match }: { match: MatchState }) {
  const cells: ReactElement[] = [];
  for (let y = 0; y < match.gridSize; y++) {
    for (let x = 0; x < match.gridSize; x++) {
      const isSeeker =
        match.players.seeker?.position.x === x &&
        match.players.seeker?.position.y === y;
      const isHider =
        match.players.hider?.position.x === x &&
        match.players.hider?.position.y === y;
      cells.push(
        <div key={`${x}-${y}`} className="cell">
          {isSeeker ? 'S' : isHider ? 'H' : ''}
        </div>,
      );
    }
  }

  return (
    <div
      className="grid-board"
      style={{ '--grid-size': match.gridSize } as CSSProperties}
    >
      {cells}
    </div>
  );
}
