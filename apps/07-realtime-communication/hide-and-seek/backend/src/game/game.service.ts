import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  ClientRole,
  COUNTDOWN_SECONDS,
  DIFFICULTIES,
  Difficulty,
  EffectType,
  EndReason,
  GameMode,
  ITEM_EFFECT_SECONDS,
  gameLengthFor,
  MatchState,
  MatchView,
  Position,
  Role,
  NICKNAME_MAX_LENGTH,
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
  private observers = new Map<string, { roomId: string; name: string }>();
  private observerNumbers = new Map<string, number>();
  private matches = new Map<string, MatchState>();
  private readonly deltas: Record<string, Position> = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  private timers = new Map<string, NodeJS.Timeout>();
  private pausedAt = new Map<string, number>();
  private teleportsBy = new Map<string, Record<Role, number>>();

  getAssignment(socketId: string) {
    return this.socketAssignments.get(socketId);
  }

  viewFor(match: MatchState, role: Role): MatchView {
    const opponent: Role = role === 'seeker' ? 'hider' : 'seeker';
    const opponentInfo = match.players[opponent];
    const hideOpponent = match.status !== 'finished' && opponentInfo !== null;

    return {
      ...match,
      players: {
        ...match.players,
        [opponent]: hideOpponent
          ? { ...opponentInfo, position: null }
          : opponentInfo,
      },
      teleportCount: this.teleportsBy.get(match.roomId)?.[role] ?? 0,
      distanceHint: this.distanceHint(match),
    };
  }

  private distanceHint(match: MatchState): number | null {
    const { seeker, hider } = match.players;
    if (match.mode !== 'coop' || match.status !== 'running') return null;
    if (!seeker || !hider) return null;
    return (
      Math.abs(seeker.position.x - hider.position.x) +
      Math.abs(seeker.position.y - hider.position.y)
    );
  }

  observerIds(roomId: string): string[] {
    return [...this.observers]
      .filter(([, observer]) => observer.roomId === roomId)
      .map(([socketId]) => socketId);
  }

  getObserver(socketId: string) {
    return this.observers.get(socketId);
  }

  getMatch(roomId: string): MatchState | undefined {
    return this.matches.get(roomId);
  }

  createRoom(
    socketId: string,
    settings: {
      roomName: unknown;
      worldSize: unknown;
      difficulty: unknown;
      mode?: unknown;
    },
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
    const mode: GameMode = settings.mode === 'coop' ? 'coop' : 'classic';
    const gridSize = WORLD_SIZES[worldSize].gridSize;
    const gameLengthSeconds = gameLengthFor(worldSize, difficulty, mode);

    const match: MatchState = {
      roomId,
      status: 'waiting',
      worldSize,
      difficulty,
      mode,
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
      items: [],
      effects: { seeker: null, hider: null },
      portals: null,
      teleportCount: 0,
      pauseRequestedBy: null,
    };
    this.generateTerrain(match);
    this.socketAssignments.set(socketId, { roomId, role: 'seeker' });
    this.matches.set(roomId, match);
    this.teleportsBy.set(roomId, { seeker: 0, hider: 0 });
    return { roomId, role: 'seeker' };
  }

  joinRoom(
    socketId: string,
    rawName: unknown,
    rawNickname?: unknown,
  ):
    { roomId: string; role: ClientRole; name?: string } | { error: RoomError } {
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

    const number = (this.observerNumbers.get(roomId) ?? 0) + 1;
    this.observerNumbers.set(roomId, number);
    const nickname = String(rawNickname ?? '')
      .trim()
      .slice(0, NICKNAME_MAX_LENGTH);
    const name = nickname || `Observer ${number}`;
    this.observers.set(socketId, { roomId, name });
    match.observerCount++;
    return { roomId, role: 'observer', name };
  }

  applyMove(socketId: string, direction: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;

    const match = this.matches.get(assignment.roomId);
    if (!match || match.status !== 'running') return null;

    const delta = this.deltas[direction];
    if (!delta) return null;

    const { role } = assignment;
    const effect = this.activeEffect(match, role);
    if (effect?.type === 'frozen') return null;

    const steps = effect?.type === 'speedBoost' ? 2 : 1;
    let moved = false;
    for (let i = 0; i < steps && match.status === 'running'; i++) {
      if (!this.movePlayer(match, role, delta)) break;
      moved = true;
    }
    return moved ? match : null;
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
        this.finishMeeting(match);
        break;
      }
      this.collectItem(match, role);

      const exit = this.portalExit(next, match);
      if (exit) {
        player.position = exit;
        match.teleportCount++;
        const teleports = this.teleportsBy.get(match.roomId);
        if (teleports) teleports[role]++;
        if (this.isCaught(match)) {
          this.finishMeeting(match);
        } else {
          this.collectItem(match, role);
        }
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
    match.timeRemaining = match.gameLengthSeconds;
    this.spawnItem(match);
    this.runClock(match, onTick);
  }

  private runClock(match: MatchState, onTick: (match: MatchState) => void) {
    this.clearTimer(match.roomId);
    const { spawnEverySeconds } = DIFFICULTIES[match.difficulty];
    let ticks = 0;

    const timer = setInterval(() => {
      ticks++;
      if (match.timeRemaining !== null) match.timeRemaining -= 1;
      if (match.timeRemaining !== null && match.timeRemaining <= 0) {
        this.finishMatch(
          match,
          match.mode === 'coop' ? null : 'hider',
          'timeout',
        );
      } else {
        this.tickEffects(match);
        if (ticks % spawnEverySeconds === 0) this.spawnItem(match);
      }
      onTick(match);
    }, 1000);
    this.timers.set(match.roomId, timer);
  }

  leaveRoom(
    socketId: string,
  ):
    | { kind: 'room-closed'; roomId: string }
    | { kind: 'observer-left'; match: MatchState }
    | null {
    const observer = this.observers.get(socketId);
    if (observer) {
      this.observers.delete(socketId);
      const match = this.matches.get(observer.roomId);
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
      mode: m.mode,
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

  requestPause(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || match.status !== 'running' || match.pauseRequestedBy) {
      return null;
    }
    match.pauseRequestedBy = assignment.role;
    return match;
  }

  respondToPause(socketId: string, accepted: boolean): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || !match.pauseRequestedBy) return null;
    if (match.pauseRequestedBy === assignment.role) return null;

    match.pauseRequestedBy = null;
    if (accepted && match.status === 'running') {
      match.status = 'paused';
      match.ready = { seeker: false, hider: false };
      this.clearTimer(match.roomId);
      this.pausedAt.set(match.roomId, Date.now());
    }
    return match;
  }

  resume(socketId: string): MatchState | null {
    const assignment = this.socketAssignments.get(socketId);
    if (!assignment) return null;
    const match = this.matches.get(assignment.roomId);
    if (!match || match.status !== 'paused') return null;
    match.ready[assignment.role] = true;
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

  startCountdown(
    roomId: string,
    onTick: (match: MatchState) => void,
    mode: 'start' | 'resume' = 'start',
  ) {
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
      this.shiftEffectsPastPause(match);
      if (mode === 'start') this.startTimer(roomId, onTick);
      else this.runClock(match, onTick);
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
    match.items = [];
    match.effects = { seeker: null, hider: null };
    match.teleportCount = 0;
    this.teleportsBy.set(match.roomId, { seeker: 0, hider: 0 });
    match.pauseRequestedBy = null;
    this.generateTerrain(match);
  }

  private collectItem(match: MatchState, role: Role) {
    const { position } = match.players[role]!;
    const index = match.items.findIndex(
      (i) => i.position.x === position.x && i.position.y === position.y,
    );
    if (index === -1) return;
    const [item] = match.items.splice(index, 1);

    if (item.type === 'speedBoost') {
      this.giveEffect(
        match,
        role,
        'speedBoost',
        ITEM_EFFECT_SECONDS.speedBoost,
      );
    } else if (item.type === 'freeze') {
      const opponent: Role = role === 'seeker' ? 'hider' : 'seeker';
      this.giveEffect(match, opponent, 'frozen', ITEM_EFFECT_SECONDS.freeze);
    } else if (match.timeRemaining !== null) {
      match.timeRemaining =
        role === 'hider'
          ? match.timeRemaining + ITEM_EFFECT_SECONDS.clock
          : Math.max(5, match.timeRemaining - ITEM_EFFECT_SECONDS.clock);
    }
  }

  private giveEffect(
    match: MatchState,
    role: Role,
    type: EffectType,
    seconds: number,
  ) {
    match.effects[role] = {
      type,
      secondsLeft: seconds,
      endsAt: Date.now() + seconds * 1000,
    };
  }

  private activeEffect(match: MatchState, role: Role) {
    const effect = match.effects[role];
    return effect && effect.endsAt > Date.now() ? effect : null;
  }

  private tickEffects(match: MatchState) {
    const now = Date.now();
    for (const role of ['seeker', 'hider'] as const) {
      const effect = match.effects[role];
      if (!effect) continue;
      if (effect.endsAt <= now) {
        match.effects[role] = null;
      } else {
        effect.secondsLeft = Math.ceil((effect.endsAt - now) / 1000);
      }
    }
  }

  private shiftEffectsPastPause(match: MatchState) {
    const pausedAt = this.pausedAt.get(match.roomId);
    if (pausedAt === undefined) return;
    this.pausedAt.delete(match.roomId);
    const pausedFor = Date.now() - pausedAt;
    for (const role of ['seeker', 'hider'] as const) {
      const effect = match.effects[role];
      if (effect) effect.endsAt += pausedFor;
    }
  }

  private spawnItem(match: MatchState) {
    if (match.mode === 'coop') return;
    const rules = DIFFICULTIES[match.difficulty];
    if (match.items.length >= rules.maxItems) return;

    const minSpacing = Math.max(2, Math.floor(match.gridSize / 3));
    const players = [match.players.seeker, match.players.hider]
      .filter((p) => p !== null)
      .map((p) => p.position);
    const occupied = new Set(
      [
        ...players,
        ...match.iceCells,
        ...(match.portals ?? []),
        ...match.items.map((i) => i.position),
      ].map((p) => `${p.x},${p.y}`),
    );
    const keepAway = [...players, ...match.items.map((i) => i.position)];

    const candidates: Position[] = [];
    for (let y = 0; y < match.gridSize; y++) {
      for (let x = 0; x < match.gridSize; x++) {
        if (!occupied.has(`${x},${y}`)) candidates.push({ x, y });
      }
    }

    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const position = candidates.find((c) =>
      keepAway.every(
        (p) => Math.abs(p.x - c.x) + Math.abs(p.y - c.y) >= minSpacing,
      ),
    );
    if (!position) return;

    const types =
      match.gameLengthSeconds === null
        ? rules.itemTypes.filter((t) => t !== 'clock')
        : rules.itemTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    match.items.push({ id: randomUUID(), type, position });
  }

  private generateTerrain(match: MatchState) {
    const start = startPositions(match.gridSize);
    if (match.mode === 'coop') {
      match.wallEdges = this.generateMaze(match);
      match.iceCells = this.generateIceCells(match, [
        start.seeker,
        start.hider,
      ]);
      match.portals = null;
      return;
    }
    match.wallEdges = this.generateWalls(match, [start.seeker, start.hider]);
    match.iceCells = this.generateIceCells(match, [start.seeker, start.hider]);
    match.portals = this.generatePortals(match, [
      start.seeker,
      start.hider,
      ...match.iceCells,
    ]);
  }

  private generateMaze(match: MatchState): string[] {
    const { gridSize } = match;
    const key = (p: Position) => `${p.x},${p.y}`;
    const open = new Set<string>();
    const visited = new Set<string>(['0,0']);
    const stack: Position[] = [{ x: 0, y: 0 }];

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const unvisited = this.neighbors(current, gridSize).filter(
        (n) => !visited.has(key(n)),
      );
      if (unvisited.length === 0) {
        stack.pop();
        continue;
      }
      const next = unvisited[Math.floor(Math.random() * unvisited.length)];
      open.add(this.edgeKey(current, next));
      visited.add(key(next));
      stack.push(next);
    }

    const walls: string[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        for (const n of [
          { x: x + 1, y },
          { x, y: y + 1 },
        ]) {
          if (!this.isInBounds(n, gridSize)) continue;
          const edge = this.edgeKey({ x, y }, n);
          if (!open.has(edge)) walls.push(edge);
        }
      }
    }

    for (let i = walls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [walls[i], walls[j]] = [walls[j], walls[i]];
    }
    const openings = Math.floor(
      walls.length * DIFFICULTIES[match.difficulty].mazeOpenings,
    );
    return walls.slice(openings);
  }

  private generatePortals(
    match: MatchState,
    avoid: Position[],
  ): [Position, Position] | null {
    const { gridSize } = match;
    const avoidKeys = new Set(avoid.map((p) => `${p.x},${p.y}`));
    const randomCell = () => ({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    });

    for (let attempt = 0; attempt < 200; attempt++) {
      const a = randomCell();
      const b = randomCell();
      if (avoidKeys.has(`${a.x},${a.y}`) || avoidKeys.has(`${b.x},${b.y}`)) {
        continue;
      }
      if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) >= gridSize) return [a, b];
    }
    return null;
  }

  private portalExit(pos: Position, match: MatchState): Position | null {
    if (!match.portals) return null;
    const [a, b] = match.portals;
    if (a.x === pos.x && a.y === pos.y) return b;
    if (b.x === pos.x && b.y === pos.y) return a;
    return null;
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
    if (match.mode === 'coop') return false;
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
    this.pausedAt.delete(roomId);
    this.teleportsBy.delete(roomId);
    const match = this.matches.get(roomId);
    this.matches.delete(roomId);
    for (const player of [match?.players.seeker, match?.players.hider]) {
      if (player) this.socketAssignments.delete(player.socketId);
    }
    this.observerNumbers.delete(roomId);
    for (const [socketId, observer] of this.observers) {
      if (observer.roomId === roomId) this.observers.delete(socketId);
    }
  }

  private finishMeeting(match: MatchState) {
    if (match.mode === 'coop') this.finishMatch(match, 'team', 'met');
    else this.finishMatch(match, 'seeker', 'caught');
  }

  private finishMatch(
    match: MatchState,
    winner: Role | 'team' | null,
    reason: EndReason,
  ) {
    match.status = 'finished';
    match.winner = winner;
    match.endReason = reason;
    match.pauseRequestedBy = null;
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
