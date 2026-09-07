/**
 * Dependency Injection — a class never constructs its own dependencies;
 * they're passed in from outside (almost always through the constructor),
 * so the class only has to know the interface it depends on.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/structural-patterns.md
 *          ("Dependency Injection")
 *
 * Recreate the `PlayerService` example, built on top of
 * ./repository.ts's `TrackRepository` and ./singleton.ts's `AudioEngine`.
 *
 * TODO:
 * - `PlayerService` with a constructor taking `(tracks: TrackRepository,
 *   engine: AudioEngine)` — both typed as interfaces/the singleton type,
 *   never constructed inside the class
 * - a `play(trackId: number)` method that looks up the track and plays it
 * - a composition root: one block of wiring code that builds a "production"
 *   `PlayerService` (real repository + real engine) and another that builds
 *   a "test" one (in-memory repository + a fake engine object)
 */
import assert from 'node:assert';
import { Pool } from 'pg';
import { AudioEngine, type AudioFrame } from '../creational/singleton';
import {
  InMemoryTrackRepository,
  PostgresTrackRepository,
  type Track,
  type TrackRepository,
} from './repository.ts';

class PlayerService {
  constructor(
    private readonly tracks: TrackRepository,
    private readonly engine: AudioEngine,
  ) {}

  async play(trackId: string): Promise<void> {
    const track = await this.tracks.findById(trackId);

    if (!track) {
      console.log(`Track ${trackId} not found`);
      return;
    }

    // No real audio decoding here — a single placeholder frame stands in
    // for "the decoded audio data for this track" (Track and AudioFrame
    // describe unrelated things: metadata vs. raw samples).
    const buffer: AudioFrame[] = [{ channelLeft: 0, channelRight: 0 }];
    this.engine.play(buffer);
    console.log(`Now playing: ${track.title} by ${track.artist}`);
  }
}

// ---- Composition root -----------------------------------------------------
const productionPlayer = new PlayerService(
  new PostgresTrackRepository(
    new Pool({ connectionString: 'postgres://localhost:5432/tracks' }),
  ),
  AudioEngine.initialize(44100),
);

const playedFrames: AudioFrame[][] = [];
const fakeEngine = {
  play: (buffer: AudioFrame[]) => {
    playedFrames.push(buffer);
  },
} as unknown as AudioEngine;

const testTracks = new InMemoryTrackRepository();
const testTrack: Track = {
  id: 'test-1',
  title: 'Test Track',
  artist: 'Test Artist',
  format: 'mp3',
};

async function main(): Promise<void> {
  await testTracks.save(testTrack);
  const testPlayer = new PlayerService(testTracks, fakeEngine);

  await testPlayer.play(testTrack.id);
  assert.strictEqual(playedFrames.length, 1);
  console.log('Test passed: fake engine received the played buffer');

  await testPlayer.play('does-not-exist');
  assert.strictEqual(playedFrames.length, 1);
  console.log('Test passed: missing track never reaches the engine');

  try {
    await productionPlayer.play('1');
  } catch (error) {
    console.log(
      'Production PlayerService failed, as expected without a real database:',
      (error as Error).message,
    );
  }

  console.log('🎉 PlayerService works with both real and fake dependencies');
}

void main();
