/*
https://www.codewars.com/kata/5a8d2bf60025e9163c0000bc
In this Kata, you will sort elements in an array by decreasing frequency of elements.
If two elements have the same frequency, sort them by increasing value.
solve([2,3,5,3,7,9,5,3,7]) = [3,3,3,5,5,7,7,2,9]
--we sort by highest frequency to lowest frequency.
*/

import { test } from "@/test.ts";

function solve(arr: number[]): number[] {
  // your code here
}

test(solve([2, 3, 5, 3, 7, 9, 5, 3, 7]), [3, 3, 3, 5, 5, 7, 7, 2, 9]);
test(solve([1, 1, 2, 2, 3]), [1, 1, 2, 2, 3]);
test(solve([5, 5, 5]), [5, 5, 5]);
test(solve([1, 2, 3]), [1, 2, 3]);
test(solve([4, 4, 1, 1, 1, 2]), [1, 1, 1, 4, 4, 2]);
