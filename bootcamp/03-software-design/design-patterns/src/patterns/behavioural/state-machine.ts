/**
 * State Machine — pinning an object to exactly one state at a time from a
 * fixed list, with a table of which transitions are legal, so invalid
 * combinations become impossible instead of something the team has to
 * remember.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/behavioural-patterns.md
 *          ("State Machines")
 *
 * Recreate the player state machine example.
 *
 * TODO:
 * - `PlayerState` union — `'idle' | 'loading' | 'playing' | 'paused'`
 * - `PlayerEvent` union — `'load' | 'ready' | 'pause' | 'resume' | 'stop' | 'error'`
 * - a `transitions` table: `Record<PlayerState, Partial<Record<PlayerEvent, PlayerState>>>`
 * - a `Player` class with a private `state` field and a
 *   `transition(event)` method that looks up the table and throws a clear
 *   error on an illegal transition
 * - call `transition` with both legal and illegal events and show the
 *   error message for the illegal one
 */
import assert from 'node:assert';

type PlayerState = 'idle' | 'loading' | 'playing' | 'paused';
type PlayerEvent = 'load' | 'ready' | 'pause' | 'resume' | 'stop' | 'error';

const transitions: Record<
  PlayerState,
  Partial<Record<PlayerEvent, PlayerState>>
> = {
  idle: { load: 'loading' },
  loading: { ready: 'playing', error: 'idle' },
  playing: { pause: 'paused', stop: 'idle' },
  paused: { resume: 'playing', stop: 'idle' },
};

class Player {
  private state: PlayerState = 'idle';

  getState(): PlayerState {
    return this.state;
  }

  transition(event: PlayerEvent): void {
    const next = transitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    this.state = next;
  }

  pause(): void {
    this.transition('pause');
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const player = new Player();
  assert.strictEqual(player.getState(), 'idle');

  player.transition('load');
  console.log('load ->', player.getState());
  assert.strictEqual(player.getState(), 'loading');

  player.transition('ready');
  console.log('ready ->', player.getState());
  assert.strictEqual(player.getState(), 'playing');

  player.pause();
  console.log('pause ->', player.getState());
  assert.strictEqual(player.getState(), 'paused');

  player.transition('resume');
  console.log('resume ->', player.getState());
  assert.strictEqual(player.getState(), 'playing');

  try {
    player.transition('load');
    console.error('❌ expected an error');
  } catch (error) {
    console.log('Illegal transition caught:', (error as Error).message);
  }

  assert.throws(
    () => player.transition('load'),
    /Illegal transition: load from playing/,
  );

  console.log(
    '🎉 Legal transitions succeeded, illegal ones threw a clear error',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
