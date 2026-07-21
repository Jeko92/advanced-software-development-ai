# TypeScript Basics - Challenges

## Code Along: Music Library

This code along builds a small music library application from scratch, one concept at a time. Each part maps directly to the session material. By the end you have a working multi-file TypeScript project with typed data, interfaces, and module boundaries.

### Part 1: Install TypeScript and compile a file

Install the TypeScript compiler globally:

```bash
npm install -g typescript
```

Confirm the installation worked:

```bash
tsc -v
```

You should see the version number as the output, something like `4.7.4`.

Create a file called `hello.ts` in an empty directory:

```typescript
const greeting: string = "Hello from TypeScript!";
console.log(greeting);
```

Compile it and run the output:

```bash
tsc hello.ts
node hello.js
```

Open `hello.js` and compare it to `hello.ts`. The `: string` annotation is gone. The emitted file is plain JavaScript.

### Part 2: Set up a project

Create this folder structure:

```text
music-library/
  src/
  dist/
  tsconfig.json
```

Add the `tsconfig.json` from the basic setup.

### Part 3: Type annotations and aliases

Create `src/index.ts`. Add annotated variables and a type alias for the core data model:

```typescript
type TrackId = number;
type ArtistName = string;

type Track = {
  id: TrackId;
  title: string;
  artist: ArtistName;
  liked: boolean;
};

function describeTrack(track: Track): string {
  return `${track.title} by ${track.artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

console.log(describeTrack(tracks[0]));
```

Compile and run:

```bash
tsc
node dist/tracks.js
```

Now deliberately add a type error. Remove `liked: true` from the first track run `tsc` again. Read the error, then fix it before continuing.

### Part 4: Type inference

Add the following block to `src/index.ts`:

```typescript
const label = "My Library";
const trackCount = tracks.length;

function formatId(id: number): string {
  return `TRK-${id}`;
}

const ids = tracks.map((t) => formatId(t.id));
console.log(ids, label, trackCount);
```

None of these need explicit annotations. Hover over `label`, `trackCount`, `ids`, and the `t` parameter in your editor to confirm what TypeScript inferred.

Then add this line and try to compile:

```typescript
const count: string = trackCount;
```

The error reports the inferred type of `trackCount`. Remove the line before moving on.

### Part 5: Interfaces

Replace the `Track` type alias with an interface and extend it with a more specific shape. Remove the old `type Track` declaration and add:

```typescript
interface Media {
  id: number;
  title: string;
}

interface Track extends Media {
  artist: string;
  liked: boolean;
}

interface FeaturedTrack extends Track {
  curatedBy: string;
  readonly addedDate: string;
}
```

The `tracks` array already uses `Track`, so nothing there needs to change. Add a `FeaturedTrack` object:

```typescript
const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

console.log(`${pick.title} — featured since ${pick.addedDate}`);
```

Try reassigning `pick.addedDate` after the object is created and observe the compiler error. Remove that line before continuing.

### Part 6: ES modules

Split the project into separate files. Create `src/types.ts` and move the interfaces and `formatId` into it:

```typescript
// src/types.ts
export interface Media {
  id: number;
  title: string;
}

export interface Track extends Media {
  artist: string;
  liked: boolean;
}

export interface FeaturedTrack extends Track {
  curatedBy: string;
  readonly addedDate: string;
}

export function formatId(id: number): string {
  return `TRK-${id}`;
}
```

Create `src/main.ts` as the new entry point. Import the runtime function with a regular import and the interfaces with type-only imports:

```typescript
// src/main.ts
import { formatId } from "./track.js";
import type { Track, FeaturedTrack } from "./track.js";

const libraryName = "Late Night Listening";

function describeTrack(title: string, artist: string): string {
  return `${title} by ${artist}`;
}

const tracks: Track[] = [
  { id: 1, title: "Blue Light", artist: "Jorja Smith", liked: true },
  { id: 2, title: "Nights", artist: "Frank Ocean", liked: false },
];

const pick: FeaturedTrack = {
  id: 3,
  title: "Golden",
  artist: "Jill Scott",
  liked: true,
  curatedBy: "editorial",
  addedDate: "2024-01-15",
};

console.log(`Library: ${libraryName}`);
console.log(describeTrack(tracks[0]));
tracks.forEach((t) => console.log(formatId(t.id)));
console.log(`Featured: ${pick.title} — added ${pick.addedDate}`);
```

Delete `src/index.ts`. Compile and run the new entry point:

```bash
tsc
node dist/main.js
```

If the import paths are missing the `.js` extension, you will see a module-not-found error at runtime even though compilation succeeds. Check that your specifiers match the pattern `"./track.js"`.

## Recipe Book

Create a single TypeScript file called `recipes.ts`. Using only what you have learned so far — type annotations, type aliases, and function signatures — implement the following:

- A type alias `Ingredient` with a `name` (string) and `amountGrams` (number)
- A type alias `Recipe` with a `name`, `servings` (number), `vegetarian` (boolean), and `ingredients` (an array of `Ingredient`)
- Two variables annotated as `Recipe`, each holding a realistic recipe with at least two ingredients
- A function `summarize(recipe: Recipe): string` that returns a readable single-line description of the recipe
- A call to `summarize` for each recipe, logged to the console

Compile and run:

```bash
tsc recipes.ts
node recipes.js
```

The compiler must exit without errors. Hover over your variables in the editor and confirm the inferred types match what you declared.

## Film Watchlist

Model a film watchlist in TypeScript. The requirements are:

- A `Watchable` base interface with a readonly `id`, a `title`, and a `year`
- A `Film` interface extending `Watchable` with `watched: boolean` and an optional `rating` between 1 and 5
- A `Playlist` interface with a `name` and an array of films
- A function `formatFilm(film: Film): string` that returns a one-line description — include the rating only if one is set
- A function `getUnwatched(playlist: Playlist): Film[]` that returns only films where `watched` is `false`

Organise the code across two files: one that defines and exports the interfaces and functions, one that imports them and runs the program. The entry point should define a playlist with at least three films and log the output of both functions.

Use `import type` where appropriate. Set up a `tsconfig.json` with strict mode enabled.

## Online Shop

A small online shop sells products organised into categories. Customers place orders. Each order contains one or more line items.

Design the TypeScript type system for this shop from scratch. Requirements:

- A product has a name, a price in euros, and a stock count. Its id must never be reassigned after creation.
- Products belong to a category. A category has a name and an optional description.
- A customer has an id, name, and email.
- An order links a customer to a list of line items. Each line item references a product and a quantity. Orders carry a status of either `"pending"`, `"confirmed"`, or `"shipped"`.

Implement at least these three functions:

- `orderTotal(order: Order): number` — the total price across all line items
- `formatOrder(order: Order): string` — a readable summary of the order
- `isInStock(product: Product): boolean` — whether the product has stock available

Split the code across at least three files. Use strict mode. The project must compile without errors and log meaningful output when the entry point runs.
