import type { CSSProperties } from 'react';
import { initials } from '@/lib/initials';
import { useSocketStore } from '@/store/socketStore';

function laneFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return 8 + (hash % 80);
}

export function CheerLayer() {
  const cheers = useSocketStore((s) => s.cheers);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-lg"
      aria-hidden
    >
      {cheers.map((cheer) => (
        <span
          key={cheer.id}
          className="cheer"
          style={{ '--lane': `${laneFor(cheer.id)}%` } as CSSProperties}
        >
          <span className="text-3xl">{cheer.emoji}</span>
          <span className="rounded-full bg-observer px-1.5 text-[0.6rem] font-semibold text-white">
            {initials(cheer.name)}
          </span>
        </span>
      ))}
    </div>
  );
}
