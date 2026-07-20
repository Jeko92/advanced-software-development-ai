/*
Your team is writing a fancy new text editor and you've been tasked with implementing the line numbering.
Write a function which takes a list of strings and returns each line prepended by the correct number.
The numbering starts at 1. The format is n: string. Notice the colon and space in between.
*/

import { test } from "@/test.ts";

function number(ar: string[]): string[] {
  // your code here
}

test(number(["a", "b", "c"]), ["1: a", "2: b", "3: c"]);
test(number([""]), ["1: "]);
test(number(["one", "two"]), ["1: one", "2: two"]);
test(number(["x", "y", "z", "w"]), ["1: x", "2: y", "3: z", "4: w"]);
test(number(["hello world"]), ["1: hello world"]);
