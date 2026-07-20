/*
https://www.codewars.com/kata/5966e33c4e686b508700002d
Create a function that takes 2 positive integers in form of a string as an input,
and outputs the sum (also as a string):
*/

import { test } from "@/test.ts";

function sumStr(a: string, b: string): string {
  // your code here
}

test(sumStr("1", "2"), "3");
test(sumStr("10", "20"), "30");
test(sumStr("0", "0"), "0");
test(sumStr("99", "1"), "100");
test(sumStr("123", "456"), "579");
