// The bloody photocopier is broken... Just as you were sneaking around the office
// to print off your favourite binary code!
// Instead of copying the original, it reverses it: '1' becomes '0' and vice versa.
// Given a string of binary, return the version the photocopier gives you as a string.

import { test } from "@/test.ts";

function broken(x: string): string {
  // your code here
}

test(broken("1"), "0");
test(broken("0"), "1");
test(broken("1010"), "0101");
test(broken("11001"), "00110");
test(broken("000111"), "111000");
