# ADR-0003: Support both Node and Bun as runtimes

## Status

Accepted

## Context

Node is the safe default for compatibility with course material and deploy targets (e.g.
Next.js), but Bun is significantly faster for local dev and is increasingly common.

## Decision

Standardize installs on pnpm (single committed lockfile, `pnpm-lock.yaml`) but keep every
package's scripts runnable via either `pnpm run <script>` or `bun run <script>`. Bun's own
lockfile is git-ignored to avoid two sources of truth.

## Consequences

- Contributors can pick whichever runtime they prefer for day-to-day use
- CI stays on the one deterministic lockfile

* Packages that rely on a Node-only API must document that explicitly in their own README
