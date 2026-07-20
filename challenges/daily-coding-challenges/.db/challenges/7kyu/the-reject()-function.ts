/*
https://www.codewars.com/kata/52988f3f7edba9839c00037d/solutions/javascript
Implement a function which filters out array values which satisfy the given predicate.
reject([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0)  =>  [1, 3, 5]
*/

import { test } from "@/test.ts";

function reject<T>(ar: T[], predicate: (el: T) => boolean): T[] {
  // your code here
}

test(reject([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0), [1, 3, 5]);
test(reject([1, 2, 3], (n) => n > 2), [1, 2]);
test(reject(["a", "b", "c"], (s) => s === "b"), ["a", "c"]);
test(reject([10, 20, 30], (n) => n < 15), [20, 30]);
test(reject([], (n) => true), []);
