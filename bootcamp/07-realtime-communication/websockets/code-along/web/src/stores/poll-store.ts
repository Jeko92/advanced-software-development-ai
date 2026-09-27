import { io } from 'socket.io-client';
import { create } from 'zustand';
import {
  API_URL,
  AUTH_TOKEN,
  type PollResults,
  type VoteAck,
} from '../lib/config';

const socket = io(API_URL, {
  autoConnect: false,
  auth: { token: AUTH_TOKEN },
});

type PollState = {
  results: PollResults;
  connected: boolean;
  pollId: string | null;
  viewers: string[];
  joinPoll: (pollId: string) => void;
  vote: (option: string) => Promise<void>;
  error: string | null;
};

export const usePollStore = create<PollState>()((set, get) => {
  socket.on('connect', () => {
    set({ connected: true, error: null });
    const { pollId } = get();
    if (pollId) socket.emit('joinPoll', pollId);
  });
  socket.on('disconnect', () => set({ connected: false }));
  socket.on('connect_error', (error) => set({ error: error.message }));
  socket.on('results', (results: PollResults) => set({ results }));
  socket.on('presence', (viewers: string[]) => set({ viewers }));

  return {
    results: {},
    connected: false,
    pollId: null,
    viewers: [],
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
