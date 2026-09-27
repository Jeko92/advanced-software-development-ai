import type { ChatMessage } from './chat';

// Static sample data so the UI looks alive before any socket code exists.
// Delete this file once the store is wired up (CHALLENGE.md, Task 1).

export const DEMO_USERS = ['alice', 'bob', 'carol'];

export const DEMO_TYPING_USERS = ['bob'];

export const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-1',
    room: 'general',
    kind: 'system',
    username: 'bob',
    text: 'bob joined #general',
    sentAt: '2026-09-27T09:00:00.000Z',
  },
  {
    id: 'demo-2',
    room: 'general',
    kind: 'user',
    username: 'bob',
    text: 'Morning! Anyone else fighting with Socket.io rooms today?',
    sentAt: '2026-09-27T09:01:00.000Z',
  },
  {
    id: 'demo-3',
    room: 'general',
    kind: 'user',
    username: 'carol',
    text: 'Yes — remember the client can only *ask* to join, the server decides.',
    sentAt: '2026-09-27T09:02:00.000Z',
  },
  {
    id: 'demo-4',
    room: 'general',
    kind: 'user',
    username: 'alice',
    text: 'And re-join on every reconnect, or you silently stop getting messages 🙃',
    sentAt: '2026-09-27T09:03:00.000Z',
  },
];
