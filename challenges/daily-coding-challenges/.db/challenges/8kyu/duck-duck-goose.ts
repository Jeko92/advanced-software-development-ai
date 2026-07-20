/*
The objective of Duck, duck, goose is to walk in a circle, tapping on each player's head until one is chosen.
Task: Given an array of Player objects and an index (1-based), return the name of the chosen Player(name is a
property of Player objects, e.g Player.name)
Example:
duck_duck_goose([a, b, c, d], 1) should return a.name
duck_duck_goose([a, b, c, d], 5) should return a.name
*/

import { test } from "@/test.ts";

interface Player {
  name: string;
}

function duckDuckGoose(p: Player[], g: number): string {
  // your code here
}

test(duckDuckGoose([{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }], 1), "Alice");
test(duckDuckGoose([{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }], 4), "Alice");
test(duckDuckGoose([{ name: "Alice" }, { name: "Bob" }], 2), "Bob");
test(duckDuckGoose([{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }], 5), "Bob");
test(duckDuckGoose([{ name: "Alice" }], 10), "Alice");
