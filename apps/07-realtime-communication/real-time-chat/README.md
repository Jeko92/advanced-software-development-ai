# Real-time chat

A room-based chat on Socket.io — people join named rooms, see who is there, see who is typing, and keep chatting through reconnects. Built for the Real-Time Communication challenges (`docs/learning/07-realtime-communication/websockets/challenges.md`).

| Workspace | Package                        | Stack                                     | URL                     |
| --------- | ------------------------------ | ----------------------------------------- | ----------------------- |
| `api`     | `@bootcamp/real-time-chat-api` | NestJS 11 + Socket.io gateway             | `http://localhost:3000` |
| `web`     | `@bootcamp/real-time-chat-web` | Vite 8 + React 19 + Tailwind 4 + Zustand  | `http://localhost:5173` |

## Install

Dependencies are managed by the monorepo's pnpm workspace — install from the **repo root**:

```bash
pnpm install
```

Create the local env files from their examples:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

## Run

From this directory, start the api and the web app together:

```bash
pnpm dev
```

Or run one workspace:

```bash
pnpm --filter @bootcamp/real-time-chat-api dev
pnpm --filter @bootcamp/real-time-chat-web dev
```

Open <http://localhost:5173> in **two tabs** (or two browsers / devices on your network) and join with different usernames to chat between them.

Health check: `curl localhost:3000/health`.

### Chatting from another device

To chat from a phone or a second computer on the same network:

1. Find your machine's LAN IP (macOS: `ipconfig getifaddr en0`), e.g. `192.168.1.20`.
2. In `web/.env`, point the client at that IP: `VITE_API_URL=http://192.168.1.20:3000`.
3. Start the web app so it listens on the network: `pnpm --filter @bootcamp/real-time-chat-web dev --host`.
4. Open `http://192.168.1.20:5173` on the other device.

The Socket.io gateway allows any origin (`cors: { origin: '*' }`), so no other change is needed.

## Checks

Each workspace has `lint`, `lint:fix`, `typecheck`, `build`, `format:check` and `format:write` scripts, so the repo-wide Turbo tasks pick them up. To run them only for this app, from the repo root:

```bash
pnpm turbo run lint typecheck format:check --filter "./apps/07-realtime-communication/real-time-chat/*"
```
