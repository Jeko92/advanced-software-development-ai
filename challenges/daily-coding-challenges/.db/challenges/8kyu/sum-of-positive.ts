import { test } from "@/test.ts";

function positiveSum(arr: number[]): number {
  // your code here
}

test(positiveSum([1, 2, 3, 4, 5]), 15);
test(positiveSum([-1, 2, 3, -4, 5]), 10);
test(positiveSum([]), 0);
test(positiveSum([-1, -2, -3]), 0);
test(positiveSum([0, 5, 10]), 15);
