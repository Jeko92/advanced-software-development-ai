/**
 * Repository — hiding how data is stored behind a method surface written in
 * domain language, so the rest of the program never talks to SQL directly.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/structural-patterns.md
 *          ("Repository")
 *
 * Recreate the `TrackRepository` example with two implementations.
 *
 * TODO:
 * - a `Track` type (`id`, `title`, `artist`, `format`)
 * - a `TrackRepository` interface — `findById`, `findByArtist`, `save`
 * - `PostgresTrackRepository implements TrackRepository` (a fake/mock
 *   client is fine, no real database needed here)
 * - `InMemoryTrackRepository implements TrackRepository`, backed by a
 *   `Map<number, Track>`
 * - a small piece of code that depends only on the `TrackRepository`
 *   interface, and demonstrate it working against both implementations
 */

import { Pool } from 'pg';

export type Track = {
  id: string;
  title: string;
  artist: string;
  format: string;
};

export interface TrackRepository {
  findById(id: string): Promise<Track | null>;
  findByArtist(artist: string): Promise<Track[]>;
  save(track: Track): Promise<void>;
}

export class PostgresTrackRepository implements TrackRepository {
  constructor(private readonly pg: Pool) {}

  async findById(id: string): Promise<Track | null> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await this.pg.query(
      'SELECT id, title, artist, format FROM tracks WHERE id = $1',
      [id],
    );

    return rows[0] ?? null;
  }

  async findByArtist(artist: string): Promise<Track[]> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await this.pg.query(
      'SELECT id, title, artist, format FROM tracks WHERE artist = $1',
      [artist],
    );

    return rows ?? [];
  }

  async save(track: Track): Promise<void> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    await this.pg.query(
      'INSERT INTO tracks (id, title, artist, format) VALUES ($1, $2, $3, $4)',
      [track.id, track.title, track.artist, track.format],
    );
  }
}

export class InMemoryTrackRepository implements TrackRepository {
  constructor(private readonly db: Map<string, Track> = new Map()) {}

  async findById(id: string): Promise<Track | null> {
    return this.db.get(id) ?? null;
  }

  async findByArtist(artist: string): Promise<Track[]> {
    return [...this.db.values()].filter((track) => track.artist === artist);
  }

  async save(track: Track): Promise<void> {
    this.db.set(track.id, track);
  }
}

// ---- Demonstration: code that depends only on TrackRepository -----------

async function demonstrateRepository(
  repo: TrackRepository,
  label: string,
): Promise<void> {
  console.log(`\n=== ${label} ===`);

  const tracks: Track[] = [
    { id: '1', title: 'Clair de Lune', artist: 'Debussy', format: 'flac' },
    { id: '2', title: 'Gymnopédie No. 1', artist: 'Satie', format: 'mp3' },
    { id: '3', title: 'Arabesque No. 1', artist: 'Debussy', format: 'wav' },
  ];

  for (const track of tracks) {
    await repo.save(track);
    console.log(`saved -> [${track.id}] ${track.title}`);
  }

  const found = await repo.findById('1');
  console.log('findById(1) ->', found);

  const byArtist = await repo.findByArtist('Debussy');
  console.log(`findByArtist(Debussy) -> ${byArtist.length} track(s)`, byArtist);

  const missing = await repo.findById('does-not-exist');
  console.log('findById(does-not-exist) ->', missing);
}

async function main(): Promise<void> {
  await demonstrateRepository(
    new InMemoryTrackRepository(),
    'InMemoryTrackRepository',
  );

  try {
    await demonstrateRepository(
      new PostgresTrackRepository(
        new Pool({ connectionString: 'postgres://localhost:5432/tracks' }),
      ),
      'PostgresTrackRepository',
    );
  } catch (error) {
    console.log(
      'PostgresTrackRepository failed, as expected without a real database:',
      (error as Error).message,
    );
  }
}

// Only self-run this demo when the file is executed directly — not when
// another file imports these repositories, so importers don't inherit
// this module's console output as a surprising side effect.
if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
