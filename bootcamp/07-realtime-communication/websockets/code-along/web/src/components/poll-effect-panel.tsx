import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  API_URL,
  POLL_IDS,
  POLL_OPTIONS,
  type PollResults,
} from '../lib/config';
import { ConnectionBadge } from './connection-badge';
import { Panel } from './panel';
import { PollPicker } from './poll-picker';
import { PollView } from './poll-view';

const socket = io(API_URL, { autoConnect: false });

export function PollEffectPanel() {
  const [pollId, setPollId] = useState<string>(POLL_IDS[0]);
  const [results, setResults] = useState<PollResults>({});
  const [activity, setActivity] = useState<string | null>(null);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      socket.emit('joinPoll', pollId);
    };
    const onDisconnect = () => setConnected(false);
    const onResults = (data: PollResults) => {
      console.log('results', data);
      setResults(data);
    };
    const onSomeoneVoted = (option: string) =>
      setActivity(`Someone else just voted for ${option}`);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('results', onResults);
    socket.on('someoneVoted', onSomeoneVoted);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('results', onResults);
      socket.off('someoneVoted', onSomeoneVoted);
      socket.disconnect();
    };
  }, [pollId]);

  const vote = (option: string) => socket.emit('vote', { pollId, option });

  return (
    <Panel
      title="Live poll · useEffect"
      description="One shared socket, per-poll rooms, and listeners that are cleaned up on every unmount."
      status={<ConnectionBadge connected={connected} />}
    >
      <PollPicker value={pollId} onChange={setPollId} />
      <PollView options={POLL_OPTIONS} results={results} onVote={vote} />
      {activity && <p className="mt-4 text-sm text-slate-600">{activity}</p>}
    </Panel>
  );
}
