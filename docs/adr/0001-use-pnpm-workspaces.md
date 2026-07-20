# ADR-0001: Use pnpm workspaces

## Status

Accepted

## Context

The repo needs to host many independent TypeScript packages (course modules, mini-projects,
exercises) that share tooling but build/run independently.

## Decision

Use pnpm workspaces (`pnpm-workspace.yaml`) rather than npm/yarn workspaces or separate repos.

## Consequences

- Fast, disk-efficient installs via content-addressable store
- Strict node_modules prevents accidental cross-package imports
- `--filter` gives per-package script execution for free

* Slightly less familiar to contributors used to npm/yarn
