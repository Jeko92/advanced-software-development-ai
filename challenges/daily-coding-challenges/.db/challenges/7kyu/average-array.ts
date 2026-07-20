// Create a function that takes a 2D array as an input, and outputs another array that contains
// the average values for the numbers in the nested arrays at the corresponding indexes.

import { test } from "@/test.ts";

function avgArray(ar: number[][]): number[] {
  // your code here
}

test(avgArray([[1, 2, 3], [3, 2, 1]]), [2, 2, 2]);
test(avgArray([[1, 1], [2, 2], [3, 3]]), [2, 2]);
test(avgArray([[10, 20], [30, 40]]), [20, 30]);
test(avgArray([[0, 0, 0], [6, 6, 6]]), [3, 3, 3]);
test(avgArray([[5, 10, 15]]), [5, 10, 15]);
