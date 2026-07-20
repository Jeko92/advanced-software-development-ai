import { test } from "@/test.ts";

function divisibleBy(numbers: number[], divisor: number): number[] {
  // your code here
}

test(divisibleBy([1, 2, 3, 4, 5, 6], 2), [2, 4, 6]);
test(divisibleBy([1, 2, 3, 4, 5, 6], 3), [3, 6]);
test(divisibleBy([1, 2, 3, 4, 5, 6], 7), []);
test(divisibleBy([10, 20, 30], 10), [10, 20, 30]);
test(divisibleBy([7, 14, 21], 7), [7, 14, 21]);
