import { create } from 'zustand/react';
import { socket } from '../socket.ts';
import type {
  ChatMessage,
  Cheer,
  CheerEmoji,
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
  nickname: string;
  myName: string | null;
  cheers: Cheer[];
  setNickname: (nickname: string) => void;
  cheer: (emoji: CheerEmoji) => void;
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
  requestPause: () => void;
  respondToPause: (accepted: boolean) => void;
  resumeMatch: () => void;
  sendMessage: (text: string) => void;
  respondToSwap: (accepted: boolean) => void;
}

const NICKNAME_KEY = 'hide-and-seek:nickname';

function loadNickname() {
  try {
    return localStorage.getItem(NICKNAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export const useSocketStore = create<SocketState>()((set, get) => {
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
  socket.on('role', (data: { role: ClientRole; name: string | null }) =>
    set((state) => ({
      role: data.role,
      myName: data.name,
      roomError: null,
      notice: null,
      messages: state.matchState ? state.messages : [],
    })),
  );
  socket.on('cheer', (cheer: Cheer) => {
    set((state) => ({ cheers: [...state.cheers, cheer] }));
    setTimeout(
      () =>
        set((state) => ({
          cheers: state.cheers.filter((c) => c.id !== cheer.id),
        })),
      2600,
    );
  });
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
    nickname: loadNickname(),
    myName: null,
    cheers: [],
    setNickname: (nickname) => {
      set({ nickname });
      try {
        localStorage.setItem(NICKNAME_KEY, nickname);
      } catch {
        return;
      }
    },
    cheer: (emoji) => socket.emit('cheer', { emoji }),
    move: (direction: string) => socket.emit('move', { direction }),
    ready: () => socket.emit('ready'),
    requestSwap: () => socket.emit('requestSwap'),
    requestPause: () => socket.emit('requestPause'),
    respondToPause: (accepted) => socket.emit('respondToPause', { accepted }),
    resumeMatch: () => socket.emit('resumeMatch'),
    sendMessage: (text) => socket.emit('chatMessage', { text }),
    respondToSwap: (accepted) => socket.emit('respondToSwap', { accepted }),
    createRoom: (settings) => socket.emit('createRoom', settings),
    joinRoom: (roomName) =>
      socket.emit('joinRoom', { roomName, nickname: get().nickname }),
    leaveRoom: () => {
      socket.emit('leaveRoom');
      set({ role: null, matchState: null, messages: [] });
    },
    clearMessages: () => set({ roomError: null, notice: null }),
  };
});
