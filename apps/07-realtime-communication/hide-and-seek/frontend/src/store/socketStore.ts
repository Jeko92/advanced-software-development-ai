import { create } from 'zustand/react';
import { socket } from '../socket.ts';
import type {
  ChatMessage,
  ClientRole,
  Difficulty,
  MatchState,
  RoomError,
  RoomSummary,
  WorldSize,
} from '../types.ts';

interface SocketState {
  connected: boolean;
  role: ClientRole | null;
  matchState: MatchState | null;
  rooms: RoomSummary[];
  roomError: RoomError | null;
  notice: string | null;
  messages: ChatMessage[];
  createRoom: (settings: {
    roomName: string;
    worldSize: WorldSize;
    difficulty: Difficulty;
  }) => void;
  joinRoom: (roomName: string) => void;
  leaveRoom: () => void;
  clearMessages: () => void;
  move: (direction: string) => void;
  ready: () => void;
  requestSwap: () => void;
  sendMessage: (text: string) => void;
  respondToSwap: (accepted: boolean) => void;
}

export const useSocketStore = create<SocketState>()((set) => {
  socket.on('connect', () => {
    set({ connected: true });
    socket.emit('ping', { hello: 'world' });
  });
  socket.on('disconnect', () =>
    set({
      connected: false,
      role: null,
      matchState: null,
      rooms: [],
      messages: [],
    }),
  );
  socket.on('pong', (data: { receivedAt: number }) => {
    console.log('received pong', data);
  });
  socket.on('roomList', (rooms: RoomSummary[]) => set({ rooms }));
  socket.on('role', (data: { role: ClientRole }) =>
    set((state) => ({
      role: data.role,
      roomError: null,
      notice: null,
      messages: state.matchState ? state.messages : [],
    })),
  );
  socket.on('chatMessage', (message: ChatMessage) =>
    set((state) => ({ messages: [...state.messages, message] })),
  );
  socket.on('roomError', (data: { reason: RoomError }) =>
    set({ roomError: data.reason }),
  );
  socket.on('roomClosed', () =>
    set({
      role: null,
      matchState: null,
      messages: [],
      notice: 'The game ended because a player left.',
    }),
  );
  socket.on('matchState', (state: MatchState) => {
    set({ matchState: state });
  });

  return {
    connected: socket.connected,
    role: null,
    matchState: null,
    rooms: [],
    roomError: null,
    notice: null,
    messages: [],
    move: (direction: string) => socket.emit('move', { direction }),
    ready: () => socket.emit('ready'),
    requestSwap: () => socket.emit('requestSwap'),
    sendMessage: (text) => socket.emit('chatMessage', { text }),
    respondToSwap: (accepted) => socket.emit('respondToSwap', { accepted }),
    createRoom: (settings) => socket.emit('createRoom', settings),
    joinRoom: (roomName) => socket.emit('joinRoom', { roomName }),
    leaveRoom: () => {
      socket.emit('leaveRoom');
      set({ role: null, matchState: null, messages: [] });
    },
    clearMessages: () => set({ roomError: null, notice: null }),
  };
});
