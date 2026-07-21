# TypeScript Basics - Type Inference

After type annotations, the next concept that makes TypeScript feel fast instead of heavy is type inference. Inference means the compiler derives a type from the code you already wrote, so you do not need to annotate every single value. This solves a practical problem: if you annotate everything mechanically, files get noisy, and the important contracts are harder to spot. On the other hand, if you rely on guesswork with no type information, you lose safety and spend more time debugging. Type inference sits in the middle. It keeps everyday code concise while still giving you autocomplete, error checks, and refactor support. The key detail is that inference tracks what your code actually does, not what you intended to do. That is why this topic belongs right after annotations: annotations define boundaries and intent, and inference reduces repetition inside those boundaries. In TypeScript, inferred local types work the same way. Once a value is established, the compiler tracks its type without needing you to repeat it on every subsequent line. You still annotate function inputs, outputs, and shared models where clarity matters most, but you let the compiler handle obvious local values. Learning this balance helps you write code that is both readable and safe without turning every file into a wall of type syntax.

## Inference from initialized values

When a variable is declared with an initial value, TypeScript infers its type from that value.

```typescript
let teamName = "Sunflower Helpers";
let activeVolunteers = 12;
const hasOpenSlots = true;
let catNames = ["Milo", "Nora", "Pico"];
```

Inferred types here are straightforward:

- `teamName` is inferred as `string`.
- `activeVolunteers` is inferred as `number`.
- `hasOpenSlots` is inferred as `boolean`.
- `catNames` is inferred as `string[]`.

If you later assign a mismatched value, the compiler reports it.

## Inference at function return values

TypeScript can infer a function return type from the returned expression.

```typescript
function formatVolunteerBadge(id: number) {
  return `VOL-${id}`;
}
```

The return type is inferred as `string`. This is convenient, but there is one caveat: inference validates what you returned, not what you meant to return. If return type intent is important, make it explicit with an annotation so contract mismatches are caught immediately.

## Inference in callbacks

Inference is especially useful in array methods, where callback parameter types are derived from the array.

```typescript
const healthPoints = [12, 18, 25];
const boosted = healthPoints.map((hp) => hp + 5);
```

TypeScript infers:

- `hp` as `number` inside the callback.
- `boosted` as `number[]` from the callback result.

This keeps callback code concise without losing type safety.

## Places where inference needs help

Inference cannot determine a type when no value is present yet, and it does not infer function parameter types from call sites.

```typescript
let nextShiftStart: number;

function assignPartner(name: string, partnerId: number) {
  return `${name}-${partnerId}`;
}
```

The first case is an uninitialized variable. Without a starting value, TypeScript has nothing to infer from and would fall back to `any` — the least safe type, which disables most checking. An explicit annotation tells the compiler what the variable is expected to hold before anything is assigned to it.

The second case is function parameters. TypeScript does not look at call sites to guess what a parameter might receive. Each parameter must be annotated directly, or the compiler has no way to check whether callers are passing the right values. This is by design: the function signature is the contract, and it should be readable in isolation without inspecting every call.

## Choosing inference vs explicit annotations

Use this practical default:

- rely on inference for obvious local values and short callback logic.
- use explicit annotations for function parameters and return types.
- annotate exported objects and shared data structures across files.

This default works well in practice because it puts annotations where they matter most and leaves the rest to the compiler. A local variable calculated inside a function usually has an obvious type that inference handles cleanly. A function's input and output, on the other hand, are the first thing readers and callers look at — making those explicit keeps the contract visible without requiring anyone to read the implementation. Exported objects and shared models cross file boundaries, so annotating them makes those contracts stable even when the implementation changes later.

## Resources

[TypeScript handbook - Type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
[TypeScript handbook - Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
