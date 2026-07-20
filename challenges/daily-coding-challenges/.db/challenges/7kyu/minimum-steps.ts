// Given an array of N integers, you have to find how many times you have to add up the smallest numbers in
// the array until their Sum becomes greater or equal to K.

import { test } from "@/test.ts";

function minimumSteps(arr: number[], num: number): number | undefined {
  // your code here
}

test(minimumSteps([1, 2, 3, 4, 5], 6), 2);
test(minimumSteps([5, 4, 3, 2, 1], 1), 0);
test(minimumSteps([1, 1, 1, 1], 3), 2);
test(minimumSteps([10, 20, 30], 25), 1);
test(minimumSteps([3, 5, 7, 1], 5), 1);
