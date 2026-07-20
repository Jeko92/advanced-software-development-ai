/*
https://www.codewars.com/kata/586d6cefbcc21eed7a001155/
For a given string s find the character c (or C) with longest consecutive repetition and return:
[c, l]
where l (or L) is the length of the repetition. If there are two or more characters with the same l
return the first in order of appearance.
For empty string return:
["", 0]
Happy coding! :)
*/

import { test } from "@/test.ts";

function longestRepetition(s: string): [string, number] {
  // your code here
}

test(longestRepetition("aaabbbbbcccc"), ["b", 5]);
test(longestRepetition(""), ["", 0]);
test(longestRepetition("a"), ["a", 1]);
test(longestRepetition("aabbcc"), ["a", 2]);
test(longestRepetition("zzz"), ["z", 3]);
