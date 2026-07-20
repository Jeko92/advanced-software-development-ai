/*
https://www.codewars.com/kata/59f11118a5e129e591000134
In this Kata, you will be given an array of numbers in which two numbers occur once
and the rest occur only twice. Your task will be to return the sum of the numbers that
occur only once.

For example, repeats([4,5,7,5,4,8]) = 15 because only the numbers 7 and 8 occur once,
and their sum is 15.
*/

import { test } from "@/test.ts";

function repeat(a: number[]): number {
  // your code here
}

test(repeat([4, 5, 7, 5, 4, 8]), 15);
test(repeat([1, 2, 3, 2, 1, 4]), 7);
test(repeat([10, 10, 20, 30]), 50);
test(repeat([5, 5, 3, 9]), 12);
test(repeat([1, 1, 2, 3]), 5);
