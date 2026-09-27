export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030';

export const NATIVE_WS_URL =
  import.meta.env.VITE_NATIVE_WS_URL ?? 'ws://localhost:3000';

export const POLL_IDS = ['lunch', 'dinner'] as const;

export const POLL_OPTIONS = ['pizza', 'pasta'] as const;

export type PollResults = Record<string, number>;
