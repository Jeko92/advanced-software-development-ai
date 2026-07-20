// Your task is to remove all duplicate words from a string, leaving only single (first) words entries.

import { test } from "@/test.ts";

function removeDuplicateWords(s: string): string {
  // your code here
}

test(removeDuplicateWords("alpha beta beta gamma gamma gamma delta alpha beta"), "alpha beta gamma delta");
test(removeDuplicateWords("hello world hello"), "hello world");
test(removeDuplicateWords("one"), "one");
test(removeDuplicateWords("a b c a b c"), "a b c");
test(removeDuplicateWords("foo foo foo"), "foo");
