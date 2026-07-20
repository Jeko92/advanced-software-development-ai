// Find the last element of the given argument(s).
// Examples
// last([1, 2, 3, 4] ) // =>  4
// last("xyz")         // => "z"
// last(1, 2, 3, 4)    // =>  4
// In javascript and CoffeeScript a list will be an array, a string or the list of arguments.

import { test } from "@/test.ts";

function last(...args: any[]): any {
  // your code here
}

test(last([1, 2, 3, 4]), 4);
test(last("xyz"), "z");
test(last(1, 2, 3, 4), 4);
test(last([5]), 5);
test(last("a"), "a");
