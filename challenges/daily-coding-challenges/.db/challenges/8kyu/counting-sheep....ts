// Consider an array of sheep where some sheep may be missing from their place.
// We need a function that counts the number of sheep present in the array (true means present).

import { test } from "@/test.ts";

function countSheeps(a: (boolean | undefined | null)[]): number {
  // your code here
}

test(countSheeps([true, false, true, true]), 3);
test(countSheeps([false, false, false]), 0);
test(countSheeps([true, true, true]), 3);
test(countSheeps([null, undefined, true, false]), 1);
test(countSheeps([]), 0);
