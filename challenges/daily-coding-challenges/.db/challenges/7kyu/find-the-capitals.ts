// Write a function that takes a single string (word) as argument.
// The function must return an ordered list containing the indexes of all capital letters in the string.

import { test } from "@/test.ts";

function capitals(word: string): number[] {
  // your code here
}

test(capitals("CodEWaRs"), [0, 3, 5, 7]);
test(capitals("Hello World"), [0, 6]);
test(capitals("abc"), []);
test(capitals("ABC"), [0, 1, 2]);
test(capitals("aBcDeF"), [1, 3, 5]);
