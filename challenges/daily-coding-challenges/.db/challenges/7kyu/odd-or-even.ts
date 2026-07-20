// Given an array of numbers (a list in groovy), determine whether the sum of all of the numbers
// is odd or even.
// Give your answer in string format as 'odd' or 'even'.
// If the input array is empty consider it as: [0] (array with a zero).

import { test } from "@/test.ts";

function oddOrEven(a: number[]): string {
  // your code here
}

test(oddOrEven([0]), "even");
test(oddOrEven([1, 2, 3]), "even");
test(oddOrEven([1, 1, 1]), "odd");
test(oddOrEven([]), "even");
test(oddOrEven([5, 4, 3, 2, 1]), "odd");
