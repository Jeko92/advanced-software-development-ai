# Advanced Software Development with AI

A pnpm monorepo documenting my work throughout the **neuefische Advanced Software Development with AI** bootcamp.

The repository follows a production-inspired monorepo structure rather than a traditional course folder hierarchy. Rather than maintaining a chaotic folder structure of random class scripts, this repository treats every lesson, utility library, and assignment as isolated standalone workspaces managed by Turborepo.

## Overview

Real projects (`apps/`), topic-organized learning workspaces (`packages/`), and standalone exercises (`challenges/`) — all independently buildable, runnable, and tested.

## Repository Philosophy

Every unit of code, whether a full project or a single-topic exercise, is a real workspace package: it builds, lints, typechecks, and (where applicable) tests on its own. See [`docs/architecture.md`](docs/architecture.md) and the Architecture Decision Records in [`docs/adr/template.md`](docs/adr/template.md) for why.

One exception: `challenges/daily-coding-challenges` is excluded from the pnpm workspace (see [`pnpm-workspace.yaml`](pnpm-workspace.yaml)). It's a self-scaffolded external tool with its own package manager and tsconfig, kept in the repo for tracking but not wired into the shared build/lint/typecheck pipeline.

## Repository structure

```text
apps/          Runnable applications
packages/      Topic-focused learning material
challenges/    Small coding exercises
tooling/       Shared configuration
docs/          Documentation
scripts/       Automation scripts
```

See **docs/course-map.md** for the mapping between course modules and repository folders.

## Tech Stack

- TypeScript
- pnpm Workspaces
- Turborepo Pipeline Architecture
- ESLint 9 Flat Config
- GitHub Actions (PR title linting)
- Conventional Commits (IDE-assisted via WebStorm's Conventional Commit plugin — not locally enforced)
- Node.js 20+ & Bun Compatibility

## Package Manager & Runtime Support

Installs are standardized on **pnpm** (`pnpm-lock.yaml` is the committed lockfile). Scripts run identically under **Node** or **Bun**:

|              | Node                   | Bun                                     |
| ------------ | ----------------------- | --------------------------------------- |
| Install      | `pnpm install`          | `pnpm install` (once, for the lockfile) |
| Dev          | `pnpm dev`               | `bun run dev`                           |
| Build        | `pnpm build`             | `bun run build`                         |
| Test         | `pnpm test`              | `bun test`                              |
| Run one file | `ts-node src/index.ts`   | `bun src/index.ts`                      |

See [`docs/adr/0003-support-node-and-bun.md`](docs/adr/0003-support-node-and-bun.md).

## Getting Started

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
```

## Adding a Package

```bash
pnpm new:package apps/<name>        # or packages/<name>, challenges/<name>
```

## Branching Strategy

`main` (protected) ← `develop` (protected) ← `feature/<module>`. Details in [`docs/branching.md`](docs/branching.md).

## Commit Convention

`<type>(<scope>): <summary>`, following Conventional Commits. Types and scopes are defined in [`.conventionalcommit.json`](.conventionalcommit.json), which WebStorm's Conventional Commit plugin reads automatically to provide autocomplete in the commit dialog — this is a local editor convenience only, nothing rejects a commit for not following the format. Pairing? See [`.conventionalcommit.coauthors`](.conventionalcommit.coauthors).

## CI/CD

Currently, GitHub Actions only enforces Conventional Commit formatting on PR titles (`.github/workflows/pr-title-lint.yml`). Lint, typecheck, build, and test automation on PRs is not wired up yet — see [`docs/roadmap.md`](docs/roadmap.md).

## Course Map

[`docs/course-map.md`](docs/course-map.md) — which folder covers which course part.

## Roadmap

[`docs/roadmap.md`](docs/roadmap.md)

## Useful Commands

```bash
pnpm --filter <package> run <script>   # run a package-specific script
pnpm build --filter <package>...       # build one package and its dependents
turbo run build --dry                  # preview the task graph without running it
```

## License

MIT
