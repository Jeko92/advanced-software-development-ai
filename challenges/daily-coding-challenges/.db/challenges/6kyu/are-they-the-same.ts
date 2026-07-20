/*
Given two arrays a and b write a function comp(a, b) (compSame(a, b) in Clojure) that checks whether the two arrays have the "same"
elements, with the same multiplicities. "Same" means, here, that the elements in b are the elements in a squared, regardless of the order.
Examples
Valid arrays
a = [121, 144, 19, 161, 19, 144, 19, 11]
b = [121, 14641, 20736, 361, 25921, 361, 20736, 361]
*/

import { test } from "@/test.ts";

function comp(a1: number[] | null, a2: number[] | null): boolean {
  // your code here
}

test(comp([1, 2, 3], [1, 4, 9]), true);
test(comp([121, 144, 19, 161, 19, 144, 19, 11], [121, 14641, 20736, 361, 25921, 361, 20736, 361]), true);
test(comp([2, 2, 3], [4, 9, 9]), false);
test(comp(null, [1, 4]), false);
test(comp([], []), true);
