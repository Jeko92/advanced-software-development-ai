/*
You are given an odd-length array of integers, in which all of them are the same,
except for one single number.
Complete the method which accepts such an array, and returns that single different number.
*/

import { test } from "@/test.ts";

function stray(numbers: number[]): number {
  // your code here
}

test(stray([1, 1, 2]), 2);
test(stray([3, 10, 3, 3, 3]), 10);
test(stray([5, 5, 5, 5, 1]), 1);
test(stray([7, 7, 7, 2, 7, 7, 7]), 2);
test(stray([4, 4, 4, 4, 9, 4, 4]), 9);
