# Recap Project 5 - Challenges

This is the recap project for the **Real-Time Communication** module. You will build a Hide and Seek game from the introduction: two players on a grid, moving cell by cell in real time. The seeker wins by landing on the hider's cell; the hider wins by staying free until the timer ends.

Every numbered section keeps the app running and brings up something new, so that each section represents a meaningful commit.

Starter:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-5 hide-and-seek
```

## 1 Project Setup and a First Connection

- Get the starter running. From the repo root, run `bun install`, then `bun run dev`. Both apps start, and opening the frontend at `http://localhost:5173` logs a connection in the backend terminal.
- The connection is open but carries nothing yet. Prove it works both ways. From the client, emit a test event as soon as the socket connects. On the server, add a handler for that event that logs what it received and emits a reply. On the client, listen for that reply and log it.
- Initiate a Git repository, publish it on GitHub and share it in the relevant Discord thread.

**Done when:** loading the frontend opens a socket, the server logs the client's test event, and the client logs the server's reply.

_Resource:_ [NestJS Gateways](https://docs.nestjs.com/websockets/gateways)

## 2 Rooms & Matchmaking

A match needs exactly two players who only hear from each other, not from everyone else connected to the server.

- When a client connects, place it in a game room. Start a fresh room when none is waiting, and add the next player to the room that already has one player in it.
- Use Socket.io rooms so you can broadcast to just the two sockets in a single match.
- Once a room holds two players, assign one the seeker role and the other the hider, and tell each client which role it has.
- Keep track of which room and which role each socket has. The server needs this on every later event to know who is moving and which match to update. A map from socket id to its room and role is enough.
- Start the game only when the second player arrives. Until then, the first player waits.

**Done when:** two browser tabs are paired into one room and each is told whether it is the seeker or the hider, while a third tab waits for a partner.

- **Design question:** With many players connecting, how do you know which two belong to the same match, and how do you keep one match's messages from leaking into another?

_Resource:_ [Socket.io Rooms](https://socket.io/docs/v4/rooms/)

## 3 Authoritative Game State and the Grid

The server holds the real game state.  
The clients only draws it into the Grid.

- For starters, make the game a 10x10 grid.
- Define the state a match needs on the server:
  - each player's position on the grid
  - who is the seeker and who is the hider
  - the status of the game
  - the time remaining.
- For the status, you need at least a `running` and a `finished` value. A
  `waiting` value, for the time before the second player joins, is useful too.
- Decide the starting positions, for example the seeker in one corner and the hider in the opposite one, and put them into the state when the match begins.
- Keep this state in one place on the server, for example an in-memory service that holds all active matches, rather than on the gateway instance or attached to a single connection.
- Broadcast the initial state to both players in the room.
- On the frontend, render the grid from the state you receive and mark where each player stands.

**Done when:** both clients show a 10x10 grid with the two players on their starting cells, drawn from state the server sent.

- **State question:** Some data must be stored, like a player's coordinates. Some values can be callculated from those data, like whether two players occupy the same cell. What belongs in the stored state, and what should you compute on demand?

_Resource:_ [Socket.io Emitting Events](https://socket.io/docs/v4/emitting-events/)

## 4 Movement and the Message Protocol

Now make the players move, with the server as the gatekeeper for every step.

- Capture arrow key presses on the frontend and emit a move intent, for example a direction like `"up"` or `"left"`, rather than a finished coordinate.
- Remove the key listener when the component unmounts, and read the latest state when a key is pressed, so you are not working from a stale copy.
- On the server, find which player sent the move from its socket, work out the target cell, then check the move before applying it: the game must be running, and the target must stay inside the 10x10 grid.
- Update the moving player's position in the state and broadcast the new state to the room so both clients re-render.

**Done when:** pressing arrow keys moves your own player on both screens, and a move that would leave the grid is ignored.

**Protocol question:** What does a move event actually need to carry? And why is it safer to send the direction the player pressed and let the server compute the new position, instead of sending the new coordinates straight from the browser?

_Resource:_ [Socket.io Client API](https://socket.io/docs/v4/client-api/)

## 5 Winning, the Timer, and Game Over

Give the match a clock and a way to end.

- Start a countdown on the server when the match begins and send the remaining time to both clients as it ticks down. Setup a game length e.g. 60 seconds (you can adjust later).
- After each move, check whether the seeker now shares a cell with the hider. If so, the seeker wins.
- When the timer reaches zero with no catch, the hider wins.
- Set a winner in the state, broadcast a game-over message, and have both clients show the result and stop sending moves.
- **Design question:** Why must the timer and the catch check live on the server rather than in each browser? Picture what would happen if one player's client ran its own clock.

_Resource:_ [NestJS Gateways - Message Handling](https://docs.nestjs.com/websockets/gateways#subscribing-to-messages)

## 6 Disconnects and Playing Again

A real game has to survive a player closing their tab.

- Implement `handleDisconnect` on the gateway. When a player leaves mid-game, tell the other player and end the match. Don't leave the remaining player stuck.
- Handle the player who leaves while still waiting alone for a partner. Clear that empty room, so the next player to connect is not matched into a room with no one in it.
- Clean up the match state and the timer so no stale match is left running on the server.
- Offer a way to play again, either by returning the waiting player to matchmaking or by resetting the room for a fresh round.

**Done when:** closing one player's tab ends the match cleanly for the other player, a player leaving the waiting room frees it for the next person, and a finished match can start a new round.

**Design question:** A disconnect can land at different moments, mid-game or while a player is still waiting alone. What has to be cleaned up in each case, and what goes wrong for the next player if you skip it?

_Resource:_ [NestJS Gateways - Lifecycle Hooks](https://docs.nestjs.com/websockets/gateways#lifecycle-hooks)

## Bonus Challenges

Pick one or more once the main game works.

- **Walls:** Add cells the players cannot enter. Place them in the server state, reject moves into them, and draw them on the grid so both players see the same obstacles.
- **Special Cells**: Add terrain that changes how movement works, such as:
  - ice that carries the player an extra cell in the direction they moved
  - thorns
  - sand
  - insert your own idea here, be creative 🧐
- **Items:** Scatter pickups on the board that change the match when a player lands on one, for example:
  - a speed boost
  - a freeze that stops the opponent for a moment
  - extra time on the clock
  - insert your own idea here, be creative 🧐  
    The server owns the rules for spawning items and applying their effects.

- **Portals**: Let a player place two linked portals. Stepping onto one moves the
  player to the other.
- **Maze with flipped logic:** Turn the grid into a maze of walls, increase the board size and invert the goal. Now both players are hidden from each other and must meet on the same cell to win together before the timer runs out.
- **Your own idea:** Design a new mechanic and justify it. Keep the rules on the
  server, where neither client can override them.
