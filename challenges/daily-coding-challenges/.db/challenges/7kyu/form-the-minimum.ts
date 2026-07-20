// Given a list of digits, return the smallest number that could be formed from these digits,
// using the digits only once (ignore duplicates).

import { test } from "@/test.ts";

function minValue(a: number[]): number {
  // your code here
}

test(minValue([1, 3, 1]), 13);
test(minValue([5, 7, 5, 9, 7]), 579);
test(minValue([1, 9, 3, 1, 7, 4, 6, 6, 7]), 134679);
test(minValue([1, 2, 3, 4, 5]), 12345);
test(minValue([9, 9, 9]), 9);
