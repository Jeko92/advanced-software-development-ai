/*
https://www.codewars.com/kata/57a6633153ba33189e000074
Count the number of occurrences of each character and return it as a list of tuples in order of appearance.
Example:
orderedCount("abracadabra") == [['a', 5], ['b', 2], ['r', 2], ['c', 1], ['d', 1]]
*/

import { test } from "@/test.ts";

function orderedCount(t: string): [string, number][] {
  // your code here
}

test(orderedCount("abracadabra"), [["a", 5], ["b", 2], ["r", 2], ["c", 1], ["d", 1]]);
test(orderedCount("aaa"), [["a", 3]]);
test(orderedCount("abc"), [["a", 1], ["b", 1], ["c", 1]]);
test(orderedCount("hello"), [["h", 1], ["e", 1], ["l", 2], ["o", 1]]);
test(orderedCount("aab"), [["a", 2], ["b", 1]]);
