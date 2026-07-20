// Write a method, that gets an array of integer-numbers and return an array of the averages of each integer-number
// and his follower, if there is one.
// Example:
// Input:  [ 1, 3, 5, 1, -10]
// Output:  [ 2, 4, 3, -4.5]
// If the array has 0 or 1 values or is null or None, your method should return an empty array.

import { test } from "@/test.ts";

function averages(a: number[] | null): number[] {
  // your code here
}

test(averages([1, 3, 5, 1, -10]), [2, 4, 3, -4.5]);
test(averages([1, 2, 3, 4]), [1.5, 2.5, 3.5]);
test(averages([]), []);
test(averages(null), []);
test(averages([10, 20]), [15]);
