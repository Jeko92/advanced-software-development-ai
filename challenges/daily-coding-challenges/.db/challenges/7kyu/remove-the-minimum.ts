// Given an array of integers, remove the smallest value. Do not mutate the original array/list.
// If there are multiple elements with the same value, remove the one with a lower index.
// If you get an empty array/list, return an empty array/list.
// Don't change the order of the elements that are left.

import { test } from "@/test.ts";

function removeSmallest(a: number[]): number[] {
  // your code here
}

test(removeSmallest([1, 2, 3, 4, 5]), [2, 3, 4, 5]);
test(removeSmallest([5, 3, 2, 1, 4]), [5, 3, 2, 4]);
test(removeSmallest([2, 2, 1, 2, 1]), [2, 2, 2, 1]);
test(removeSmallest([]), []);
test(removeSmallest([1]), []);
