import { Injectable } from '@nestjs/common';
import {
  ClientRole,
  COUNTDOWN_SECONDS,
  DIFFICULTIES,
  Difficulty,
  EndReason,
  gameLengthFor,
  MatchState,
  Position,
  Role,
  ROOM_NAME_MAX_LENGTH,
  RoomError,
  RoomSummary,
  WORLD_SIZES,
  WorldSize,
} from './game.types';

interface SocketAssignment {
  roomId: string;
  role: Role;
}

const startPositions = (gridSize: number) => {
  return {
    seeker: { x: 0, y: 0 },
    hider: { x: gridSize - 1, y: gridSize - 1 },
  };
};

const normalizeRoomName = (raw: unknown) =>
  String(raw ?? '')
    .trim()
    .toLowerCase();

const isWorldSize = (value: unknown): value is WorldSize =>
  typeof value === 'string' && Object.hasOwn(WORLD_SIZES, value);

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && Object.hasOwn(DIFFICULTIES, value);

@Injectable()
export class GameService {
  private socketAssignments = new Map<string, SocketAssignment>();
  private observers = new Map<string, string>();
  private matches = new Map<string, MatchState>();
  private readonly deltas: Record<string, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  private timers = new Map<string, NodeJS.Timeout>();

  getMatch(roomId: string): MatchState | undefined {
    return this.matches.get(roomId);
  }

  createRoom(
    socketId: string,
    settings: { roomName: unknown; worldSize: unknown; difficulty: unknown },
  ): { roomId: string; role: ClientRole } | { error: RoomError } {
    if (this.isInRoom(socketId)) return { error: 'already-in-room' };

    const roomId = normalizeRoomName(settings.roomName);
    if (roomId === '' || roomId.length > ROOM_NAME_MAX_LENGTH) {
      return { error: 'invalid-name' };
    }
    if (this.matches.has(roomId)) return { error: 'name-taken' };
    if (
      !isWorldSize(settings.worldSize) ||
      !isDifficulty(settings.difficulty)
    ) {
      return { error: 'invalid-settings' };
    }

    const { worldSize, difficulty } = settings;
    const gridSize = WORLD_SIZES[worldSize].gridSize;
    const gameLengthSeconds = gameLengthFor(worldSize, difficulty);

    const match: MatchState = {
      roomId,
      status: 'waiting',
      worldSize,
      difficulty,
      gridSize,
      gameLengthSeconds,
      players: {
        seeker: { socketId, position: startPositions(gridSize).seeker },
        hider: null,
      },
      observerCount: 0,
      timeRemaining: gameLengthSeconds,
      winner: null,
      endReason: null,
      ready: { seeker: false, hider: false },
      countdown: null,
      swapRequestedBy: null,
      wallEdges: [],
      iceCells: [],
    };
    this.generateTerrain(match);
    this.socketAssignments.set(socketId, { roomId, role: 'seeker' });
    this.matches.set(roomId, match);
    return { roomId, role: 'seeker' };
  }

  joinRoom(
    socketId: string,
    rawName: unknown,
  ): { roomId: string; role: ClientRole } | { error: RoomError } {
    if (this.isInRoom(socketId)) return { error: 'already-in-room' };

    const roomId = normalizeRoomName(rawName);
    const match = this.matches.get(roomId);
    if (!match) return { error: 'not-found' };

    if (!match.players.hider) {
      this.socketAssignments.set(socketId, { roomId, role: 'hider' });
      match.players.hider = {
        socketId,
        position: startPositions(match.gridSize).hider,
      };
      match.status = 'ready-check';
      return { roomId, role: 'hider' };
    }

    this.observers.set(socketId, roomId);
    match.observerCount++;
    return { roomId, role: 'observer' };
  }

  applyMove(socketId: string, direction: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;

    const match = this.matches.get(assignment.roomId);
    if (!match || match.status !== 'running') return null;

    const delta = this.deltas[direction];
    if (!delta) return null;

    return this.movePlayer(match, assignment.role, delta) ? match : null;
  }

  private movePlayer(match: MatchState, role: Role, delta: Position): boolean {
    const player = match.players[role]!;
    let moved = false;

    while (true) {
      const next = {
        x: player.position.x + delta.x,
        y: player.position.y + delta.y,
      };
      if (
        !this.isInBounds(next, match.gridSize) ||
        this.isBlocked(player.position, next, match)
      ) {
        break;
      }

      player.position = next;
      moved = true;

      if (this.isCaught(match)) {
        this.finishMatch(match, 'seeker', 'caught');
        break;
      }
      if (!this.isIceCell(next, match)) break;
    }

    return moved;
  }

