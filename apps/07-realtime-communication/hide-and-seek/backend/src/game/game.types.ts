export type Role = 'seeker' | 'hider';
export type GameStatus =
  'waiting' | 'ready-check' | 'countdown' | 'running' | 'paused' | 'finished';

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
  timeRemaining: number | null;
  winner: Role | null;
  worldSize: WorldSize;
  difficulty: Difficulty;
  gridSize: number;
  gameLengthSeconds: number | null;
  observerCount: number;
  endReason: EndReason | null;
  ready: Record<Role, boolean>;
  countdown: number | null;
  swapRequestedBy: Role | null;
  wallEdges: string[];
  iceCells: Position[];
  items: Item[];
  effects: Record<Role, ActiveEffect | null>;
  portals: [Position, Position] | null;
  teleportCount: number;
  pauseRequestedBy: Role | null;
}

export type WorldSize = 'small' | 'medium' | 'large';
export type Difficulty = 'easy' | 'normal' | 'hard';

export const WORLD_SIZES: Record<
  WorldSize,
  { label: string; gridSize: number; baseSeconds: number | null }
> = {
  small: { label: 'Small 10×10', gridSize: 10, baseSeconds: 60 },
  medium: { label: 'Medium 20×20', gridSize: 20, baseSeconds: 120 },
  large: { label: 'Large 30×30', gridSize: 30, baseSeconds: null },
};

export type ItemType = 'speedBoost' | 'freeze' | 'clock';

export interface Item {
  id: string;
  type: ItemType;
  position: Position;
}

export type EffectType = 'speedBoost' | 'frozen';

export interface ActiveEffect {
  type: EffectType;
  secondsLeft: number;
  endsAt: number;
}

export const ITEM_EFFECT_SECONDS = {
  speedBoost: 5,
  freeze: 3,
  clock: 10,
} as const;

export const DIFFICULTIES: Record<
  Difficulty,
  {
    label: string;
    timeFactor: number;
    wallPiecesPerRow: number;
    iceCellsPerRow: number;
    itemTypes: ItemType[];
    spawnEverySeconds: number;
    maxItems: number;
  }
> = {
  easy: {
    label: 'Easy',
    timeFactor: 1.25,
    wallPiecesPerRow: 0.8,
    iceCellsPerRow: 0.3,
    itemTypes: ['speedBoost', 'clock'],
    spawnEverySeconds: 10,
    maxItems: 2,
  },
  normal: {
    label: 'Normal',
    timeFactor: 1,
    wallPiecesPerRow: 1.5,
    iceCellsPerRow: 0.8,
    itemTypes: ['speedBoost', 'freeze', 'clock'],
    spawnEverySeconds: 8,
    maxItems: 3,
  },
  hard: {
    label: 'Hard',
    timeFactor: 0.75,
    wallPiecesPerRow: 2.5,
    iceCellsPerRow: 1.2,
    itemTypes: ['speedBoost', 'freeze', 'clock'],
    spawnEverySeconds: 5,
    maxItems: 5,
  },
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

export function gameLengthFor(
  size: WorldSize,
  difficulty: Difficulty,
): number | null {
  const base = WORLD_SIZES[size].baseSeconds;
  if (base === null) return null;
  return Math.round(base * DIFFICULTIES[difficulty].timeFactor);
}

export const CHAT_MESSAGE_MAX_LENGTH = 200;

export interface ChatMessage {
  from: Role;
  text: string;
  sentAt: number;
}

export interface PlayerView {
  socketId: string;
  position: Position | null;
}

export type MatchView = Omit<MatchState, 'players'> & {
  players: Record<Role, PlayerView | null>;
};
