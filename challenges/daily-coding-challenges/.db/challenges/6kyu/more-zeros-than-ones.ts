/*
https://www.codewars.com/kata/5d41e16d8bad42002208fe1a/train/javascript
You should remove any duplicate characters, keeping the first occurence of any such duplicates,
so they are in the same order in the final array as they first appeared in the input string.

Examples

'abcde' === ["1100001", "1100010", "1100011", "1100100", "1100101"]
               True       True       False      True       False

        --> ['a','b','d']

'DIGEST'--> ['D','I','E','T']
*/

import { test } from "@/test.ts";

function moreZeros(s: string): string[] {
  // your code here
}

test(moreZeros("abcde"), ["a", "b", "d"]);
test(moreZeros("DIGEST"), ["D", "I", "E", "T"]);
test(moreZeros(""), []);
test(moreZeros("aaa"), ["a"]);
test(moreZeros("hello"), ["h", "l"]);
