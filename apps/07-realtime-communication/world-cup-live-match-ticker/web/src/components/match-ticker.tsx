'use client';

import Link from 'next/link';
import { CommentaryFeed } from '@/components/commentary-feed';
import { Scoreboard } from '@/components/scoreboard';
import { StatsPanel } from '@/components/stats-panel';
import { StreamPanel } from '@/components/stream-panel';
import { useMatchStream } from '@/hooks/use-match-stream';

export function MatchTicker({ matchId }: { matchId: string }) {
  const match = useMatchStream(matchId);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4 font-sans sm:p-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="w-fit text-sm text-muted-foreground hover:text-foreground"
        >
          ← All matches
        </Link>
        <h1 className="text-2xl font-semibold">World Cup Live Match Ticker</h1>
      </div>

      <Scoreboard
        info={match.info}
        score={match.score}
        connectionState={match.connectionState}
      />

      <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
        <CommentaryFeed info={match.info} items={match.commentary} />
        <div className="flex flex-col gap-4">
          <StatsPanel info={match.info} stats={match.stats} />
          <StreamPanel
            connectionState={match.connectionState}
            connections={match.connections}
            received={match.received}
            lastEventId={match.lastEventId}
            onReconnect={match.reconnect}
            onSimulateDrop={match.simulateNetworkDrop}
          />
        </div>
      </div>
    </main>
  );
}
