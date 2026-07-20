# ADR-0004: Split into apps/, packages/, challenges/

## Status

Accepted

## Context

A single flat `packages/` folder mixing real projects, topic-organized examples, and small
drills becomes hard to navigate and doesn't communicate intent.

## Decision

Split by kind of code: `apps/` for complete, standalone projects; `packages/` for
topic-organized, still-buildable learning workspaces; `challenges/` for small, isolated
exercises. Course-part traceability lives in `docs/course-map.md`, not in folder names.

## Consequences

- Folder location communicates what a piece of code IS, not just which week it's from
- Course-part mapping needs one maintained table instead of being implicit in paths
