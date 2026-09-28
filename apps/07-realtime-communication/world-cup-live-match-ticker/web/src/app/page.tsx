'use client';

import { useEffect, useState } from 'react';
import { MatchCard } from '@/components/match-card';
import type { MatchSummary } from '@/lib/types';

// Polling, not SSE: 8 streams would hit the browser's ~6-connections-per-host limit.
const POLL_INTERVAL_MS = 3_000;

async function fetchMatches(): Promise<MatchSummary[] | null> {
  try {
    const res = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL']}/api/matches`,
    );
    return res.ok ? ((await res.json()) as MatchSummary[]) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [matches, setMatches] = useState<MatchSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const data = await fetchMatches();
      if (cancelled) return;
      if (data) setMatches(data);
      setError(data === null);
    };

    void load();
    const intervalId = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4 font-sans sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">World Cup Live Match Ticker</h1>
        <p className="text-sm text-muted-foreground">
          Real 2026 World Cup knockout matches, replayed live. Pick one to
          follow its live commentary.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          Can&apos;t reach the match server — retrying…
        </p>
      )}

      {matches === null ? (
        !error && (
          <p className="text-sm text-muted-foreground">Loading matches…</p>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.info.matchId} match={match} />
          ))}
        </div>
      )}
    </main>
  );
}
