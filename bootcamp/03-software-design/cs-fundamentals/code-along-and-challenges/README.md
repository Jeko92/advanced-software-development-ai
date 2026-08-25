# Software Design CS Fundamentals — Code-Along & Challenges

This project is where I'll write my own TypeScript implementations of the
data structures and algorithms from the **neuefische Advanced Software
Development with AI** bootcamp **Software Design CS Fundamentals** module —
linked lists, stacks, trees, and sorting algorithms.

This is one of two packages under `bootcamp/03-software-design/cs-fundamentals/`.
The other, `../undo-redo`, covers the `challenges.md` "Undo / Redo" exercise,
which needs a small HTML UI and so gets its own Vite-based package instead of
living in this console-only one.

Unlike `programming-paradigms`, the package next to this one at the module
level up, every file in `src/` starts out empty except for a doc comment
pointing at the relevant handout section and a `TODO` list of what to build.
There is no solution code checked in here — the point of this package is to
write it myself.

## Running it

From the repository root:

```bash
pnpm --filter @bootcamp/software-design-cs-fundamentals-code-along-and-challenges dev
```

Or from this folder:

```bash
cd bootcamp/03-software-design/cs-fundamentals/code-along-and-challenges
pnpm dev
```

`pnpm dev` builds the TypeScript, then runs `dist/index.js` (which imports
every file below in order) and watches for changes. For a single one-off run
without the watcher:

```bash
pnpm exec tsx src/index.ts
```

Same as `programming-paradigms`: no HTTP server or UI, just console output —
add `console.log` calls as each structure comes together.

## Scaffolded files

**Data structures** (`docs/learning/.../software-design-cs-fundamentals/data-structures.md`):

- `node.ts` — shared `Node`/`DoublyNode` classes the two linked lists build on
- `singly-linked-list.ts` — forward-only chain of nodes
- `doubly-linked-list.ts` — chain of nodes walkable in either direction
- `stack.ts` — LIFO push/pop/peek, built on `SinglyLinkedList`
- `general-tree.ts` — hierarchical node with any number of children
- `binary-tree.ts` — tree node with at most two named children, no ordering
- `binary-search-tree.ts` — binary tree with the left-smaller/right-larger
  ordering rule

**Algorithms** (`docs/learning/.../software-design-cs-fundamentals/algorithms.md`,
`challenges.md`):

- `bubble-sort.ts`
- `insertion-sort.ts` — also the `challenges.md` "Implement insertion sort" exercise
- `merge-sort.ts`
- `timsort.ts` — optional/stretch, no pseudocode given in the handout

## Playground

`playground.ts` demonstrates the structures above in action — small,
runnable examples that exercise each implementation once it's written
(building a chain of `DoublyNode`s and walking it in both directions, for
instance). It's organized into one comment-delimited section per structure
(`/* node */`, `/* doublyNode */`, and so on).

Since this file is meant to grow a section per structure, running all of them
at once will eventually flood the console. Comment out the sections you're
not actively looking at, and only comment a section back in while you're
working on or reviewing that particular structure.

## Dependency order

`index.ts` imports every file above for its side effects, in the order data
structures are meant to build on each other: `node` → the two linked lists →
`stack`, then the tree files, then the sort files. Follow the `TODO` comments
in each file for which earlier file to build on instead of duplicating logic
(e.g. `stack.ts` should reuse `SinglyLinkedList`, not reimplement a chain of
nodes).
