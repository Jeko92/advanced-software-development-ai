// Given a non-negative integer, 3 for example, return a string with a murmur:
// "1 sheep...2 sheep...3 sheep...". Input will always be valid, i.e. no negative integers.

import { test } from "@/test.ts";

function countSheep(n: number): string {
  // your code here
}

test(countSheep(0), "");
test(countSheep(1), "1 sheep...");
test(countSheep(3), "1 sheep...2 sheep...3 sheep...");
test(countSheep(2), "1 sheep...2 sheep...");
test(countSheep(5), "1 sheep...2 sheep...3 sheep...4 sheep...5 sheep...");
