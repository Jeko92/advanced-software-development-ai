/*
https://www.codewars.com/kata/530017aac7c0f49926000084/
Description:
Implement a function which takes a sequence of objects and a property name, and returns a sequence
containing the named property of each object.
For example:
pluck([{a:1}, {a:2}], 'a')      // -> [1,2]
pluck([{a:1, b:3}, {a:2}], 'b') // -> [3, undefined]
If an object is missing the property, you should just leave it as undefined/None in the output array.
*/

import { test } from "@/test.ts";

function pluck(objs: Record<string, unknown>[], name: string): unknown[] {
  // your code here
}

test(pluck([{ a: 1 }, { a: 2 }], "a"), [1, 2]);
test(pluck([{ a: 1, b: 3 }, { a: 2 }], "b"), [3, undefined]);
test(pluck([{ x: "foo" }, { x: "bar" }], "x"), ["foo", "bar"]);
test(pluck([], "a"), []);
test(pluck([{ a: 1 }, { b: 2 }], "a"), [1, undefined]);
