// Given a number, write a function to output its reverse digits. (e.g. given 123 the answer is 321)
// Numbers should preserve their sign; i.e. a negative number should still be negative when reversed.

import { test } from "@/test.ts";

function reverseNumber(n: number): number {
  // your code here
}

test(reverseNumber(123), 321);
test(reverseNumber(-456), -654);
test(reverseNumber(1000), 1);
test(reverseNumber(0), 0);
test(reverseNumber(9009), 9009);
