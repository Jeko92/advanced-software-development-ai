// You have an array of numbers.
// Your task is to sort ascending odd numbers but even numbers must be on their places.
// Zero isn't an odd number and you don't need to move it. If you have an empty array, you need to return it.
// Example
// sortArray([5, 3, 2, 8, 1, 4]) == [1, 3, 2, 8, 5, 4]

import { test } from "@/test.ts";

function sortArray(array: number[]): number[] {
  // your code here
}

test(sortArray([5, 3, 2, 8, 1, 4]), [1, 3, 2, 8, 5, 4]);
test(sortArray([5, 3, 1, 8, 0]), [1, 3, 5, 8, 0]);
test(sortArray([]), []);
test(sortArray([2, 4, 6]), [2, 4, 6]);
test(sortArray([1, 3, 5, 7]), [1, 3, 5, 7]);
