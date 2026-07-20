/*
https://www.codewars.com/kata/566044325f8fddc1c000002c
Write a function that returns a sequence (index begins with 1) of all the even
characters from a string. If the string is smaller than two characters or longer
than 100 characters, the function should return "invalid string".
For example:
"abcdefghijklm" --> ["b", "d", "f", "h", "j", "l"]
"a"             --> "invalid string"
*/

import { test } from "@/test.ts";

function evenChars(a: string): string[] | string {
  // your code here
}

test(evenChars("abcdefghijklm"), ["b", "d", "f", "h", "j", "l"]);
test(evenChars("a"), "invalid string");
test(evenChars("ab"), ["b"]);
test(evenChars("abcde"), ["b", "d"]);
test(evenChars(""), "invalid string");