  private isCaught(match: MatchState) {
    const s = match.players.seeker?.position;
    const h = match.players.hider?.position;
    return !!s && !!h && s.x === h.x && s.y === h.y;
  }

  startTimer(roomId: string, onTick: (match: MatchState) => void) {
    const match = this.matches.get(roomId);
    if (!match) return;
    this.clearTimer(roomId);
    match.timeRemaining = match.gameLengthSeconds;

    const timer = setInterval(() => {
      match.timeRemaining -= 1;
      if (match.timeRemaining <= 0) {
        this.finishMatch(match, 'hider', 'timeout');
      }
      onTick(match);
    }, 1000);
    this.timers.set(roomId, timer);
  }

  leaveRoom(
    socketId: string,
  ):
    | { kind: 'room-closed'; roomId: string }
    | { kind: 'observer-left'; match: MatchState }
    | null {
    const observedRoomId = this.observers.get(socketId);
    if (observedRoomId) {
      this.observers.delete(socketId);
      const match = this.matches.get(observedRoomId);
      if (!match) return null;
      match.observerCount--;
      return { kind: 'observer-left', match };
    }

    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    this.closeRoom(assignment.roomId);
    return { kind: 'room-closed', roomId: assignment.roomId };
  }

  listRooms(): RoomSummary[] {
    return [...this.matches.values()].map((m) => ({
      roomId: m.roomId,
      worldSize: m.worldSize,
      difficulty: m.difficulty,
      status: m.status,
      players: Number(!!m.players.seeker) + Number(!!m.players.hider),
      observers: m.observerCount,
    }));
  }

  setReady(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || !match.players.seeker || !match.players.hider) return null;

    if (match.status === 'finished') this.startRound(match);
    if (match.status !== 'ready-check') return null;

