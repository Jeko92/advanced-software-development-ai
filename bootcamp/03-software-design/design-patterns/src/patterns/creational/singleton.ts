/**
 * Singleton — guaranteeing exactly one instance of something exists for the
 * whole program, reached through a static accessor.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/creational-patterns.md
 *          ("Singleton", "Where Singleton goes wrong")
 *
 * Recreate the `AudioEngine` example — a genuine singleton use case, since
 * it owns a real resource (the sound card) that can't be shared.
 *
 * TODO:
 * - `AudioEngine` with a `private` constructor (so `new AudioEngine()` is
 *   impossible from outside) and a `private static instance` field
 * - `static initialize(sampleRate: number): AudioEngine` — throws if
 *   already initialized
 * - `static getInstance(): AudioEngine` — throws if not initialized yet
 * - a `play(buffer: AudioFrame[])` method (a stub log is fine)
 * - show two different call sites both reaching the same instance via
 *   `AudioEngine.getInstance()`
 *
 */
import assert from 'node:assert';

export interface AudioFrame {
  channelLeft: number;
  channelRight: number;
}

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private constructor(private readonly sampleRate: number) {}

  static initialize(sampleRate: number): AudioEngine {
    if (this.instance) {
      throw new Error('AudioEngine is already initialized');
    }
    this.instance = new AudioEngine(sampleRate);
    return this.instance;
  }

  static getInstance(): AudioEngine {
    if (!this.instance) {
      throw new Error('AudioEngine must be initialized first');
    }
    return this.instance;
  }

  play(buffer: AudioFrame[]): void {
    console.log(
      `Playing ${buffer.length} audio frame(s) at ${this.sampleRate} Hz`,
    );
  }
}

// Only self-run this demo when the file is executed directly (e.g. via
// `tsx singleton.ts`) — not when another file imports AudioEngine, so
// importers don't inherit this module's console output or its
// already-initialized singleton as a surprising side effect.
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    AudioEngine.getInstance();

    console.error('❌ Test 1 failed: expected an error');
  } catch (error) {
    console.log('Test 1 — expected error:');
    console.error(error);
  }

  assert.throws(
    () => AudioEngine.getInstance(),
    /AudioEngine must be initialized first/,
  );

  const engine = AudioEngine.initialize(44100);

  assert.ok(engine instanceof AudioEngine);
  console.log(`Test 2 ${engine instanceof AudioEngine}`);

  const instance = AudioEngine.getInstance();

  assert.strictEqual(instance, engine);
  console.log(`Test 3 ${assert.strictEqual(instance, engine)}`);

  try {
    AudioEngine.initialize(48000);

    console.error('❌ Test 4 failed: expected an error');
  } catch (error) {
    console.log('Test 4 — expected error:');
    console.error(error);
  }

  assert.throws(
    () => AudioEngine.initialize(48000),
    /AudioEngine is already initialized/,
  );

  const callSiteA = AudioEngine.getInstance();
  const callSiteB = AudioEngine.getInstance();

  assert.strictEqual(callSiteA, callSiteB);
  assert.strictEqual(callSiteA, engine);

  const buffer: AudioFrame[] = [
    {
      channelLeft: 0.5,
      channelRight: 0.5,
    },
    {
      channelLeft: 0.2,
      channelRight: 0.8,
    },
  ];

  assert.doesNotThrow(() => {
    engine.play(buffer);
  });

  assert.doesNotThrow(() => {
    engine.play([]);
  });

  console.log('🎉 All Singleton tests passed!');
}
