'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  Commentary,
  FeedEvent,
  FeedEventType,
  MatchInfo,
  ScoreUpdate,
  StadiumStats,
} from '@/lib/types';

export type ConnectionState =
  'connecting' | 'live' | 'reconnecting' | 'offline';

export type Channel = 'message' | 'named';

export type ReceivedCommentary = Commentary & { id: number; via: Channel };

const FEED_EVENT_TYPES: FeedEventType[] = [
  'score-update',
  'match-commentary',
  'stadium-stats',
];
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_COMMENTARY_ITEMS = 200;

export function useMatchStream(matchId: string) {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'];

  const [info, setInfo] = useState<MatchInfo | null>(null);
  const [score, setScore] = useState<ScoreUpdate | null>(null);
  const [stats, setStats] = useState<StadiumStats | null>(null);
  const [commentary, setCommentary] = useState<ReceivedCommentary[]>([]);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('connecting');
  const [connections, setConnections] = useState(0);
  const [received, setReceived] = useState<Record<Channel, number>>({
    message: 0,
    named: 0,
  });
  const [lastEventId, setLastEventId] = useState<number | null>(null);
  const [connectKey, setConnectKey] = useState(0);

  useEffect(() => {
    fetch(`${apiUrl}/api/matches/${matchId}`)
      .then((res) => res.json() as Promise<MatchInfo>)
      .then(setInfo)
      .catch((error: unknown) => console.error(error));
  }, [apiUrl, matchId]);

  useEffect(() => {
    const source = new EventSource(`${apiUrl}/api/matches/${matchId}/stream`);
    let lastSeenId = -Infinity;
    let failedAttempts = 0;

    const handle = (message: MessageEvent<string>, via: Channel) => {
      const event = JSON.parse(message.data) as FeedEvent;
      if (event.id <= lastSeenId) return;
      lastSeenId = event.id;
      setLastEventId(event.id);
      setReceived((prev) => ({ ...prev, [via]: prev[via] + 1 }));

      switch (event.type) {
        case 'score-update':
          setScore(event.data);
          break;
        case 'stadium-stats':
          setStats(event.data);
          break;
        case 'match-commentary': {
          const item = { ...event.data, id: event.id, via };
          setCommentary((prev) =>
            event.data.kind === 'kickoff'
              ? [item]
              : [item, ...prev].slice(0, MAX_COMMENTARY_ITEMS),
          );
          break;
        }
      }
    };

    source.onmessage = (message: MessageEvent<string>) =>
      handle(message, 'message');
    for (const type of FEED_EVENT_TYPES) {
      source.addEventListener(type, (message: MessageEvent<string>) =>
        handle(message, 'named'),
      );
    }

    source.onopen = () => {
      failedAttempts = 0;
      setConnections((count) => count + 1);
      setConnectionState('live');
    };

    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) {
        setConnectionState('offline');
        return;
      }
      failedAttempts += 1;
      if (failedAttempts > MAX_RECONNECT_ATTEMPTS) {
        source.close();
        setConnectionState('offline');
        return;
      }
      setConnectionState('reconnecting');
    };

    return () => source.close();
  }, [apiUrl, matchId, connectKey]);

  const reconnect = useCallback(() => {
    setCommentary([]);
    setConnectionState('connecting');
    setConnectKey((key) => key + 1);
  }, []);

  const simulateNetworkDrop = useCallback(() => {
    fetch(`${apiUrl}/api/debug/drop-connections`, { method: 'POST' }).catch(
      (error: unknown) => console.error(error),
    );
  }, [apiUrl]);

  return {
    info,
    score,
    stats,
    commentary,
    connectionState,
    connections,
    received,
    lastEventId,
    reconnect,
    simulateNetworkDrop,
  };
}
