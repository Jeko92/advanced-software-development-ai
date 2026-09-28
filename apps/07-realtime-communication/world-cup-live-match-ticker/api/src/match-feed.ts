import { EventEmitter } from 'node:events';
import type { ReplayStep } from './espn.ts';
import type {
  FeedData,
  FeedEvent,
  FeedEventType,
  Pair,
  ScoreUpdate,
  StadiumStats,
} from './types.ts';

type Listener = (event: FeedEvent) => void;

export type FeedProgress = {
  nextIndex: number;
  clock: number;
  score: ScoreUpdate;
  stats: StadiumStats;
  history: FeedEvent[];
};

const HISTORY_LIMIT = 100;

const emptyPair = (): Pair => ({ home: 0, away: 0 });

export class MatchFeed {
  private readonly emitter = new EventEmitter();
  private readonly history: FeedEvent[] = [];
  private nextId = Date.now();
  private timer: NodeJS.Timeout | undefined;
  private score: ScoreUpdate = this.kickoffScore();
  private stats: StadiumStats = this.emptyStats();

  constructor(
    private readonly steps: ReplayStep[],
    private readonly options: {
      secondsPerMatchMinute: number;
      halftimePauseMs: number;
      fullTimePauseMs: number;
      onProgress?: ((progress: FeedProgress) => void) | undefined;
    },
  ) {
    this.emitter.setMaxListeners(0);
  }

  get viewers(): number {
    return this.emitter.listenerCount('event');
  }

  start(resume?: FeedProgress): void {
    if (!resume) {
      this.playFrom(0, 0);
      return;
    }

    this.score = resume.score;
    this.stats = { ...resume.stats, viewers: this.viewers };
    this.history.push(...resume.history);
    this.playFrom(resume.nextIndex, resume.clock);
  }

  stop(): void {
    clearTimeout(this.timer);
  }

  subscribe(listener: Listener): () => void {
    this.emitter.on('event', listener);
    this.publishStats();

    return () => {
      this.emitter.off('event', listener);
      this.publishStats();
    };
  }

  snapshot(): FeedEvent[] {
    const recentCommentary = this.history
      .filter((event) => event.type === 'match-commentary')
      .slice(-15);

    return [
      ...recentCommentary,
      this.stamp('score-update', this.score),
      this.stamp('stadium-stats', this.stats),
    ];
  }

  summary(): { score: Pair; clock: string; viewers: number } {
    const commentary = this.history.filter(
      (event) => event.type === 'match-commentary',
    );
    const latest = commentary.at(-1);
    const latestText =
      latest?.type === 'match-commentary' ? latest.data.text : '';

    let clock = 'KO';
    if (/^match ends/i.test(latestText)) {
      clock = 'FT';
    } else if (/^first half ends/i.test(latestText)) {
      clock = 'HT';
    } else {
      // Stop at kickoff: older lines belong to the previous run of the match.
      for (let i = commentary.length - 1; i >= 0; i--) {
        const event = commentary[i];
        if (event?.type !== 'match-commentary') continue;
        if (event.data.kind === 'kickoff') break;
        if (event.data.minute) {
          clock = event.data.minute;
          break;
        }
      }
    }

    return {
      score: { home: this.score.home, away: this.score.away },
      clock,
      viewers: this.viewers,
    };
  }

  eventsAfter(lastEventId: number): FeedEvent[] {
    return this.history.filter((event) => event.id > lastEventId);
  }

  private publish<T extends FeedEventType>(type: T, data: FeedData[T]): void {
    const event = this.stamp(type, data);

    this.history.push(event);
    if (this.history.length > HISTORY_LIMIT) {
      this.history.shift();
    }

    this.emitter.emit('event', event);
  }

  private playFrom(index: number, previousClock: number): void {
    const step = this.steps[index];

    if (!step) {
      this.timer = setTimeout(
        () => this.restart(),
        this.options.fullTimePauseMs,
      );
      return;
    }

    this.apply(step);

    const next = this.steps[index + 1];
    const clock = step.clockSeconds || previousClock;
    const delay = next ? this.delayBetween(step, clock, next) : 0;

    this.options.onProgress?.({
      nextIndex: index + 1,
      clock,
      score: this.score,
      stats: this.stats,
      history: this.history,
    });

    this.timer = setTimeout(() => this.playFrom(index + 1, clock), delay);
  }

  private delayBetween(
    step: ReplayStep,
    clock: number,
    next: ReplayStep,
  ): number {
    if (/^first half ends/i.test(step.text)) {
      return this.options.halftimePauseMs;
    }

    const matchSeconds = Math.max(0, (next.clockSeconds || clock) - clock);

    const scaled =
      (matchSeconds / 60) * this.options.secondsPerMatchMinute * 1000;

    const jitter = 250 + Math.random() * 1000;

    return Math.round(scaled + jitter);
  }

  private restart(): void {
    this.score = this.kickoffScore();
    this.stats = this.emptyStats();
    this.playFrom(0, 0);
  }

  private apply(step: ReplayStep): void {
    if (step.kind === 'kickoff') {
      this.score = this.kickoffScore();
      this.stats = this.emptyStats();
      this.publish('score-update', this.score);
      this.publishStats();
    }

    this.publish('match-commentary', {
      minute: step.minute,
      kind: step.kind,
      side: step.side,
      text: step.text,
    });

    if (step.kind === 'goal' && step.side) {
      this.score = {
        ...this.score,
        [step.side]: this.score[step.side] + 1,
        minute: step.minute,
        side: step.side,
        text: step.text,
      };
      this.publish('score-update', this.score);
    }

    if (this.countStats(step)) {
      this.publishStats();
    }
  }

  private countStats(step: ReplayStep): boolean {
    const { side } = step;
    if (!side) return false;

    const bump = (key: keyof Omit<StadiumStats, 'viewers'>) => {
      const pair = this.stats[key];
      this.stats = {
        ...this.stats,
        [key]: { ...pair, [side]: pair[side] + 1 },
      };
    };

    switch (step.kind) {
      case 'goal':
        bump('shots');
        bump('shotsOnTarget');
        return true;
      case 'shot':
        bump('shots');
        if (/on target|saved/i.test(step.text)) bump('shotsOnTarget');
        return true;
      case 'corner':
        bump('corners');
        return true;
      case 'foul':
        if (!/^foul by/i.test(step.text)) return false;
        bump('fouls');
        return true;
      case 'yellow-card':
        bump('yellowCards');
        return true;
      case 'red-card':
        bump('redCards');
        return true;
      case 'offside':
        bump('offsides');
        return true;
      default:
        return false;
    }
  }

  private publishStats(): void {
    this.stats = { ...this.stats, viewers: this.viewers };
    this.publish('stadium-stats', this.stats);
  }

  private stamp<T extends FeedEventType>(
    type: T,
    data: FeedData[T],
  ): FeedEvent {
    return { id: this.nextId++, type, data } as FeedEvent;
  }

  private kickoffScore(): ScoreUpdate {
    return { home: 0, away: 0, minute: '', side: null, text: 'Kick-off' };
  }

  private emptyStats(): StadiumStats {
    return {
      viewers: this.emitter.listenerCount('event'),
      shots: emptyPair(),
      shotsOnTarget: emptyPair(),
      corners: emptyPair(),
      fouls: emptyPair(),
      yellowCards: emptyPair(),
      redCards: emptyPair(),
      offsides: emptyPair(),
    };
  }
}
