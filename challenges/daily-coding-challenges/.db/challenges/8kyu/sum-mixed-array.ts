// Given an array of integers as strings and numbers, return the sum of the array
// values as if all were numbers.

import { test } from "@/test.ts";

function sumMix(ar: (string | number)[]): number {
  // your code here
}

test(sumMix([9, 3, "7", "3"]), 22);
test(sumMix(["5", "0", 9, 3, 2, 1]), 20);
test(sumMix([1, "2", 3]), 6);
test(sumMix(["1", "2", "3"]), 6);
test(sumMix([0]), 0);
