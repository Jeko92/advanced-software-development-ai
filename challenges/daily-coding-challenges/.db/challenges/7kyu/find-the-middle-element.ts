// As a part of this Kata, you need to create a function that when provided with a triplet,
// returns the index of the numerical element that lies between the other two elements.
// The input to the function will be an array of three distinct numbers (Haskell: a tuple).
// For example:
// gimme([2, 3, 1]) => 0
// 2 is the number that fits between 1 and 3 and the index of 2 in the input array is 0.

import { test } from "@/test.ts";

function gimme(a: number[]): number {
  // your code here
}

test(gimme([2, 3, 1]), 0);
test(gimme([1, 2, 3]), 1);
test(gimme([3, 1, 2]), 2);
test(gimme([5, 10, 3]), 0);
test(gimme([1, 3, 2]), 2);
