// There is an array with some numbers. All numbers are equal except for one. Try to find it!
// findUniq([ 1, 1, 1, 2, 1, 1 ]) === 2
// findUniq([ 0, 0, 0.55, 0, 0 ]) === 0.55
// It's guaranteed that array contains more than 3 numbers.
// The tests contain some very huge arrays, so think about performance.

import { test } from "@/test.ts";

function findUniq(a: number[]): number | undefined {
  // your code here
}

test(findUniq([1, 1, 1, 2, 1, 1]), 2);
test(findUniq([0, 0, 0.55, 0, 0]), 0.55);
test(findUniq([3, 3, 5, 3, 3]), 5);
test(findUniq([7, 7, 7, 7, 2]), 2);
test(findUniq([1, 9, 1, 1, 1]), 9);