    match.ready[assignment.role] = true;
    match.swapRequestedBy = null;
    return match;
  }

  requestSwap(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || !this.canSwap(match) || match.swapRequestedBy) return null;

    match.swapRequestedBy = assignment.role;
    return match;
  }

  respondToSwap(socketId: string, accepted: boolean): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || !match.swapRequestedBy) return null;
    if (match.swapRequestedBy === assignment.role) return null;

    match.swapRequestedBy = null;
    if (!accepted || !this.canSwap(match)) return match;

    const seeker = match.players.seeker!;
    const hider = match.players.hider!;
    [seeker.socketId, hider.socketId] = [hider.socketId, seeker.socketId];
    this.socketAssignments.set(seeker.socketId, {
      roomId: match.roomId,
      role: 'seeker',
    });
    this.socketAssignments.set(hider.socketId, {
      roomId: match.roomId,
      role: 'hider',
    });

    if (match.status === 'finished') this.startRound(match);
    match.ready = { seeker: false, hider: false };
    return match;
  }

  startCountdown(roomId: string, onTick: (match: MatchState) => void) {
    const match = this.matches.get(roomId);
    if (!match) return;
    this.clearTimer(roomId);
    match.status = 'countdown';
    match.countdown = COUNTDOWN_SECONDS;

    const timer = setInterval(() => {
      match.countdown! -= 1;
      if (match.countdown! > 0) {
        onTick(match);
        return;
      }
      match.countdown = null;
      match.status = 'running';
      this.startTimer(roomId, onTick);
      onTick(match);
    }, 1000);
    this.timers.set(roomId, timer);
  }

  private isInRoom(socketId: string) {
    return this.socketAssignments.has(socketId) || this.observers.has(socketId);
  }

  private startRound(match: MatchState) {
    const start = startPositions(match.gridSize);
    match.players.seeker!.position = start.seeker;
    match.players.hider!.position = start.hider;
    match.status = 'ready-check';
    match.ready = { seeker: false, hider: false };
    match.countdown = null;
    match.winner = null;
    match.endReason = null;
    match.swapRequestedBy = null;
    match.timeRemaining = match.gameLengthSeconds;
    this.generateTerrain(match);
  }

  private generateTerrain(match: MatchState) {
    const start = startPositions(match.gridSize);
    match.wallEdges = this.generateWalls(match, [start.seeker, start.hider]);
    match.iceCells = this.generateIceCells(match, [start.seeker, start.hider]);
  }

  private isIceCell(pos: Position, match: MatchState): boolean {
    return match.iceCells.some((c) => c.x === pos.x && c.y === pos.y);
  }

  private generateIceCells(match: MatchState, avoid: Position[]): Position[] {
    const { gridSize } = match;
    const avoidKeys = new Set(avoid.map((p) => `${p.x},${p.y}`));
    const targetCount = Math.floor(
      gridSize * DIFFICULTIES[match.difficulty].iceCellsPerRow,
    );
    const iceCells: Position[] = [];
    const usedKeys = new Set<string>();

    let attempts = 0;
    while (iceCells.length < targetCount && attempts < targetCount * 20) {
      attempts++;
      const candidate: Position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      const key = `${candidate.x},${candidate.y}`;
      if (avoidKeys.has(key) || usedKeys.has(key)) continue;
      usedKeys.add(key);
      iceCells.push(candidate);
    }

    return iceCells;
  }

  private edgeKey(a: Position, b: Position): string {
    const [p1, p2] = a.y < b.y || (a.y === b.y && a.x < b.x) ? [a, b] : [b, a];
    return `${p1.x},${p1.y}-${p2.x},${p2.y}`;
  }

  private neighbors(pos: Position, gridSize: number): Position[] {
    return [
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x - 1, y: pos.y },
      { x: pos.x + 1, y: pos.y },
    ].filter((p) => this.isInBounds(p, gridSize));
  }

  private wouldFullyEnclose(
    pos: Position,
    gridSize: number,
    wallEdges: Set<string>,
  ): boolean {
    return this.neighbors(pos, gridSize).every((n) =>
      wallEdges.has(this.edgeKey(pos, n)),
    );
  }

  private isConnected(gridSize: number, wallEdges: Set<string>): boolean {
    const visited = new Set<string>(['0,0']);
    const queue: Position[] = [{ x: 0, y: 0 }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of this.neighbors(current, gridSize)) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (visited.has(key)) continue;
        if (wallEdges.has(this.edgeKey(current, neighbor))) continue;
        visited.add(key);
        queue.push(neighbor);
      }
    }

    return visited.size === gridSize * gridSize;
  }

  private generateWalls(match: MatchState, avoid: Position[]): string[] {
    const { gridSize } = match;
    const wallEdges = new Set<string>();
    const avoidKeys = new Set(avoid.map((p) => `${p.x},${p.y}`));
    const directionKeys = Object.keys(this.deltas);
    const numPieces = Math.floor(
      gridSize * DIFFICULTIES[match.difficulty].wallPiecesPerRow,
    );
    const randomDirection = () =>
      directionKeys[Math.floor(Math.random() * directionKeys.length)];

    for (let i = 0; i < numPieces; i++) {
      let current: Position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      const pieceLength = 1 + Math.floor(Math.random() * 4);
      let directionKey = randomDirection();

      for (let step = 0; step < pieceLength; step++) {
        if (step > 0 && Math.random() < 0.3) directionKey = randomDirection();
        const delta = this.deltas[directionKey];
        const next = { x: current.x + delta.x, y: current.y + delta.y };

        if (!this.isInBounds(next, gridSize)) break;
        if (
          avoidKeys.has(`${current.x},${current.y}`) ||
          avoidKeys.has(`${next.x},${next.y}`)
        ) {
          break;
        }

        const key = this.edgeKey(current, next);
        wallEdges.add(key);

        if (
          this.wouldFullyEnclose(current, gridSize, wallEdges) ||
          this.wouldFullyEnclose(next, gridSize, wallEdges) ||
          !this.isConnected(gridSize, wallEdges)
        ) {
          wallEdges.delete(key);
          break;
        }

        current = next;
      }
    }

    return Array.from(wallEdges);
  }

  private isBlocked(from: Position, to: Position, match: MatchState): boolean {
    return match.wallEdges.includes(this.edgeKey(from, to));
  }

  private canSwap(match: MatchState) {
    if (!match.players.seeker || !match.players.hider) return false;
    if (match.status === 'finished') return true;
    return (
      match.status === 'ready-check' &&
      !match.ready.seeker &&
      !match.ready.hider
    );
  }

  private isInBounds(pos: Position, gridSize: number) {
    return pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize;
  }

  private closeRoom(roomId: string) {
    this.clearTimer(roomId);
    const match = this.matches.get(roomId);
    this.matches.delete(roomId);
    for (const player of [match?.players.seeker, match?.players.hider]) {
      if (player) this.socketAssignments.delete(player.socketId);
    }
    for (const [socketId, observedRoomId] of this.observers) {
      if (observedRoomId === roomId) this.observers.delete(socketId);
    }
  }

  private finishMatch(match: MatchState, winner: Role, reason: EndReason) {
    match.status = 'finished';
    match.winner = winner;
    match.endReason = reason;
    this.clearTimer(match.roomId);
  }

  private clearTimer(roomId: string) {
    const timer = this.timers.get(roomId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(roomId);
    }
  }
}
