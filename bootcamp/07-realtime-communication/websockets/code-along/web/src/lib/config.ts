export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030';

export const NATIVE_WS_URL =
  import.meta.env.VITE_NATIVE_WS_URL ?? 'ws://localhost:3000';

export const POLL_IDS = ['lunch', 'dinner'] as const;

export const POLL_OPTIONS = ['pizza', 'pasta'] as const;

export type PollResults = Record<string, number>;

export type VoteAck = { ok: true } | { ok: false; reason: string };

// Who you are, for the handshake auth — open a second window with
// ?token=token-bob to act as another user.
export const AUTH_TOKEN =
  new URLSearchParams(window.location.search).get('token') ?? 'token-alice';
