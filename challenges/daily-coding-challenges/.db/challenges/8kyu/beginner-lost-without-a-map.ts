import { test } from "@/test.ts";

function maps(ar: number[]): number[] {
  // your code here
}

test(maps([1, 2, 3]), [2, 4, 6]);
test(maps([0]), [0]);
test(maps([-1, -2, -3]), [-2, -4, -6]);
test(maps([10, 20, 30]), [20, 40, 60]);
test(maps([5]), [10]);
