// The year of 2013 is the first year after the old 1987 with only distinct digits.
// Now your task is to solve the following problem: given a year number, find the minimum year number which is
// strictly larger than the given one and has only distinct digits.

import { test } from "@/test.ts";

function distinctDigitYear(y: number): number {
  // your code here
}

test(distinctDigitYear(1987), 2013);
test(distinctDigitYear(2013), 2014);
test(distinctDigitYear(2099), 2103);
test(distinctDigitYear(2000), 2013);
test(distinctDigitYear(9876), 10234);
