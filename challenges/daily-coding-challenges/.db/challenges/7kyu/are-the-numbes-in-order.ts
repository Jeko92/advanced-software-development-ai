/*In this Kata, your function receives an array of integers as input.
Your task is to determine whether the numbers are in ascending order.
An array is said to be in ascending order if there are no two adjacent integers
where the left integer exceeds the right integer in value.
*/

import { test } from "@/test.ts";

function inAscOrder(a: number[]): boolean {
  // your code here
}

test(inAscOrder([1, 2, 3, 4, 5]), true);
test(inAscOrder([1, 6, 10, 18]), true);
test(inAscOrder([6, 7, 1, 8]), false);
test(inAscOrder([5, 5, 6]), true);
test(inAscOrder([10, 5, 3]), false);
