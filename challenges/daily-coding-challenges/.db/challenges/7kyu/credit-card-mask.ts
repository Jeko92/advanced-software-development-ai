/*
https://www.codewars.com/kata/5412509bd436bd33920011bc/train/javascript
Usually when you buy something, you're asked whether your credit card number, phone number or answer to your
most secret question is still correct. However, since someone could look over your shoulder, you don't want that
shown on your screen. Instead, we mask it.
Your task is to write a function maskify, which changes all but the last four characters into '#'.
*/

import { test } from "@/test.ts";

function maskify(s: string): string {
  // your code here
}

test(maskify("4556364607935616"), "############5616");
test(maskify("1"), "1");
test(maskify("11111"), "#1111");
test(maskify(""), "");
test(maskify("Maskarade"), "#####rade");
