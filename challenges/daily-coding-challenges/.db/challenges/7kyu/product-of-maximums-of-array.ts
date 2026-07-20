// Given an array/list [] of integers , Find the product of the k maximal numbers.

import { test } from "@/test.ts";

function maxProduct(n: number[], k: number): number {
  // your code here
}

test(maxProduct([1, 2, 3, 4, 5], 2), 20);
test(maxProduct([10, 3, 5, 6, 20], 3), 1200);
test(maxProduct([1, 1, 1, 1], 3), 1);
test(maxProduct([7, 2, 9, 3], 1), 9);
test(maxProduct([5, 4, 3, 2, 1], 4), 120);
