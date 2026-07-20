// Some new animals have arrived at the zoo. The zoo keeper is concerned that perhaps the animals
// do not have the right tails. To help her, you must correct the broken function to make sure that
// the second argument (tail), is the same as the last letter of the first argument (body) - otherwise
// the tail wouldn't fit!
// If the tail is right return true, else return false.

import { test } from "@/test.ts";

function correctTail(a: string, tail: string): boolean {
  // your code here
}

test(correctTail("cat", "t"), true);
test(correctTail("cat", "r"), false);
test(correctTail("fox", "x"), true);
test(correctTail("dog", "g"), true);
test(correctTail("horse", "e"), true);
