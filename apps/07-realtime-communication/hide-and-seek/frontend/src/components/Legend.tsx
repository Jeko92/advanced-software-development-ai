import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { DIFFICULTIES, type ItemType, type MatchState } from '@/types';

const ITEM_LEGEND: Record<ItemType, string> = {
  speedBoost: '⚡ Speed',
  freeze: '🥶 Freeze',
  clock: '⏱️ Clock',
};

export function Legend({ match }: { match: MatchState }) {
  const itemTypes = DIFFICULTIES[match.difficulty].itemTypes.filter(
    (type) => type !== 'clock' || match.gameLengthSeconds !== null,
  );

  const entry = (key: string, content: ReactNode) => (
    <li key={key}>
      <Badge variant="outline" className="gap-1.5">
        {content}
      </Badge>
    </li>
  );

  return (
    <ul className="flex max-w-md flex-wrap justify-center gap-1.5">
      {entry('seeker', '🔍 Seeker')}
      {entry('hider', '🙈 Hider')}
      {entry(
        'wall',
        <>
          <span className="h-3 w-1 rounded-sm bg-wall" /> Wall
        </>,
      )}
      {entry(
        'ice',
        <>
          <span className="size-3 rounded-sm bg-ice" /> Ice
        </>,
      )}
      {match.mode === 'classic' && entry('portal', '🌀 Portal')}
      {match.mode === 'classic' &&
        itemTypes.map((type) => entry(type, ITEM_LEGEND[type]))}
    </ul>
  );
}
