import { io } from 'socket.io-client';
import { create } from 'zustand';
import { API_URL, type PollResults } from '../lib/config';

const socket = io(API_URL, { autoConnect: false });

type PollState = {
  results: PollResults;
  connected: boolean;
  pollId: string | null;
  joinPoll: (pollId: string) => void;
  vote: (option: string) => void;
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

    joinPoll: (pollId) => {
      set({ pollId });
      if (socket.connected) {
        socket.emit('joinPoll', pollId);
      } else {
        socket.connect();
      }
    },

    vote: (option) => socket.emit('vote', { pollId: get().pollId, option }),
  };
});
