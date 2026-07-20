# Architecture

See:

- [`docs/adr/`](adr/template.md) for individual decisions and their rationale
- [`docs/course-map.md`](course-map.md) for how course parts map to folders
- Root `README.md` for the folder structure at a glance

High-level shape: pnpm workspace, Turborepo-orchestrated tasks, TypeScript strict mode
throughout, shared `tsconfig.base.json`, single root ESLint flat config.
