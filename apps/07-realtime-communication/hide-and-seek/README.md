# Hide and Seek

NestJS backend & React (Vite) frontend with a minimal Socket.io setup — a two-player hide-and-seek game on a 10×10 grid.

## Install

Install from the monorepo root.

```bash
pnpm install
```

## Environment

Both apps fall back to local defaults, so `.env` files are optional. To override, copy the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Run

Run from this folder. Starts both applications together.

```bash
pnpm dev
```

- Backend at http://localhost:3000
- Frontend at http://localhost:5173/hide-and-seek/
