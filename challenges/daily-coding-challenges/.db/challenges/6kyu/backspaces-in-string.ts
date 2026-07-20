/*
https://www.codewars.com/kata/backspaces-in-string/train/javascript
Assume "#" is like a backspace in string. This means that string "a#bc#d" actually is "bd"
Your task is to process a string with "#" symbols.
Examples
"abc#d##c"      ==>  "ac"
"abc##d######"  ==>  ""
"#######"       ==>  ""
""              ==>  ""
*/

import { test } from "@/test.ts";

function cleanString(string: string): string {
  // your code here
}

test(cleanString("abc#d##c"), "ac");
test(cleanString("abc##d######"), "");
test(cleanString("#######"), "");
test(cleanString(""), "");
test(cleanString("hello#world"), "hellworld");
