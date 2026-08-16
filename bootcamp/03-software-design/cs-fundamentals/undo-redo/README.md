# Software Design CS Fundamentals — Undo / Redo

This project is where I'll write my own implementation of the `challenges.md`
"Undo / Redo" exercise from the **neuefische Advanced Software Development
with AI** bootcamp **Software Design CS Fundamentals** module — a text input
with Undo and Redo buttons, backed by two stacks tracking edit history.

This is one of two packages under `bootcamp/03-software-design/cs-fundamentals/`.
The other, `../code-along-and-challenges`, covers the rest of the module
(linked lists, stacks, trees, sorting algorithms) as a console-only Node
package. This challenge needs a small HTML UI, so it gets its own Vite-based
package instead.

`index.html` and `vite.config.ts` are already wired up. `src/index.ts` starts
out empty except for a doc comment pointing at the handout section and a
`TODO` list of what to build — there is no solution code checked in here.

## Running it

From the repository root:

```bash
pnpm --filter @bootcamp/software-design-cs-fundamentals-undo-redo dev
```

Or from this folder:

```bash
cd bootcamp/03-software-design/cs-fundamentals/undo-redo
pnpm dev
```

Vite serves the app at `http://localhost:3001` by default (see
`vite.config.ts`) and hot-reloads on save.

## Build / Preview

```bash
pnpm build
pnpm preview
```
