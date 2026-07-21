# TypeScript Basics - Interfaces

Understanding interfaces is important, because they solve a specific day-to-day problem: keeping object contracts stable as code moves across files and teammates. In small scripts, you can read an object inline and guess its shape. In larger projects, that breaks down quickly. A function in one file expects certain properties, another file creates the object, and a third file transforms it. If one property name changes or a required value is missing, the bug can travel far before someone notices. Interfaces make this contract explicit. They describe the expected structure of an object once, then TypeScript checks every usage point against that structure. This improves correctness, but it also improves communication. When a junior developer sees `Volunteer` or `CourseConfig` as an interface name, they can navigate the model faster than if every function repeats raw object literals. Interfaces are also a foundation for many later TypeScript topics: extending models, typing API responses, and defining class contracts. They are not a replacement for object type aliases though. A practical mental model is this: type aliases are broad and flexible for many type constructions, while interfaces are purpose-built for object contracts that should stay readable and consistent. In everyday code, that distinction helps you choose the right tool without overthinking syntax. If the main job is describing the shape of shared objects, interfaces are often the clearest option.

## Defining object contracts

An interface declares which properties an object must provide and the type of each property.

```typescript
interface Volunteer {
  id: number;
  name: string;
  active: boolean;
}

const member: Volunteer = {
  id: 12,
  name: "Nora",
  active: true,
};
```

- `Volunteer` is the shared contract for this object shape.
- Every required property must exist and match its declared type.
- Objects missing fields or using wrong types are rejected by the compiler.

## Optional and readonly properties

Interfaces can model flexible and immutable fields.

```typescript
interface CourseConfig {
  title: string;
  durationWeeks: number;
  location?: string;
  readonly cohortCode: string;
}
```

- `location?` is optional, so objects may include it but do not need to.
- `readonly cohortCode` can be set when the object is created but cannot be reassigned later.
- This pattern is useful for values that should never drift after initialization.

## Methods in interfaces

Interfaces can define required behavior by typing method signatures. `complete` and `getCompletedCount` are methods (functions that belong to the object), which have parameters and return types.

```typescript
interface ProgressTracker {
  complete(topic: string): void;
  getCompletedCount(): number;
}
```

- `complete` defines a method that accepts a topic name and returns nothing.
- `getCompletedCount` must return a number.
- Any object or class implementing this interface must provide both methods with matching signatures.

## Extending interfaces

You can build larger contracts from smaller ones with `extends`.

```typescript
interface Person {
  id: number;
  name: string;
}

interface Coach extends Person {
  specialty: string;
}
```

- `Coach` inherits `id` and `name` from `Person`.
- `Coach` adds its own required field, `specialty`.
- Extending keeps shared fields centralized and reduces duplication.

## Type aliases vs interfaces

Both constructs can describe object shapes, and for plain objects there is no obvious difference.

```typescript
type VolunteerAlias = {
  id: number;
  name: string;
};

interface VolunteerInterface {
  id: number;
  name: string;
}
```

The difference is in what each is optimized for. Use `interface` when dealing with classes or when you describe object shapes that sit between large portions of your applications — particularly when classes need to implement them with `implements`, or when the definition is extended with `extends`. Interfaces also support declaration merging: two declarations of the same name in the same scope are automatically combined, which is useful when augmenting third-party types.

Use `type` when working with unions, intersections, tuples, or aliases for primitives. These are compositions that interfaces cannot express.

## Resources

[TypeScript handbook - Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
[TypeScript handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
[TypeScript handbook - Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
