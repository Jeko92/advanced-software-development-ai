export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const PRESET_ROOMS = ['general', 'random', 'help'] as const;

export type ChatMessage = {
  id: string;
  room: string;
  kind: 'user' | 'system';
  username: string;
  text: string;
  sentAt: string;
};

export type Session = {
  username: string;
  room: string;
};

const PRIVATE_ROOM_PREFIX = 'dm:';

export function roomLabel(room: string, me: string): string {
  if (!room.startsWith(PRIVATE_ROOM_PREFIX)) return `#${room}`;
  const other = room
    .slice(PRIVATE_ROOM_PREFIX.length)
    .split(':')
    .find((name) => name !== me);
  return `@${other ?? me}`;
}
