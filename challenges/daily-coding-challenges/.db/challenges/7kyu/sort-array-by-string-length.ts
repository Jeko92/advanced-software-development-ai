// Write a function that takes an array of strings as an argument and returns a sorted array
// containing the same strings, ordered from shortest to longest.
// For example, if this array were passed as an argument:
// ["Telescopes", "Glasses", "Eyes", "Monocles"]
// Your function would return the following array:
// ["Eyes", "Glasses", "Monocles", "Telescopes"]

import { test } from "@/test.ts";

function sortByLength(a: string[]): string[] {
  // your code here
}

test(sortByLength(["Telescopes", "Glasses", "Eyes", "Monocles"]), ["Eyes", "Glasses", "Monocles", "Telescopes"]);
test(sortByLength(["a", "bb", "ccc"]), ["a", "bb", "ccc"]);
test(sortByLength(["hello", "hi", "hey"]), ["hi", "hey", "hello"]);
test(sortByLength(["one"]), ["one"]);
test(sortByLength(["z", "aa", "bbb", "cccc"]), ["z", "aa", "bbb", "cccc"]);
