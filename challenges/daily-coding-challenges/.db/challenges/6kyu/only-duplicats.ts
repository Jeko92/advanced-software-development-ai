/*
Given a string, remove any characters that are unique from the string.
Example:
input: "abccdefee"
output: "cceee"
*/

import { test } from "@/test.ts";

function onlyDuplicates(s: string): string {
  // your code here
}

test(onlyDuplicates("abccdefee"), "cceee");
test(onlyDuplicates("abcde"), "");
test(onlyDuplicates("aabbcc"), "aabbcc");
test(onlyDuplicates("hello"), "ll");
test(onlyDuplicates(""), "");
