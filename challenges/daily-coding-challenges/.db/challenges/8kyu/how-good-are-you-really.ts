import { test } from "@/test.ts";

function betterThanAverage(all: number[], own: number): boolean {
  // your code here
}

test(betterThanAverage([2, 3], 5), true);
test(betterThanAverage([100, 40, 34, 57, 29, 72, 57, 88], 75), false);
test(betterThanAverage([1, 1, 1], 2), true);
test(betterThanAverage([10, 10, 10], 10), false);
test(betterThanAverage([0, 100], 50), false);
