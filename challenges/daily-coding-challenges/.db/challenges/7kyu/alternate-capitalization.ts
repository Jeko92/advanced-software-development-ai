/*
https://www.codewars.com/kata/alternate-capitalization/train/javascript
Given a string, capitalize the letters that occupy even indexes and odd indexes separately,
and return as shown below. Index 0 will be considered even.
For example, capitalize("abcdef") = ['AbCdEf', 'aBcDeF']. See test cases for more examples.
*/

import { test } from "@/test.ts";

function capitalize(s: string): string[] {
  // your code here
}

test(capitalize("abcdef"), ['AbCdEf', 'aBcDeF']);
test(capitalize("hello"), ['HeLlO', 'hElLo']);
test(capitalize("a"), ['A', 'a']);
test(capitalize("ab"), ['Ab', 'aB']);
test(capitalize("codewars"), ['CoDeWaRs', 'cOdEwArS']);
