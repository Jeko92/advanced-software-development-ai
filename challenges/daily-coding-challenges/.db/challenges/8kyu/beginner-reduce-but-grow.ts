import { test } from "@/test.ts";

function grow(x: number[]): number {
  // your code here
}

test(grow([1, 2, 3]), 6);
test(grow([1, 2, 3, 4]), 24);
test(grow([2, 2, 2]), 8);
test(grow([5]), 5);
test(grow([1, 1, 1, 1]), 1);
