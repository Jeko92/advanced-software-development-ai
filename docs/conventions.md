# Repository Conventions

## Naming:

- kebab-case
- folders/packages, real names (`recipe-book`, not `project1`).
- descriptive names
- avoid lesson numbers

## Apps

Runnable projects.

## Packages

Learning material and reusable examples.
**Package shape:** every `apps/*` and `packages/*` package has `src/`, `dist/` (git-ignored),
`package.json` with at least `build`/`dev`/`typecheck`/`lint` scripts, `tsconfig.json`
extending `../../tsconfig.base.json`, and its own `README.md`.

## Challenges

Small standalone exercises.

## Commits

Conventional Commits.
`<type>(<scope>): <summary>` — types: feat, fix, docs, style, refactor, test,
build, ci, chore. Scope = package/app name. Enforced via `.githooks/commit-msg`.

## Formatting

- TypeScript strict mode
- ESLint
- 2 spaces

## Runtime

**Runtime:** pnpm for installs (lockfile of record); `pnpm run <script>` or `bun run <script>`
both work for execution. See `docs/adr/0003-support-node-and-bun.md`.
