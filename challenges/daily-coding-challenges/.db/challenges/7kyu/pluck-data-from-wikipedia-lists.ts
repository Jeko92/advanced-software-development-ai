// In this Kata, you'll write a function that extracts pieces of data and stores them in an Array.
// The function will accept two parameters:
// data: An Array of Objects
// property: A String representing the property from which to pluck data
// An Array should be returned, containing the value extracted for each Object contained in the data Array.

import { test } from "@/test.ts";

function pluck(data: Record<string, unknown>[], property: string): unknown[] {
  // your code here
}

test(pluck([{ a: 1 }, { a: 2 }], "a"), [1, 2]);
test(pluck([{ name: "Alice" }, { name: "Bob" }], "name"), ["Alice", "Bob"]);
test(pluck([{ x: 10, y: 20 }, { x: 30, y: 40 }], "y"), [20, 40]);
test(pluck([], "a"), []);
test(pluck([{ a: true }, { a: false }], "a"), [true, false]);
