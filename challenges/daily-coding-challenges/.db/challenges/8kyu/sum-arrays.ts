// Write a method sum (sum_array in python, SumArray in C#) that takes an array of numbers and
// returns the sum of the numbers. These may be integers or decimals for Ruby and any instance
// of Num for Haskell. The numbers can also be negative. If the array does not contain any numbers
// then you should return 0.

import { test } from "@/test.ts";

function sum(n: number[]): number {
  // your code here
}

test(sum([1, 2, 3, 4, 5]), 15);
test(sum([]), 0);
test(sum([-1, -2, -3]), -6);
test(sum([100, 200, 300]), 600);
test(sum([0]), 0);
