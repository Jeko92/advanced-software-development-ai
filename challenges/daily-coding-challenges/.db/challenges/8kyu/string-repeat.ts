// Write a function called repeatStr which repeats the given string string exactly n times.

import { test } from "@/test.ts";

function repeatStr(n: number, s: string): string {
  // your code here
}

test(repeatStr(3, "hello"), "hellohellohello");
test(repeatStr(0, "hello"), "");
test(repeatStr(1, "abc"), "abc");
test(repeatStr(5, "x"), "xxxxx");
test(repeatStr(2, "ab"), "abab");
