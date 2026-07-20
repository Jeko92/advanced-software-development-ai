// Complete the method which accepts an array of integers, and returns one of the following:
// "yes, ascending" - if the numbers in the array are sorted in an ascending order
// "yes, descending" - if the numbers in the array are sorted in a descending order
// "no" - otherwise

import { test } from "@/test.ts";

function isSortedAndHow(a: number[]): string {
  // your code here
}

test(isSortedAndHow([1, 2, 3, 4, 5]), "yes, ascending");
test(isSortedAndHow([5, 4, 3, 2, 1]), "yes, descending");
test(isSortedAndHow([1, 3, 2, 4]), "no");
test(isSortedAndHow([1]), "yes, ascending");
test(isSortedAndHow([10, 10, 10]), "yes, descending");
