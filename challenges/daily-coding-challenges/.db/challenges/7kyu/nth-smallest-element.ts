// Given an array, find the Nth smallest element in this array

import { test } from "@/test.ts";

function nthSmallest(a: number[], n: number): number {
  // your code here
}

test(nthSmallest([3, 1, 2], 1), 1);
test(nthSmallest([3, 1, 2], 2), 2);
test(nthSmallest([10, 5, 3, 8], 3), 8);
test(nthSmallest([7, 7, 7, 7], 1), 7);
test(nthSmallest([100, 50, 25, 75], 4), 100);
