// https://www.codewars.com/kata/52efefcbcdf57161d4000091/train/javascript

import { test } from "@/test.ts";

function count(s: string): Record<string, number> {
  // your code here
}

test(count("aba"), { a: 2, b: 1 });
test(count(""), {});
test(count("aaa"), { a: 3 });
test(count("abc"), { a: 1, b: 1, c: 1 });
test(count("aabb"), { a: 2, b: 2 });
