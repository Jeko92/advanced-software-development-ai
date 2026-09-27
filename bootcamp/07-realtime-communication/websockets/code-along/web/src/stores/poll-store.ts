import { io } from 'socket.io-client';
import { create } from 'zustand';
import { API_URL, type PollResults, type VoteAck } from '../lib/config';

const socket = io(API_URL, { autoConnect: false });

type PollState = {
  results: PollResults;
  connected: boolean;
  pollId: string | null;
  joinPoll: (pollId: string) => void;
  vote: (option: string) => Promise<void>;
  error: string | null;
};

export const usePollStore = create<PollState>()((set, get) => {
  socket.on('connect', () => {
    set({ connected: true });
    const { pollId } = get();
    if (pollId) socket.emit('joinPoll', pollId);
  });
  socket.on('disconnect', () => set({ connected: false }));
  socket.on('results', (results: PollResults) => set({ results }));

  return {
    results: {},
    connected: false,
    pollId: null,
    error: null,

    joinPoll: (pollId) => {
      set({ pollId });
      if (socket.connected) {
        socket.emit('joinPoll', pollId);
      } else {
        socket.connect();
      }
    },

    vote: async (option) => {
      const ack: VoteAck = await socket.emitWithAck('vote', {
        pollId: get().pollId,
        option,
      });
      set({ error: ack.ok ? null : ack.reason });
    },
  };
});
