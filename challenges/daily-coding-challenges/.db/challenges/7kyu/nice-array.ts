/*
A Nice array is defined to be an array where for every value n in the array, there is also an
element n-1 or n+1 in the array.
example:
[2,10,9,3] is Nice array because
2=3-1
10=9+1
3=2+1
9=10-1
*/

import { test } from "@/test.ts";

function isNice(a: number[]): boolean {
  // your code here
}

test(isNice([2, 10, 9, 3]), true);
test(isNice([1, 2, 3, 4]), true);
test(isNice([1, 3, 5]), false);
test(isNice([]), false);
test(isNice([5, 4, 3, 2, 1]), true);
