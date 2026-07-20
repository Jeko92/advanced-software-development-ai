// Find the number with the most digits.
// If two numbers in the argument array have the same number of digits, return the first one in the array.

import { test } from "@/test.ts";

function findLongest(a: number[]): number {
  // your code here
}

test(findLongest([1, 10, 100]), 100);
test(findLongest([999, 10000, 1]), 10000);
test(findLongest([5, 55, 555, 5555]), 5555);
test(findLongest([100, 200, 300]), 100);
test(findLongest([7]), 7);
