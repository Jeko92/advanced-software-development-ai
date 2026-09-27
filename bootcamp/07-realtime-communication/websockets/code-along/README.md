# WebSockets code-along

Three workspaces that run together:

| Workspace   | Package                          | Stack                                 | URL                     |
| ----------- | -------------------------------- | ------------------------------------- | ----------------------- |
| `native-ws` | `@bootcamp/websockets-native-ws` | Express 5 + `ws` (raw WebSockets)     | `ws://localhost:3000`   |
| `api`       | `@bootcamp/websockets-api`       | NestJS 11 + Socket.IO gateway         | `http://localhost:3030` |
| `web`       | `@bootcamp/websockets-web`       | Vite 8 + React 19 + Tailwind 4 + Zustand | `http://localhost:5173` |

## Install

Dependencies are managed by the monorepo's pnpm workspace — install from the **repo root**:

```bash
pnpm install
```

Create the local env files from their examples:

```bash
cp native-ws/.env.example native-ws/.env
cp api/.env.example api/.env
cp web/.env.example web/.env
```

## Run

From this directory, start all three dev servers at once:

```bash
pnpm dev
```

Or run a single workspace:

```bash
pnpm --filter @bootcamp/websockets-native-ws dev
pnpm --filter @bootcamp/websockets-api dev
pnpm --filter @bootcamp/websockets-web dev
```

Health checks: `curl localhost:3030/health` and `curl localhost:3000/health`.

## Checks

Each workspace has `lint`, `lint:fix`, `typecheck`, `build`, `format:check` and `format:write` scripts, so the repo-wide Turbo tasks (`pnpm lint`, `pnpm typecheck`, …) pick them up. To run them only for this code-along, from the repo root:

```bash
pnpm turbo run lint typecheck format:check --filter "./bootcamp/07-realtime-communication/websockets/code-along/*"
```
