// https://www.codewars.com/kata/5259b20d6021e9e14c0010d4/train/javascript

import { test } from "@/test.ts";

function reverseWords(str: string): string {
  // your code here
}

test(reverseWords("hello world"), "olleh dlrow");
test(reverseWords("The quick brown fox"), "ehT kciuq nworb xof");
test(reverseWords("abc"), "cba");
test(reverseWords("a b c"), "a b c");
test(reverseWords("double  spaces"), "elbuod  secaps");
