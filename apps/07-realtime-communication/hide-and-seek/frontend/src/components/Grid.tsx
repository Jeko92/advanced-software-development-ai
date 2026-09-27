import { GRID_SIZE, type MatchState } from '../types.ts';
import type { ReactElement } from 'react';

export function Grid({ match }: { match: MatchState }) {
  const cells: ReactElement[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
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

  return <div className="grid">{cells}</div>;
}
