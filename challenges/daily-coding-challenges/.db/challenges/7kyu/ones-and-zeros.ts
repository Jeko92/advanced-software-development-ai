// Description:
// Given an array of ones and zeroes, convert the equivalent binary value to an integer.
// Eg: [0, 0, 0, 1] is treated as 0001 which is the binary representation of 1.

import { test } from "@/test.ts";

function binaryArrayToNumber(num: number[]): number {
  // your code here
}

test(binaryArrayToNumber([0, 0, 0, 1]), 1);
test(binaryArrayToNumber([0, 1, 1, 0]), 6);
test(binaryArrayToNumber([1, 0, 0, 0]), 8);
test(binaryArrayToNumber([1, 1, 1, 1]), 15);
test(binaryArrayToNumber([0, 0, 0, 0]), 0);
