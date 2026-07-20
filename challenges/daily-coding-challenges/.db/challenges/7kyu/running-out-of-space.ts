/*
https://www.codewars.com/kata/56576f82ab83ee8268000059
Description:
Kevin is noticing his space run out! Write a function that removes the spaces from the values and returns an
array showing the space decreasing. For example, running this function on the array ['i', 'have','no','space']
would produce ['i','ihave','ihaveno','ihavenospace'].
*/

import { test } from "@/test.ts";

function spacey(ar: string[]): string[] {
  // your code here
}

test(spacey(["i", "have", "no", "space"]), ["i", "ihave", "ihaveno", "ihavenospace"]);
test(spacey(["a", "b", "c"]), ["a", "ab", "abc"]);
test(spacey(["hello"]), ["hello"]);
test(spacey(["foo", "bar"]), ["foo", "foobar"]);
test(spacey(["x", "y", "z", "w"]), ["x", "xy", "xyz", "xyzw"]);
