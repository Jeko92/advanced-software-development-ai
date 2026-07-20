/*
https://www.codewars.com/kata/list-filtering
In this kata you will create a function that takes a list of non-negative integers and
strings and returns a new list with the strings filtered out.
*/

import { test } from "@/test.ts";

function filter_list(ar: (string | number)[]): number[] {
  // your code here
}

test(filter_list([1, 2, 'a', 'b']), [1, 2]);
test(filter_list([1, 'a', 'b', 0, 15]), [1, 0, 15]);
test(filter_list([1, 2, 'aasf', '1', '123', 123]), [1, 2, 123]);
test(filter_list([]), []);
test(filter_list(['a', 'b', 'c']), []);
