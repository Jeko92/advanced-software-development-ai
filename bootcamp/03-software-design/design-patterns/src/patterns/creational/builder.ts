/**
 * Builder — assembling an object step by step instead of one long,
 * optional-heavy constructor call (the "telescoping constructor" problem).
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/creational-patterns.md
 *          ("Builder")
 *
 * Recreate the playlist query builder example.
 *
 * TODO:
 * - a `QueryFilters` type (`year`, `artist`, `minDuration`, `maxDuration`,
 *   `shuffle`, ...)
 * - `PlaylistQueryBuilder` with chained setters (`releasedAfter`,
 *   `byArtist`, `shorterThan`, `shuffled`, ...), each returning `this`
 * - `build(): PlaylistQuery` — the only place a `PlaylistQuery` gets
 *   constructed; validate cross-field rules here (e.g. `minDuration` must
 *   not exceed `maxDuration`) and throw if they're violated
 * - demonstrate chaining: `new PlaylistQueryBuilder().byArtist(...).shorterThan(...).shuffled().build()`
 */
interface QueryFilters {
  year: number;
  artist: string;
  minDuration: number;
  maxDuration: number;
  shuffle: boolean;
}

class PlaylistQuery {
  constructor(public readonly filters: Readonly<Partial<QueryFilters>>) {}
}

class PlaylistQueryBuilder {
  private filters: Partial<QueryFilters> = {};

  releasedAfter(year: number): this {
    this.filters.year = year;
    return this;
  }

  byArtist(name: string): this {
    this.filters.artist = name;
    return this;
  }

  longerThan(seconds: number): this {
    this.filters.minDuration = seconds;
    return this;
  }

  shorterThan(seconds: number): this {
    this.filters.maxDuration = seconds;
    return this;
  }

  shuffled(shuffle: boolean = true): this {
    this.filters.shuffle = shuffle;
    return this;
  }

  build(): PlaylistQuery {
    const { minDuration, maxDuration } = this.filters;

    if (
      minDuration !== undefined &&
      maxDuration !== undefined &&
      minDuration > maxDuration
    ) {
      throw new Error(
        `Invalid duration range: minDuration (${minDuration}s) cannot exceed maxDuration (${maxDuration}s).`,
      );
    }

    return new PlaylistQuery({ ...this.filters });
  }
}

const query = new PlaylistQueryBuilder()
  .byArtist('Daft Punk')
  .releasedAfter(2001)
  .longerThan(120)
  .shorterThan(240)
  .shuffled()
  .build();

console.log(query.filters);
