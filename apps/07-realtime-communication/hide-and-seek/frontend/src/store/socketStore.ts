import { create } from 'zustand/react';
import { socket } from '../socket.ts';
import type { MatchState } from '../types.ts';

interface SocketState {
  connected: boolean;
  role: 'seeker' | 'hider' | null;
  matchState: MatchState | null;
  move: (direction: string) => void;
  playAgain: () => void;
}

export const useSocketStore = create<SocketState>()((set) => {
  socket.on('connect', () => {
    set({ connected: true });
    socket.emit('ping', { hello: 'world' });
  });
  socket.on('disconnect', () => set({ connected: false }));
  socket.on('pong', (data: { receivedAt: number }) => {
    console.log('received pong', data);
  });
  socket.on('role', (data: { role: 'seeker' | 'hider' }) => {
    set({ role: data.role });
  });
  socket.on('matchState', (state: MatchState) => {
    set({ matchState: state });
  });

  return {
    connected: socket.connected,
    role: null,
    matchState: null,
    move: (direction: string) => socket.emit('move', { direction }),
    playAgain: () => socket.emit('playAgain'),
  };
});
