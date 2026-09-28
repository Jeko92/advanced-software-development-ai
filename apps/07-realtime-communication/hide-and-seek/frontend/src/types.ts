export type Role = 'seeker' | 'hider';
export type GameStatus =
  'waiting' | 'ready-check' | 'countdown' | 'running' | 'finished';

export const COUNTDOWN_SECONDS = 3;

export interface Position {
  x: number;
  y: number;
}

export interface PlayerInfo {
  socketId: string;
  position: Position;
}

export interface MatchState {
  roomId: string;
  status: GameStatus;
  players: {
    seeker: PlayerInfo | null;
    hider: PlayerInfo | null;
  };
  timeRemaining: number;
  winner: Role | null;
  worldSize: WorldSize;
  difficulty: Difficulty;
  gridSize: number;
  gameLengthSeconds: number;
  observerCount: number;
  endReason: EndReason | null;
  ready: Record<Role, boolean>;
  countdown: number | null;
  swapRequestedBy: Role | null;
  wallEdges: string[];
}

export type WorldSize = 'small' | 'medium' | 'large';
export type Difficulty = 'easy' | 'normal' | 'hard';

export const WORLD_SIZES: Record<
  WorldSize,
  { label: string; gridSize: number; baseSeconds: number }
> = {
  small: { label: 'Small 10×10', gridSize: 10, baseSeconds: 60 },
  medium: { label: 'Medium 20×20', gridSize: 20, baseSeconds: 120 },
  large: { label: 'Large 30×30', gridSize: 30, baseSeconds: 180 },
};

export const DIFFICULTIES: Record<
  Difficulty,
  { label: string; timeFactor: number; wallPiecesPerRow: number }
> = {
  easy: { label: 'Easy', timeFactor: 1.25, wallPiecesPerRow: 0.8 },
  normal: { label: 'Normal', timeFactor: 1, wallPiecesPerRow: 1.5 },
  hard: { label: 'Hard', timeFactor: 0.75, wallPiecesPerRow: 2.5 },
};

export type ClientRole = Role | 'observer';
export type RoomError =
  | 'invalid-name'
  | 'name-taken'
  | 'invalid-settings'
  | 'not-found'
  | 'already-in-room';
export const ROOM_NAME_MAX_LENGTH = 24;

export interface RoomSummary {
  roomId: string;
  worldSize: WorldSize;
  difficulty: Difficulty;
  status: GameStatus;
  players: number;
  observers: number;
}

export type EndReason = 'caught' | 'timeout';

export function gameLengthFor(size: WorldSize, difficulty: Difficulty): number {
  return Math.round(
    WORLD_SIZES[size].baseSeconds * DIFFICULTIES[difficulty].timeFactor,
  );
}
