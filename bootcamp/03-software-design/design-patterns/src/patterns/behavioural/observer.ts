/**
 * Observer — one object (the subject) announces that something happened,
 * and any number of subscribers react, without the subject knowing who
 * they are.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/behavioural-patterns.md
 *          ("Observer")
 *
 * Recreate the `MusicPlayer` event bus example.
 *
 * TODO:
 * - a `PlayerEvent` discriminated union (e.g. `{ type: 'track.played';
 *   track: string }`, `{ type: 'track.finished'; track: string }`)
 * - a `Listener` type — `(event: PlayerEvent) => void`
 * - `MusicPlayer` (or `MusicPlayerBus`) with `subscribe(listener)` and
 *   `emit(event)`
 * - subscribe a couple of independent listeners and `emit` a few events to
 *   show they all react without `MusicPlayer` knowing about them
 */
import assert from 'node:assert';

type PlayerEvent =
  | { type: 'track.played'; track: string }
  | { type: 'track.finished'; track: string };

type Listener = (event: PlayerEvent) => void;

class MusicPlayer {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  emit(event: PlayerEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const player = new MusicPlayer();

  // Two independent listeners standing in for unrelated systems
  // (scrobbling, UI) that a naive Player would otherwise take as
  // constructor dependencies just to keep them informed.
  player.subscribe((event) => {
    if (event.type === 'track.played') {
      console.log('[scrobbler] Now playing:', event.track);
    }
  });

  player.subscribe((event) => {
    if (event.type === 'track.finished') {
      console.log('[ui] Track finished:', event.track);
    }
  });

  const received: PlayerEvent[] = [];
  player.subscribe((event) => received.push(event));

  player.emit({ type: 'track.played', track: 'Bohemian Rhapsody' });
  player.emit({ type: 'track.finished', track: 'Bohemian Rhapsody' });
  player.emit({ type: 'track.played', track: 'Stairway to Heaven' });

  assert.strictEqual(received.length, 3);
  assert.deepStrictEqual(received[0], {
    type: 'track.played',
    track: 'Bohemian Rhapsody',
  });
  assert.deepStrictEqual(received[1], {
    type: 'track.finished',
    track: 'Bohemian Rhapsody',
  });
  assert.deepStrictEqual(received[2], {
    type: 'track.played',
    track: 'Stairway to Heaven',
  });
  console.log(
    '🎉 All three listeners reacted independently to every emitted event',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
