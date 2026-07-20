import { test } from "@/test.ts";

function reverseWords(str: string): string {
  // your code here
}

test(reverseWords("hello world"), "world hello");
test(reverseWords("one two three"), "three two one");
test(reverseWords("a"), "a");
test(reverseWords("the cat sat"), "sat cat the");
test(reverseWords("foo bar baz"), "baz bar foo");
