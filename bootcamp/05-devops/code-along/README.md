# DevOps Testing — Code-Along

A working sandbox for the handouts in
[`docs/learning/05-devops/devops-testing`](../../../docs/learning/05-devops/devops-testing),
with Vitest and NestJS/TypeORM/Supertest already installed and configured.
`challenges.md` is intentionally not covered here.

This is a from-scratch code-along: `src/main.ts` and `src/app.module.ts`
are the only application files. Everything else — `src/vanilla/`,
`src/user/`, `test/app.e2e-spec.ts` — you write yourself, following the
handouts.

## Setup

```bash
pnpm install
```

## Handout → what to build

| Handout                  | What it teaches                                | Suggested file(s)                                                     |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| `testing-in-general.md`  | Vitest basics on a plain function                | `src/vanilla/cart.ts`, `cart.spec.ts`                                  |
| `tdd.md`                 | Red-Green-Refactor                              | `src/vanilla/library.ts`, `library.spec.ts` — write the test first     |
| `unit-testing.md`        | Mocking a TypeORM repository with `vi.fn()`     | `src/user/user.entity.ts`, `user.service.ts`, `user.service.spec.ts`   |
| `integration-testing.md` | Controller + service over Supertest, mocked repo | `src/user/user.controller.ts` + an integration spec next to it        |
| `integration-testing.md` | Real queries against in-memory SQLite            | a db-integration spec alongside the above                              |
| `e2e-testing.md`         | Booting the whole `AppModule` and hitting it     | `test/app.e2e-spec.ts`                                                 |

## Commands

```bash
pnpm test              # unit + integration specs under src/ (fast)
pnpm test:watch        # same, in watch mode
pnpm test:e2e          # the slower end-to-end suite under test/
pnpm test:e2e:watch    # same, in watch mode
pnpm dev               # boot the app on http://localhost:3000
pnpm typecheck
pnpm lint
```

Both `pnpm test` and `pnpm test:e2e` currently report "no test files
found" and exit cleanly (`passWithNoTests` is on) — that's expected until
you add spec files. `pnpm dev` boots fine too: `AppModule` is intentionally
empty right now.

## Two things already wired up for you

- **SWC transform.** NestJS's DI needs `emitDecoratorMetadata`, which
  Vitest's default esbuild transform doesn't emit. Both Vitest configs
  (`vitest.config.ts`, `vitest.config.e2e.ts`) load `unplugin-swc`
  (configured via `.swcrc`) instead — the setup from
  [NestJS's own Vitest recipe](https://docs.nestjs.com/recipes/swc#vitest).
  You don't need to touch this; it's just why `@Injectable()` /
  `@InjectRepository()` work under Vitest at all.
- **SQLite driver name.** The handouts use `type: 'sqlite'` in
  `TypeOrmModule`. The `typeorm` version installed in this monorepo only
  supports the synchronous `better-sqlite3` driver, so wherever a handout
  says `type: 'sqlite'`, use `type: 'better-sqlite3'` instead. Same
  in-memory technique (`database: ':memory:'`), different driver key.

## If you get stuck

`.solutions/` holds a complete, previously-verified version of everything
described above (`vanilla/`, `user/`, `app.module.ts`, `test/app.e2e-spec.ts`) —
it's excluded from lint/typecheck/test so it won't interfere with your own
code. Try not to peek until you've actually hit a wall; ask first if you'd
rather talk through the problem than see the answer.
