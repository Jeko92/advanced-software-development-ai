import { useEffect, useState } from 'react';
import { AUTH_TOKEN, POLL_IDS, POLL_OPTIONS } from '../lib/config';
import { usePollStore } from '../stores/poll-store';
import { ConnectionBadge } from './connection-badge';
import { Panel } from './panel';
import { PollPicker } from './poll-picker';
import { PollView } from './poll-view';

export function PollStorePanel() {
  const [pollId, setPollId] = useState<string>(POLL_IDS[0]);

  const results = usePollStore((s) => s.results);
  const connected = usePollStore((s) => s.connected);
  const joinPoll = usePollStore((s) => s.joinPoll);
  const vote = usePollStore((s) => s.vote);
  const error = usePollStore((s) => s.error);

  useEffect(() => {
    joinPoll(pollId);
  }, [pollId, joinPoll]);

  return (
    <Panel
      title="Live poll · Zustand store"
      description="The socket and its listeners live in a store; components only read slices and call actions."
      status={<ConnectionBadge connected={connected} />}
    >
      <PollPicker value={pollId} onChange={setPollId} />
      <PollView options={POLL_OPTIONS} results={results} onVote={vote} />
      <p className="mt-4 text-sm text-slate-600">
        You are <strong>{AUTH_TOKEN}</strong> · watching #{pollId}
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Panel>
  );
}
