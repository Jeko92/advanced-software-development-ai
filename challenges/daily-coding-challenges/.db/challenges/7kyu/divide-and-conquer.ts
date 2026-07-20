/*
Given a mixed array of number and string representations of integers, add up the string integers
and subtract this from the total of the non-string integers.
*/

import { test } from "@/test.ts";

function divCon(arr: (string | number)[]): number {
  // your code here
}

test(divCon([1, 2, '3', 4, '5']), -1);
test(divCon([1, '2']), -1);
test(divCon([10, '3', 5]), 12);
test(divCon([0, 0, '0']), 0);
test(divCon([5, 5, 5, '5']), 10);
