// Write a function that can return the smallest value of an array or the index of that value.
// The function's 2nd parameter will tell whether it should return the value or the index.
// Assume the first parameter will always be an array filled with at least 1 number and no duplicates.
// Assume the second parameter will be a string holding one of two values: 'value' and 'index'.

import { test } from "@/test.ts";

function min(arr: number[], toReturn: string): number {
  // your code here
}

test(min([5, 3, 8, 1, 4], "value"), 1);
test(min([5, 3, 8, 1, 4], "index"), 3);
test(min([10, 20, 30], "value"), 10);
test(min([10, 20, 30], "index"), 0);
test(min([7], "value"), 7);
