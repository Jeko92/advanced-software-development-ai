/*
https://www.codewars.com/kata/52840d2b27e9c932ff0016ae/train/javascript
Write a function that gets a sequence and value and returns true/false depending
on whether the variable exists in a multidimentional sequence.

Example:

locate(['a','b',['c','d',['e']]],'e'); // should return true
locate(['a','b',['c','d',['e']]],'a'); // should return true
locate(['a','b',['c','d',['e']]],'f'); // should return false
*/

import { test } from "@/test.ts";

type NestedArray = (unknown | NestedArray)[];

function locate(array: NestedArray, value: unknown): boolean {
    // your code here
}

test(locate(["a", "b", ["c", "d", ["e"]]], "e"), true);
test(locate(["a", "b", ["c", "d", ["e"]]], "a"), true);
test(locate(["a", "b", ["c", "d", ["e"]]], "f"), false);
test(locate([1, [2, [3, [4]]]], 4), true);
test(locate([1, [2, [3, [4]]]], 5), false);
