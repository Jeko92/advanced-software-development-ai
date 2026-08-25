/**
 * Strategy — storing an algorithm inside an object so the caller can swap
 * one algorithm for another at runtime, instead of growing a mode-flag
 * if/else chain.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/behavioural-patterns.md
 *          ("Strategy")
 *
 * Recreate the playback strategy example.
 *
 * TODO:
 * - `PlaybackStrategy` interface — `next(currentIndex, playlistLength): number`
 * - `Sequential` and `Shuffle` classes implementing it
 * - a `Player` that holds a `strategy: PlaybackStrategy`, exposes
 *   `setStrategy(strategy)`, and delegates `nextTrack(...)` to it
 * - demonstrate swapping strategies at runtime, e.g.
 *   `player.setStrategy(new Shuffle())`, and show the behaviour change
 */
import assert from 'node:assert';

interface PlaybackStrategy {
  next(currentIndex: number, playlistLength: number): number;
}

class Sequential implements PlaybackStrategy {
  next(currentIndex: number, playlistLength: number): number {
    return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
  }
}

class Shuffle implements PlaybackStrategy {
  next(_currentIndex: number, playlistLength: number): number {
    return Math.floor(Math.random() * playlistLength);
  }
}

class Player {
  constructor(private strategy: PlaybackStrategy) {}

  setStrategy(strategy: PlaybackStrategy): void {
    this.strategy = strategy;
  }

  nextTrack(currentIndex: number, playlistLength: number): number {
    return this.strategy.next(currentIndex, playlistLength);
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const playlistLength = 5;
  const player = new Player(new Sequential());

  console.log('--- Sequential ---');
  const sequentialResults = [0, 1, 2, 3, 4].map((i) =>
    player.nextTrack(i, playlistLength),
  );
  console.log(sequentialResults);
  assert.deepStrictEqual(sequentialResults, [1, 2, 3, 4, -1]);
  console.log('Test passed: Sequential walks forward, then signals the end\n');

  console.log('--- Shuffle (same Player, swapped strategy) ---');
  player.setStrategy(new Shuffle());
  const shuffleResults = Array.from({ length: 5 }, () =>
    player.nextTrack(0, playlistLength),
  );
  console.log(shuffleResults);
  assert.ok(shuffleResults.every((n) => n >= 0 && n < playlistLength));
  console.log('Test passed: Shuffle always returns a valid in-range index');

  console.log(
    '🎉 Player behavior changed at runtime just by swapping the strategy',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
