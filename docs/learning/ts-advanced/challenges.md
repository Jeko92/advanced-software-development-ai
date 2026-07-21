# TypeScript Advanced Setup - Challenges

## Nodemon and tsx

Add the two files below to your project's `src` directory. Configure the project so that:

- changes to the JSON file trigger a reload
- changes to the TypeScript file trigger a reload

### main.ts

```typescript
interface SuperheroData {
  superheroes: string[];
}

import marvelData from "./superheroes.json";

function logSuperheroCount(data: SuperheroData): void {
  const count = data.superheroes.length;

  console.log(`--- Marvel Data Summary ---`);
  console.log(`Total Superheroes Found: ${count}`);
  console.log(`---------------------------`);
}

logSuperheroCount(marvelData);
```

### superheroes.json

```json
{
  "superheroes": [
    "Spider-Man",
    "Iron Man",
    "Captain America",
    "Thor",
    "Hulk",
    "Black Widow",
    "Doctor Strange",
    "Black Panther",
    "Captain Marvel",
    "Scarlet Witch",
    "Vision",
    "Ant-Man",
    "Wasp",
    "Deadpool",
    "Wolverine",
    "Storm",
    "Cyclops",
    "Daredevil",
    "Jessica Jones",
    "Luke Cage"
  ]
}
```

## Bun on the backend

Install [Bun](https://bun.sh/). Use bun to start one of your previous typescript projects. Run code via:

```bash
bun run src/index.ts
```

Then use the watch mode to get autmatic reloading when the code changes:

```bash
bun run --watch src/index.ts
```

## Bun on the frontend

In one of your previous challenges from the client side session, swap the script file in side your HTML from the generated `index.js` to your `index.ts` file. Then serve the file with bun:

```bash
bun index.html
```

## Bun and Nodemon

Bun can reload automatically when any file that is inlcuded via an `import` statement is changed. In certain cases this does not work. Then we need nodemon again.

Create a new project with `bun init`. Then install nodemon and add these two files:

```ts
// index.ts
import { readFile } from "node:fs/promises";

const content = await readFile("./message.txt");
console.log(content.toString());
```

```
// message.txt
Hello World
```

Run the ts file directly to see that automatic reloading does not work when you change the message text.

Then configure nodemon to also watch `txt` files and set the bun run command as the `exec` value.
If you run into problems, check out the [nodemon documentation](https://nodemon.com/) or the [bun documentation](https://bun.sh/docs/).

## Side Project Setup

Think about the different options how to run your typescript code as well as adding typescript to your frontend. Update the setup of your side project to fit your needs. If you haven't choosen a project yet, then pick one now.

Then coninue to work on the project itself.
