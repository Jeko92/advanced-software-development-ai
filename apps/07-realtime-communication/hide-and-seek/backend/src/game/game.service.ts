import { Injectable } from '@nestjs/common';
import {
  GAME_LENGTH_SECONDS,
  GRID_SIZE,
  MatchState,
  Position,
  Role,
} from './game.types';

interface SocketAssignment {
  roomId: string;
  role: Role;
}

@Injectable()
export class GameService {
  private socketAssignments = new Map<string, SocketAssignment>();
  private waitingRoomId: string | null = null;
  private roomCounter = 0;
  private matches = new Map<string, MatchState>();
  private readonly deltas: Record<string, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  private timers = new Map<string, NodeJS.Timeout>();

  assignToRoom(socketId: string) {
    if (this.waitingRoomId === null) {
      const roomId = `room-${++this.roomCounter}`;
      this.waitingRoomId = roomId;
      const assignment: SocketAssignment = { roomId, role: 'hider' };
      this.socketAssignments.set(socketId, assignment);
      this.matches.set(roomId, {
        roomId,
        status: 'waiting',
        players: {
          hider: { socketId, position: { x: GRID_SIZE - 1, y: GRID_SIZE - 1 } },
          seeker: null,
        },
        timeRemaining: 0,
        winner: null,
      });
      return assignment;
    }

    const roomId = this.waitingRoomId;
    this.waitingRoomId = null;
    const assignment: SocketAssignment = { roomId, role: 'seeker' };
    this.socketAssignments.set(socketId, assignment);

    const match = this.matches.get(roomId)!;
    match.players.seeker = { socketId, position: { x: 0, y: 0 } };
    match.status = 'running';

    return assignment;
  }

  getMatch(roomId: string): MatchState | undefined {
    return this.matches.get(roomId);
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

    if (
      target.x < 0 ||
      target.x >= GRID_SIZE ||
      target.y < 0 ||
      target.y >= GRID_SIZE
    ) {
      return null;
    }

    player.position = target;
    const seekerPos = match.players.seeker?.position;
    const hiderPos = match.players.hider?.position;
    if (
      seekerPos &&
      hiderPos &&
      seekerPos.x === hiderPos.x &&
      seekerPos.y === hiderPos.y
    ) {
      match.status = 'finished';
      match.winner = 'seeker';
      this.clearTimer(match.roomId);
    }
    return match;
  }

  private clearTimer(roomId: string) {
    const timer = this.timers.get(roomId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(roomId);
    }
  }

  startTimer(roomId: string, onTick: (match: MatchState) => void) {
    const match = this.matches.get(roomId);
    if (!match) return;
    // Never let two intervals tick the same match.
    this.clearTimer(roomId);
    match.timeRemaining = GAME_LENGTH_SECONDS;

    const timer = setInterval(() => {
      match.timeRemaining -= 1;
      if (match.timeRemaining <= 0) {
        match.status = 'finished';
        match.winner = 'hider';
        clearInterval(timer);
        this.timers.delete(roomId);
      }
      onTick(match);
    }, 1000);
    this.timers.set(roomId, timer);
  }

  handleDisconnect(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    this.socketAssignments.delete(socketId);
    if (!assignment) return null;

    const match = this.matches.get(assignment.roomId);
    if (!match) return null;

    if (
      this.waitingRoomId === assignment.roomId &&
      match.status === 'waiting'
    ) {
      this.waitingRoomId = null;
      this.matches.delete(assignment.roomId);
      return null;
    }

    this.clearTimer(match.roomId);
    if (match.status === 'running') {
      match.status = 'finished';
      match.winner = assignment.role === 'seeker' ? 'hider' : 'seeker';
    }
    // Free the leaver's slot so the remaining player can't restart a round
    // against a socket that no longer exists.
    match.players[assignment.role] = null;

    if (!match.players.seeker && !match.players.hider) {
      this.matches.delete(match.roomId);
      return null;
    }
    return match;
  }

  /**
   * Sends a player whose opponent has left back to matchmaking by tearing
   * down their finished room. Returns the room id they left, or null when
   * the opponent is still there (then `resetMatch` applies instead).
   */
  leaveAbandonedMatch(socketId: string): string | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;

    const match = this.matches.get(assignment.roomId);
    if (!match || match.status !== 'finished') return null;
    if (match.players.seeker && match.players.hider) return null;

    this.socketAssignments.delete(socketId);
    this.matches.delete(assignment.roomId);
    return assignment.roomId;
  }

  resetMatch(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;

    const match = this.matches.get(assignment.roomId);
    if (!match || !match.players.seeker || !match.players.hider) return null;
    // Only a finished round can be restarted; a second "play again" from the
    // other player must not reset the round that just started.
    if (match.status !== 'finished') return null;

    match.status = 'running';
    match.winner = null;
    match.players.hider.position = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };
    match.players.seeker.position = { x: 0, y: 0 };
    return match;
  }
}
