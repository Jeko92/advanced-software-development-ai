// Given an array/list [] of n integers , find maximum triplet sum in the array Without duplications .
// Input >> Output Examples
// 1- maxTriSum ({3,2,6,8,2,3}) ==> return (17)
// Explanation:
// As the triplet that maximize the sum {6,8,3} in order , their sum is (17)

import { test } from "@/test.ts";

function maxTriSum(a: number[]): number {
  // your code here
}

test(maxTriSum([3, 2, 6, 8, 2, 3]), 17);
test(maxTriSum([1, 2, 3, 4, 5]), 12);
test(maxTriSum([10, 10, 10, 5]), 15);
test(maxTriSum([1, 1, 1, 1, 2, 2, 3]), 6);
test(maxTriSum([100, 50, 25, 10]), 175);
