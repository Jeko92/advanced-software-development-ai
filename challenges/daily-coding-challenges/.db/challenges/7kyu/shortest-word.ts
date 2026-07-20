/*
https://www.codewars.com/kata/57cebe1dc6fdc20c57000ac9
Simple, given a string of words, return the length of the shortest word(s).
String will never be empty and you do not need to account for different data types.
*/

import { test } from "@/test.ts";

function findShort(s: string): number {
  // your code here
}

test(findShort("bitcoin take over the world maybe who knows perhaps"), 3);
test(findShort("short words"), 5);
test(findShort("a b c"), 1);
test(findShort("hello"), 5);
test(findShort("one two three four"), 3);
