import { useState } from 'react';
import { POLL_IDS, POLL_OPTIONS } from '../lib/config';
import { Panel } from './panel';
import { PollPicker } from './poll-picker';
import { PollView } from './poll-view';

export function PollEffectPanel() {
  const [pollId, setPollId] = useState<string>(POLL_IDS[0]);

  return (
    <Panel
      title="Live poll · useEffect"
      description="One shared socket, per-poll rooms, and listeners that are cleaned up on every unmount."
    >
      <PollPicker value={pollId} onChange={setPollId} />
      <PollView options={POLL_OPTIONS} results={{}} onVote={() => {}} />
    </Panel>
  );
}
