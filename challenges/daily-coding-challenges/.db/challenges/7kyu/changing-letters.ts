/*
When provided with a String, capitalize all vowels
For example:
Input : "Hello World!"
Output : "HEllO WOrld!"
*/

import { test } from "@/test.ts";

function swap(s: string): string {
  // your code here
}

test(swap("Hello World!"), "HEllO WOrld!");
test(swap("codewars"), "cOdEwArs");
test(swap("aeiou"), "AEIOU");
test(swap("bcdfg"), "bcdfg");
test(swap("Programming"), "PrOgrAmmIng");
