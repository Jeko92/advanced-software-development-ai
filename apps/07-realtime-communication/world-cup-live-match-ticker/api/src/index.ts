import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { Response } from 'express';
import express from 'express';
import cors from 'cors';
import { loadMatch } from './espn.ts';
import { type FeedProgress, MatchFeed } from './match-feed.ts';
import { MATCH_IDS } from './matches.ts';
import type { FeedEvent, MatchInfo, MatchSummary } from './types.ts';

const app = express();
const PORT = Number(process.env['PORT'] ?? 3030);
const SECONDS_PER_MATCH_MINUTE = Number(
  process.env['SECONDS_PER_MATCH_MINUTE'] ?? 1,
);

app.use(cors());

const CACHE_DIR = new URL('../.cache/', import.meta.url);
const progressFile = (matchId: string) =>
  new URL(`progress-${matchId}.json`, CACHE_DIR);

const loadProgress = (matchId: string): FeedProgress | undefined => {
  try {
    return JSON.parse(
      readFileSync(progressFile(matchId), 'utf8'),
    ) as FeedProgress;
  } catch {
    return undefined;
  }
};

const saveProgress = (matchId: string, progress: FeedProgress) => {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(progressFile(matchId), JSON.stringify(progress));
};

type LiveMatch = { info: MatchInfo; feed: MatchFeed };
const matches = new Map<string, LiveMatch>();

// Sequential: the first start fetches every match from ESPN, one at a time.
for (const matchId of MATCH_IDS) {
  const { info, steps } = await loadMatch(matchId);
  const feed = new MatchFeed(steps, {
    secondsPerMatchMinute: SECONDS_PER_MATCH_MINUTE,
    halftimePauseMs: 5_000,
    fullTimePauseMs: 20_000,
    onProgress: (progress) => saveProgress(matchId, progress),
  });

  const progress = loadProgress(matchId);
  feed.start(progress);
  matches.set(matchId, { info, feed });

  console.log(
    `${info.home.name} vs ${info.away.name}: ${
      progress
        ? `resuming at line ${progress.nextIndex} (${progress.score.home}–${progress.score.away})`
        : 'starting from kickoff'
    }`,
  );
}

const openStreams = new Set<Response>();

app.get('/', (_req, res) => {
  res.json({ message: 'hello from backend' });
});

app.get('/api/matches', (_req, res) => {
  const summaries: MatchSummary[] = [...matches.values()].map(
    ({ info, feed }) => ({ info, ...feed.summary() }),
  );
  res.header('Cache-Control', 'no-store');
  res.json(summaries);
});

app.get('/api/matches/:id', (req, res) => {
  const match = matches.get(req.params['id'] ?? '');
  if (!match) {
    res.status(404).json({ error: 'unknown match' });
    return;
  }
  res.json(match.info);
});

app.get('/api/matches/:id/stream', (req, res) => {
  const match = matches.get(req.params['id'] ?? '');
  // Must run before writeHead: after the SSE headers a 404 is no longer possible.
  if (!match) {
    res.status(404).end();
    return;
  }
  const { feed } = match;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write('retry: 3000\n\n');

  const send = (event: FeedEvent) => {
    res.write(`id: ${event.id}\n`);
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const lastEventIdHeader = req.headers['last-event-id'];
  const lastEventId = Number(lastEventIdHeader);
  const isReconnect =
    typeof lastEventIdHeader === 'string' && Number.isFinite(lastEventId);

  const catchUp = isReconnect ? feed.eventsAfter(lastEventId) : feed.snapshot();
  catchUp.forEach(send);

  const unsubscribe = feed.subscribe(send);

  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), 15_000);
  openStreams.add(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    openStreams.delete(res);
  });
});

app.get('/api/health', (_req, res) => {
  const viewers = Object.fromEntries(
    [...matches].map(([matchId, { feed }]) => [matchId, feed.viewers]),
  );
  res.json({ viewers, openStreams: openStreams.size });
});

app.post('/api/debug/drop-connections', (_req, res) => {
  const dropped = openStreams.size;
  for (const stream of openStreams) stream.destroy();
  res.json({ dropped });
});

app.listen(PORT, () => {
  console.log(
    `World Cup Live Match Ticker API listening on http://localhost:${PORT} (${matches.size} matches)`,
  );
});
