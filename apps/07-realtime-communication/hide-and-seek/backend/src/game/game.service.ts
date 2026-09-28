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

    this.socketAssignments.set(socketId, { roomId, role: 'seeker' });
    this.matches.set(roomId, {
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
    });
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

    const player = match.players[assignment.role]!;
    const target = {
      x: player.position.x + delta.x,
      y: player.position.y + delta.y,
    };

    if (!this.isInBounds(target, match.gridSize)) return null;

    player.position = target;
    const seekerPos = match.players.seeker?.position;
    const hiderPos = match.players.hider?.position;
    if (
      seekerPos &&
      hiderPos &&
      seekerPos.x === hiderPos.x &&
      seekerPos.y === hiderPos.y
    ) {
      this.finishMatch(match, 'seeker', 'caught');
    }
    return match;
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
