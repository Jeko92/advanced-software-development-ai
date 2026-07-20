// Given an array/list [] of integers , Find The maximum difference between the successive elements
// in its sorted form.

import { test } from "@/test.ts";

function maxGap(a: number[]): number {
  // your code here
}

test(maxGap([1, 3, 7, 10, 20]), 10);
test(maxGap([1, 2, 3, 4, 5]), 1);
test(maxGap([13, 10, 2, 9, 5]), 4);
test(maxGap([1, 1, 1]), 0);
test(maxGap([10, 1]), 9);
