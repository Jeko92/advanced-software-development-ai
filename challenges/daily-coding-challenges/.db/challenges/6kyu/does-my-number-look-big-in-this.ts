/*
https://www.codewars.com/kata/does-my-number-look-big-in-this/javascript
A Narcissistic Number is a number which is the sum of its own digits, each raised to the power of the number
of digits in a given base. In this Kata, we will restrict ourselves to decimal (base 10).
For example, take 153 (3 digits):
1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153
*/

import { test } from "@/test.ts";

function narcissistic(value: number): boolean {
  // your code here
}

test(narcissistic(153), true);
test(narcissistic(370), true);
test(narcissistic(371), true);
test(narcissistic(1634), true);
test(narcissistic(123), false);
