// Take an array and remove every second element out of that array. Always keep the first element and
// start removing with the next element.

import { test } from "@/test.ts";

function removeEveryOther(ar: unknown[]): unknown[] {
  // your code here
}

test(removeEveryOther([1, 2, 3, 4, 5]), [1, 3, 5]);
test(removeEveryOther([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), [1, 3, 5, 7, 9]);
test(removeEveryOther(["a", "b", "c"]), ["a", "c"]);
test(removeEveryOther([1]), [1]);
test(removeEveryOther([]), []);
