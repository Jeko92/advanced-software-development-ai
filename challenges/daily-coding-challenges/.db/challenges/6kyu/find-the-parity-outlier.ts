/*

You are given an array (which will have a length of at least 3, but could be very large) containing integers.
The array is either entirely comprised of odd integers or entirely comprised of even integers except for a single
integer N. Write a method that takes the array as an argument and returns this "outlier" N.
Examples
[2, 4, 0, 100, 4, 11, 2602, 36]
Should return: 11 (the only odd number)
[160, 3, 1719, 19, 11, 13, -21]
Should return: 160 (the only even number)
*/

import { test } from "@/test.ts";

function findOutlier(a: number[]): number {
  // your code here
}

test(findOutlier([2, 4, 0, 100, 4, 11, 2602, 36]), 11);
test(findOutlier([160, 3, 1719, 19, 11, 13, -21]), 160);
test(findOutlier([1, 3, 5, 7, 8]), 8);
test(findOutlier([2, 4, 6, 7]), 7);
test(findOutlier([1, 1, 0, 1, 1]), 0);
