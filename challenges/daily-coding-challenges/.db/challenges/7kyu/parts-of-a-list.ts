/*
Write a function partlist that gives all the ways to divide a list (an array) of at least
two elements into two non-empty parts.
Each two non empty parts will be in a pair
Each part will be in a string
Elements of a pair must be in the same order as in the original array.
Examples of returns in different languages:
a = ["az", "toto", "picaro", "zone", "kiwi"] -->
[["az", "toto picaro zone kiwi"], ["az toto", "picaro zone kiwi"], ["az toto picaro", "zone kiwi"],
["az toto picaro zone", "kiwi"]]
*/

import { test } from "@/test.ts";

function partlist(arr: string[]): [string, string][] {
  // your code here
}

test(partlist(["az", "toto", "picaro", "zone", "kiwi"]), [["az", "toto picaro zone kiwi"], ["az toto", "picaro zone kiwi"], ["az toto picaro", "zone kiwi"], ["az toto picaro zone", "kiwi"]]);
test(partlist(["a", "b"]), [["a", "b"]]);
test(partlist(["a", "b", "c"]), [["a", "b c"], ["a b", "c"]]);
test(partlist(["hello", "world", "foo"]), [["hello", "world foo"], ["hello world", "foo"]]);
test(partlist(["1", "2", "3", "4"]), [["1", "2 3 4"], ["1 2", "3 4"], ["1 2 3", "4"]]);
