/*
Given an array, find the int that appears an odd number of times.
There will always be only one integer that appears an odd number of times.
*/

import { test } from "@/test.ts";

function findOdd(A: number[]): number {
  // your code here
}

test(findOdd([7]), 7);
test(findOdd([0, 1, 0, 1, 0]), 0);
test(findOdd([1, 1, 2]), 2);
test(findOdd([5, 4, 3, 2, 1, 5, 4, 3, 2]), 1);
test(findOdd([1, 1, 1, 1, 1]), 1);
