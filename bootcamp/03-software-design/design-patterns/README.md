# Software Design Design Patterns

TypeScript implementations of the patterns and challenges from the **neuefische Advanced Software Development
with AI** bootcamp **Software Design Design Patterns** module — creational,
structural, and behavioural patterns.

Same as `../cs-fundamentals/code-along-and-challenges`: every file in `src/`
starts out empty — you write the implementation yourself, following the
reference docs, then run it to see it work.

## Running it

From the repository root:

```bash
pnpm --filter @bootcamp/software-design-design-patterns dev
```

Or from this folder:

```bash
cd bootcamp/03-software-design/design-patterns
pnpm dev
```

`pnpm dev` builds the TypeScript, then runs `dist/index.js` (which imports
every file below for its side effects) and watches for changes. For a single
one-off run without the watcher:

```bash
pnpm exec tsx src/index.ts
```

No HTTP server or UI — console output only, same as the rest of this
module's practice packages.

## Layout

```
src/
  patterns/              — one file per pattern, following the handout docs
    creational/            (Factory, Builder, Singleton)
    structural/            (Repository, Dependency Injection, Decorator)
    behavioural/           (Observer, Strategy, State Machine)
  challenges/             — challenges from the official handout's
                             challenges.md, each in its own domain
  coding-challenges/      — challenges from Design_Patterns_Coding_Challenges.md,
                             split into part-1-creational/, part-2-structural/,
                             part-3-behavioural/, bonus/
```

Files under `coding-challenges/` are numbered to match the challenge doc's own
numbering (`1-1-1`, `1-2-3`, ...) — that numbering identifies which challenge
a file answers, it isn't a count of how many files exist. If a pattern needs
more reps than the doc gives you (e.g. you want a few extra Builder examples
before moving on), add more files under the same part — nothing else in this
README, or in the numbering itself, depends on a fixed total.

### Handouts

- `docs/learning/03-software-design/software-design-patterns/intro.md`
- `docs/learning/03-software-design/software-design-patterns/creational-patterns.md`
- `docs/learning/03-software-design/software-design-patterns/structural-patterns.md`
- `docs/learning/03-software-design/software-design-patterns/behavioural-patterns.md`
- `docs/learning/03-software-design/software-design-patterns/challenges.md`

### A note on the Audio Decoder Factory challenge

`Design_Patterns_Coding_Challenges.md`'s Challenge 1.1 ("Extend the Audio
Decoder Factory") asks you to extend the exact `Player`/`Decoder`/
`createDecoder` example from `creational-patterns.md` — not build a new
domain from scratch, unlike every other coding challenge (payments, search,
email, ...). So its solution isn't a separate file under `coding-challenges/`;
it's implemented directly inside `patterns/creational/factory.ts`, the same
file as the base example it extends.

## Dependency order

`index.ts` imports every file for its side effects, in this order:
`patterns/` (creational → structural → behavioural), then `challenges/`,
then `coding-challenges/` (part 1 → part 2 → part 3 → bonus).