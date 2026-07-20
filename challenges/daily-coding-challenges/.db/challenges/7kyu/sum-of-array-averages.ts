// Program a function sumAverage(arr) where arr is an array containing arrays full of numbers, for example:
// sumAverage([[1, 2, 2, 1], [2, 2, 2, 1]]);
// First, determine the average of each array. Then, return the sum of all the averages.
// All numbers will be less than 100.
// arr will contain a maximum of 50 arrays.
// After calculating all the averages, add them all together, then round down, as shown in the example below:

import { test } from "@/test.ts";

function sumAverage(a: number[][]): number {
  // your code here
}

test(sumAverage([[1, 2, 2, 1], [2, 2, 2, 1]]), 3);
test(sumAverage([[1, 1, 1]]), 1);
test(sumAverage([[4, 4], [2, 2]]), 6);
test(sumAverage([[10, 20], [30, 40]]), 50);
test(sumAverage([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), 15);
