/*
https://www.codewars.com/kata/sum-of-differences-in-array
Your task is to sum the differences between consecutive pairs in the array in descending order.
For example: sumOfDifferences([2, 1, 10]) Returns 9
Descending order: [10, 2, 1]
Sum: (10 - 2) + (2 - 1) = 8 + 1 = 9
If the array is empty or the array has only one element the result should be 0.
*/

import { test } from "@/test.ts";

function sumOfDifferences(arr: number[]): number {
  // your code here
}

test(sumOfDifferences([2, 1, 10]), 9);
test(sumOfDifferences([1]), 0);
test(sumOfDifferences([]), 0);
test(sumOfDifferences([1, 2, 3]), 2);
test(sumOfDifferences([10, 5, 1]), 9);
