/*
Your task is to sort a given string. Each word in the string will contain a single number. This number is the position the
word should have in the result.
Note: Numbers can be from 1 to 9. So 1 will be the first word (not 0).
*/

import { test } from "@/test.ts";

function order(s: string): string {
  // your code here
}

test(order("is2 Thi1s T4est 3a"), "Thi1s is2 3a T4est");
test(order("4of Fo1r pe6ople g3ood th5e the2"), "Fo1r the2 g3ood 4of th5e pe6ople");
test(order(""), "");
test(order("d4 a1 c3 b2"), "a1 b2 c3 d4");
test(order("one1 two2 three3"), "one1 two2 three3");
