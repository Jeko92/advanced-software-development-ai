// Given a string, return a new string that has transformed based on the input:

// Change case of every character, ie. lower case to upper case, upper case to lower case.
// Reverse the order of words from the input.

import { test } from "@/test.ts";

function stringTransformer(s: string): string {
  // your code here
}

test(stringTransformer("Example Input"), "INPUT eXAMPLE");
test(stringTransformer("Hello World"), "wORLD hELLO");
test(stringTransformer(""), "");
test(stringTransformer("abc DEF"), "def ABC");
test(stringTransformer("one two three"), "THREE TWO ONE");
