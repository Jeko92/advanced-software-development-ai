// Given a string of words (x), you need to return an array of the words,
// sorted alphabetically by the final character in each.
// If two words have the same last letter, they returned array should show them
// in the order they appeared in the given string.

import { test } from "@/test.ts";

function last(str: string): string[] {
  // your code here
}

test(last("man i need a taxi up to ubud"), ["a", "taxi", "need", "ubud", "up", "man", "i", "to"]);
test(last("how are you"), ["are", "how", "you"]);
test(last("go do that"), ["that", "do", "go"]);
test(last("hello world"), ["hello", "world"]);
test(last("a b c"), ["a", "b", "c"]);
