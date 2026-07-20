// You are given two arrays a1 and a2 of strings. Each string is composed with letters from a to z.
// Let x be any string in the first array and y be any string in the second array.
// Find max(abs(length(x) − length(y)))
// If a1 and/or a2 are empty return -1

import { test } from "@/test.ts";

function mxdiflg(a1: string[], a2: string[]): number {
  // your code here
}

test(mxdiflg(["aa", "bbb"], ["x", "yyyy"]), 3);
test(mxdiflg(["hello", "world"], ["a"]), 4);
test(mxdiflg([], ["a", "bb"]), -1);
test(mxdiflg(["a"], []), -1);
test(mxdiflg(["abc", "de"], ["fg", "hijk"]), 2);
