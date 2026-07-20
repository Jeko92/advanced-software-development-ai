/*
https://www.codewars.com/kata/57cc79ec484cf991c900018d
Simple enough this one - you will be given an array. The values in the array will either be numbers or strings,
or a mix of both. You will not get an empty array, nor a sparse one.
Your job is to return a single array that has first the numbers sorted in ascending order, followed by the strings
sorted in alphabetic order. The values must maintain their original type.
*/

import { test } from "@/test.ts";

function dbSort(a: (string | number)[]): (string | number)[] {
  // your code here
}

test(dbSort([1, 'b', 2, 'a']), [1, 2, 'a', 'b']);
test(dbSort(['z', 1, 'a', 2, 'b', 3]), [1, 2, 3, 'a', 'b', 'z']);
test(dbSort([3, 1, 2]), [1, 2, 3]);
test(dbSort(['c', 'a', 'b']), ['a', 'b', 'c']);
test(dbSort([10, 'hello', 1, 'world']), [1, 10, 'hello', 'world']);
