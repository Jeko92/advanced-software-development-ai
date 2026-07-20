// Given a Divisor and a Bound , Find the largest integer N , Such That ,
// N is divisible by divisor
// N is less than or equal to bound
// N is greater than 0.
// The parameters (divisor, bound) passed to the function are only positve values .
// It's guaranteed that a divisor is Found .

import { test } from "@/test.ts";

function maxMultiple(d: number, b: number): number {
  // your code here
}

test(maxMultiple(2, 7), 6);
test(maxMultiple(3, 10), 9);
test(maxMultiple(7, 17), 14);
test(maxMultiple(5, 25), 25);
test(maxMultiple(10, 50), 50);
