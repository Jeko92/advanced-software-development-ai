/*
https://www.codewars.com/kata/5667e8f4e3f572a8f2000039
This time no story, no theory. The examples below show you how to write function accum:
Examples:
accum("abcd") -> "A-Bb-Ccc-Dddd"
accum("RqaEzty") -> "R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy"
accum("cwAt") -> "C-Ww-Aaa-Tttt"
*/

import { test } from "@/test.ts";

function accum(str: string): string {
  // your code here
}

test(accum("abcd"), "A-Bb-Ccc-Dddd");
test(accum("RqaEzty"), "R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy");
test(accum("cwAt"), "C-Ww-Aaa-Tttt");
test(accum("a"), "A");
test(accum("xyz"), "X-Yy-Zzz");
