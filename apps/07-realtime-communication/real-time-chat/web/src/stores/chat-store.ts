import { io } from 'socket.io-client';
import { create } from 'zustand';
import {
  API_URL,
  PRESET_ROOMS,
  type ChatMessage,
  type Session,
} from '../lib/chat';

const socket = io(API_URL, { autoConnect: false });

type ChatState = {
  username: string | null;
  room: string | null;
  rooms: string[];
  messages: ChatMessage[];
  users: string[];
  typingUsers: string[];
  connected: boolean;
  error: string | null;
  connect: (session: Session) => void;
  leave: () => void;
  joinRoom: (room: string) => void;
  sendMessage: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
};

const initialState = {
  username: null,
  room: null,
  rooms: [...PRESET_ROOMS],
  messages: [],
  users: [],
  typingUsers: [],
  connected: false,
  error: null,
};

const withRoom = (rooms: string[], room: string) =>
  rooms.includes(room) ? rooms : [...rooms, room];

export const useChatStore = create<ChatState>()((set, get) => {
  socket.on('connect', () => {
    set({ connected: true });
    const { room } = get();
    if (room) socket.emit('joinRoom', room);
  });
  socket.on('disconnect', () => set({ connected: false }));
  socket.on('message', (message: ChatMessage) => {
    if (message.room !== get().room) return;
    set((state) => ({ messages: [...state.messages, message] }));
  });

  return {
    ...initialState,
    connect: ({ username, room }) => {
      set({
        ...initialState,
        username,
        room,
        rooms: withRoom([...PRESET_ROOMS], room),
      });
      socket.auth = { username };
      socket.connect();
    },

    leave: () => {
      socket.disconnect();
      set(initialState);
    },

    joinRoom: (room) => {
      if (room === get().room) return;
      set((state) => ({
        room,
        rooms: withRoom(state.rooms, room),
        messages: [],
      }));
      socket.emit('joinRoom', room);
    },

    sendMessage: (text) => {
      const { room } = get();
      if (room) socket.emit('sendMessage', { room, text });
    },

    setTyping: () => {},
  };
});
