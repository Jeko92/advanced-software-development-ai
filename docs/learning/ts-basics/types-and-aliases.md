# TypeScript Basics - Type Annotations and Aliases

Typescripts core job is to add type annotations to variables and function definitions. An annotation defines what a variable should be: this variable holds text, this function expects numbers, this return value must be a specific object.

But annotations have a naming problem once a project grows. Writing out the same object shape across multiple files by hand is brittle and the different annotations can change in different directions over time. This is called drift. One file adds a property the others miss, a rename in one place does not reach the rest, or two files define the "same" shape slightly differently. Type aliases solve this: the `type` keyword gives a name to a type definition so it can be referenced everywhere instead of repeated. A `Volunteer` type defined once becomes the single contract for that object across the whole codebase.

Most real TypeScript files use both. Annotations establish what something is at a specific point in code. Aliases make that definition reusable and nameable. The two work together: you annotate function boundaries and exported values with the named types you define as aliases.

## Variable annotations

Variable annotations are the most direct way to declare intent.

```typescript
let shelterName: string = "Sunflower Commons";
let adoptableCats: number = 7;
let hasCommunityGarden: boolean = true;
```

Each annotation defines one allowed value category:

- `string` restricts `shelterName` to text values.
- `number` restricts `adoptableCats` to numeric values.
- `boolean` restricts `hasCommunityGarden` to `true` or `false`.

If you later assign a mismatched type, the compiler reports it before runtime.

```typescript
hasCommunityGarden = "yes"; // error - can only assign boolean values not strings
```

There is a type for every primitive value category: `string`, `number`, `boolean`, `undefined`, and `null`. Also, you have access to special types like `never`, `unkown`, and `any`.

## Function signatures

Function annotations define both the expected types of function parameters and the return type. this might be the single most useful feature in TypeScript. No more guesswork or rereading function implementations.

```typescript
function splitIceCreamCups(totalCups: number, teammates: number): number {
  return totalCups / teammates;
}
```

This signature communicates three explicit constraints:

- `totalCups` must be a number.
- `teammates` must be a number.
- the return value must be a number.

When these constraints are explicit, incorrect calls and incorrect return paths are caught early.

## Aliasses - Naming reusable types

Type aliases let you give a clear name to frequently used types. They function like variables but for types instead of values.

```typescript
type VolunteerId = number;
type VolunteerName = string;

type Volunteer = {
  id: VolunteerId;
  name: VolunteerName;
  active: boolean;
};

const member: Volunteer = {
  id: 12,
  name: "Nora",
  active: true,
};

const incorrectMember: Volunteer = {
  id: "12",
  name: "Nora",
}; // error - active is missing
```

Each alias communicates intent:

- `VolunteerId` and `VolunteerName` document the meaning of raw `number` and `string` values. Without the alias, a caller cannot tell from a signature like `function find(id: number)` what kind of number is expected.
- `Volunteer` centralizes the object shape so all files use the same contract.
- Changing the shared type propagates through the compiler — every usage site that no longer matches is reported.

## Array annotations

Arrays should declare what each element is allowed to be. You write type for the elements followed by a square bracket.

```typescript
let snackBox: string[] = ["mint tea", "oat cookies", "apple slices"];
let roster: Volunteer[] = [
  { id: 1, name: "Mina", active: true },
  { id: 2, name: "Nora", active: false },
];
```

- `snackBox` is `string[]`, so every entry must be a text value.
- `roster` is `Volunteer[]`, so each entry must satisfy the full `Volunteer` shape.
- An object missing a required field, or a primitive where a `Volunteer` is expected, is rejected by typescript.

## Resources

[TypeScript handbook - Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
[TypeScript handbook - More on functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
[TypeScript handbook - Type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
