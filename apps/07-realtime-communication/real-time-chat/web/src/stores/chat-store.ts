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
    set((state) => ({
      messages: [...state.messages, message],
      typingUsers: state.typingUsers.filter(
        (user) => user !== message.username,
      ),
    }));
  });
  socket.on('presence', (data: { room: string; users: string[] }) => {
    if (data.room !== get().room) return;
    set((state) => ({
      users: data.users,
      typingUsers: state.typingUsers.filter((user) =>
        data.users.includes(user),
      ),
    }));
  });

  socket.on(
    'typing',
    (data: { room: string; username: string; isTyping: boolean }) => {
      if (data.room !== get().room) return;
      set((state) => {
        const others = state.typingUsers.filter(
          (user) => user !== data.username,
        );
        return {
          typingUsers: data.isTyping ? [...others, data.username] : others,
        };
      });
    },
  );

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
        users: [],
        typingUsers: [],
      }));
      socket.emit('joinRoom', room);
    },

    sendMessage: (text) => {
      const { room } = get();
      if (room) socket.emit('sendMessage', { room, text });
    },

    setTyping: (isTyping) => {
      const { room } = get();
      if (room) socket.emit('typing', { room, isTyping });
    },
  };
});
