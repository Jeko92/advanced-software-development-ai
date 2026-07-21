# TypeScript Handout — Quick Reference

## Annotating variables

Put the type after the name, before `=`:

```ts
const city: string = 'Berlin';
let temperature: number = 18;
const isRaining: boolean = false;
```

Common primitives: `string`, `number`, `boolean`

Arrays: `string[]`, `number[]`

---

## Function parameters

Annotate each parameter:

```ts
function double(n: number) {
    return n * 2;
}

function joinLabels(left: string, right: string) {
    return `${left} · ${right}`;
}
```

---

## Return types

Put the return type after the parameter list:

```ts
function double(n: number): number {
    return n * 2;
}

function printLabel(label: string): void {
    console.log(label);
}
```

Use `void` when the function returns nothing.

---

## Interfaces

An interface describes the **shape** of an object:

```ts
interface Movie {
    title: string;
    year: number;
    rating: number;
}

const movie: Movie = {
    title: 'Inception',
    year: 2010,
    rating: 8.8,
};

function describeMovie(movie: Movie): void {
    console.log(`${movie.title} (${movie.year})`);
}
```

Optional property: `subtitle?: string`
