# Delivery Service

Real-Time Communication challenge — one order's delivery status tracked via short polling, long polling, and SSE.

`api/` is a plain Express server, `web/` is Next.js. Both are part of the pnpm workspace at the repo root.

## Install

From the repo root:

```bash
pnpm install
```

## Environment

Both apps already ship a `.env` with working defaults for local dev — no setup needed:

- `api/.env` — `PORT=3030`
- `web/.env` — `NEXT_PUBLIC_API_URL=http://localhost:3030`

## Run

From this directory (`apps/07-realtime-communication/delivery-service`):

```bash
pnpm dev
```

This runs the API and the web app together (via `concurrently`):

- API — http://localhost:3030
- Web — http://localhost:3000

To run them separately instead, from the repo root:

```bash
pnpm --filter @bootcamp/delivery-service-api dev
pnpm --filter @bootcamp/delivery-service-web dev
```

## Other scripts

Available in both `api/` and `web/` (run with `pnpm --filter <package> <script>`):

| Script          | What it does                  |
| --------------- | ------------------------------ |
| `typecheck`     | `tsc --noEmit` (web also runs `next typegen` first) |
| `lint` / `lint:fix` | ESLint                     |
| `format:check` / `format:write` | Prettier          |

Package names: `@bootcamp/delivery-service-api`, `@bootcamp/delivery-service-web`.
