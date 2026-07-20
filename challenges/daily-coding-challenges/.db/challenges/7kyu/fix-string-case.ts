// In this Kata, you will be given a string that may have mixed uppercase and lowercase letters and
// your task is to convert that string to either lowercase only or uppercase only based on:

// make as few changes as possible.
// if the string contains equal number of uppercase and lowercase letters, convert the string to lowercase.

import { test } from "@/test.ts";

function solve(s: string): string {
  // your code here
}

test(solve("hello"), "hello");
test(solve("HELLO"), "HELLO");
test(solve("HEllo"), "HELLO");
test(solve("hELLO"), "hello");
test(solve("abcDEF"), "abcdef");
