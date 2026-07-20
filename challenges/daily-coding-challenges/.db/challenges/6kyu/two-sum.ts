/*
Write a function that takes an array of numbers (integers for the tests) and a target number.
It should find two different items in the array that, when added together, give the target value.
The indices of these items should then be returned in a tuple like so: (index1, index2).
*/

import { test } from "@/test.ts";

function twoSum(n: number[], t: number): [number, number] | undefined {
  // your code here
}

test(twoSum([1, 2, 3], 4), [0, 2]);
test(twoSum([3, 2, 4], 6), [1, 2]);
test(twoSum([1, 2, 3, 4], 5), [0, 3]);
test(twoSum([0, 0], 0), [0, 1]);
test(twoSum([1, 4, 7, 10], 11), [0, 3]);
