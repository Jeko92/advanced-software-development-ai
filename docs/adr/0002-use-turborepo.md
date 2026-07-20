# ADR-0002: Use Turborepo for task orchestration

## Status

Accepted

## Context

As the number of packages grows past ~15-20, running `pnpm -r build` re-executes every
package's build every time, even when nothing changed.

## Decision

Use Turborepo on top of the existing pnpm workspace to cache and parallelize `build`, `lint`,
`typecheck`, and `test` tasks.

## Consequences

- Unchanged packages are skipped entirely (cache hit)
- Task graph respects inter-package dependencies automatically

* One more dependency and one more config file (`turbo.json`) to maintain
