// Write a function that returns both the minimum and maximum number of the given list/array.

import { test } from "@/test.ts";

function minMax(a: number[]): [number, number] {
  // your code here
}

test(minMax([1, 2, 3, 4, 5]), [1, 5]);
test(minMax([2334454, 5]), [5, 2334454]);
test(minMax([1]), [1, 1]);
test(minMax([-5, 0, 10, -3]), [-5, 10]);
test(minMax([100, 99, 1, 2, 3]), [1, 100]);
