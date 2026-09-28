# Hide and Seek

A real-time, two-player hide-and-seek game on a grid: NestJS + Socket.io backend,
React (Vite) frontend with Tailwind CSS and shadcn/ui. The server owns every rule;
clients only send intents and render the state they receive.

## Game flow

1. **Lobby** — every visitor lands here and sees all rooms live. Create a room with a
   name, world size and difficulty, or join one from the list.
2. **Roles** — the room creator is the **seeker**, the next player the **hider**,
   everyone after that joins as an **observer** (sees everything, can't act).
3. **Ready check** — both players confirm in a modal, then a server-driven **3-2-1**
   countdown starts the round.
4. **Round** — the seeker wins by landing on the hider's cell, the hider by staying
   free until the timer runs out.
5. **Between rounds** — play again (back through the ready check on a fresh board) or
   swap roles by mutual agreement.

If a player leaves, the room closes and everyone returns to the lobby.

## Settings

| World size | Board | Round length           |
| ---------- | ----- | ---------------------- |
| Small      | 10×10 | 60 s                   |
| Medium     | 20×20 | 120 s                  |
| Large      | 30×30 | free mode (catch only) |

| Difficulty | Round time | Walls | Ice  | Items    | Spawn / max |
| ---------- | ---------- | ----- | ---- | -------- | ----------- |
| Easy       | 1.25×      | few   | few  | ⚡ ⏱️    | 10 s / 2    |
| Normal     | 1×         | some  | some | ⚡ 🥶 ⏱️ | 8 s / 3     |
| Hard       | 0.75×      | many  | many | ⚡ 🥶 ⏱️ | 5 s / 5     |

## Features

- **Walls** — generated fresh every round; the board always stays fully connected.
- **Ice** — you keep sliding in the same direction until you leave the ice; sliding
  through the hider counts as a catch.
- **Items** — ⚡ two cells per key press for 5 s, 🥶 freezes your opponent for 3 s,
  ⏱️ adds 10 s for the hider or removes 10 s for the seeker.
- **Portals** — two linked cells; stepping onto one moves you to the other.
- **Hidden opponent** — players only see their own token; the opponent is revealed
  when the round ends. Observers see everything.
- **Chat** — players can talk anytime. Observers pick a name in the lobby (or get
  numbered, e.g. "Observer 2") and appear with their initials; during a round their
  messages reach only other spectators, between rounds everyone.
- **Cheers** — observers send emoji reactions (👏 🔥 😱 😂 💪) that float over every
  board, so they can root for the players without leaking positions.
- **Pause** — needs both players to agree, and so does resuming: both click "Ready to
  resume", then a 3-2-1 countdown continues the round.

## Co-op maze mode

Pick **Co-op maze** when creating a room. Both players are hidden from each other in a
real maze (Easy has the most shortcuts, Hard the fewest) and win together by meeting on
the same cell before time runs out — on 30×30 the co-op round lasts 240 s. There are
no items or portals, players can't chat during a round (no coaching), and a
🔥 hot / ❄️ cold hint shows how close the partner is without revealing where.

## Controls

- Arrow keys or **W A S D**
- On touch screens: the on-screen D-pad below the board

## Install

Install from the monorepo root.

```bash
pnpm install
```

## Environment

Both apps fall back to local defaults, so `.env` files are optional. To override, copy
the examples:

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

## Checks

```bash
pnpm check   # lint + typecheck + format for both apps
pnpm test    # backend tests
```
