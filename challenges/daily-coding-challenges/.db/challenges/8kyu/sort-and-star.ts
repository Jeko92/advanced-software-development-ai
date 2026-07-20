/*
You will be given an vector of string(s). You must sort it alphabetically (case-sensitive!!)
and then return the first value.
The returned value must be a string, and have "***" between each of its letters.
You should not remove or add elements from/to the array.
*/

import { test } from "@/test.ts";

function twoSort(ar: string[]): string {
  // your code here
}

test(twoSort(["banana", "apple", "cherry"]), "a***p***p***l***e");
test(twoSort(["hello", "world"]), "h***e***l***l***o");
test(twoSort(["a"]), "a");
test(twoSort(["cat", "bat", "ant"]), "a***n***t");
test(twoSort(["zoo", "abc"]), "a***b***c");
