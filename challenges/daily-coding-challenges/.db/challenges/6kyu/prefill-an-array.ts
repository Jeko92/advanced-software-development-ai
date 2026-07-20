/*
https://www.codewars.com/kata/54129112fb7c188740000162/train/javascript
Description:
Create the function prefill that returns an array of n elements that all have the same value v.
See if you can do this without using a loop.

You have to validate input:

v can be anything (primitive or otherwise)
if v is ommited, fill the array with undefined
if n is 0, return an empty array
if n is anything other than an integer or integer-formatted string (e.g. '123') that is >=0, throw a TypeError
When throwing a TypeError, the message should be n is invalid, where you replace n for the actual value passed
to the function.

Code Examples

    prefill(3,1) --> [1,1,1]

    prefill(2,"abc") --> ['abc','abc']

    prefill("1", 1) --> [1]

    prefill(3, prefill(2,'2d'))
      --> [['2d','2d'],['2d','2d'],['2d','2d']]

    prefill("xyz", 1)
      --> throws TypeError with message "xyz is invalid"
*/

import { test } from "@/test.ts";

function prefill(n: number | string | boolean, v?: any): any[] {
  // your code here
}

test(prefill(3, 1), [1, 1, 1]);
test(prefill(2, "abc"), ["abc", "abc"]);
test(prefill("1", 1), [1]);
test(prefill(0, 5), []);
test(prefill(4, true), [true, true, true, true]);
