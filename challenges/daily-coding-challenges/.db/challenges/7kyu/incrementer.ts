// Given an input of an array of digits num, return the array with each digit incremented by its position
// in the array. For example, the first digit will be incremented by 1, the second digit by 2 etc. Make
// sure to start counting your positions from 1 and not 0.
// incrementer([1,2,3]) => [2,4,6]
// Your result can only contain single digit numbers, so if adding a digit with it's position gives you a
// multiple-digit number, only the last digit of the number should be returned

import { test } from "@/test.ts";

function incrementer(a: number[]): number[] {
  // your code here
}

test(incrementer([1, 2, 3]), [2, 4, 6]);
test(incrementer([9, 9, 9]), [0, 1, 2]);
test(incrementer([0, 0, 0]), [1, 2, 3]);
test(incrementer([5, 3, 8, 2]), [6, 5, 1, 6]);
test(incrementer([1]), [2]);
