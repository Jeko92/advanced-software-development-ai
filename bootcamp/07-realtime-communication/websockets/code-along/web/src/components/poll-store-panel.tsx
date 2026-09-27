import { useState } from 'react';
import { POLL_IDS, POLL_OPTIONS } from '../lib/config';
import { Panel } from './panel';
import { PollPicker } from './poll-picker';
import { PollView } from './poll-view';

export function PollStorePanel() {
  const [pollId, setPollId] = useState<string>(POLL_IDS[0]);

  return (
    <Panel
      title="Live poll · Zustand store"
      description="The socket and its listeners live in a store; components only read slices and call actions."
    >
      <PollPicker value={pollId} onChange={setPollId} />
      <PollView options={POLL_OPTIONS} results={{}} onVote={() => {}} />
    </Panel>
  );
}
