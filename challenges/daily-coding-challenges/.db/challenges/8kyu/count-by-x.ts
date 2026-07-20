import { test } from "@/test.ts";

function countBy(x: number, n: number): number[] {
  // your code here
}

test(countBy(1, 5), [1, 2, 3, 4, 5]);
test(countBy(2, 5), [2, 4, 6, 8, 10]);
test(countBy(3, 3), [3, 6, 9]);
test(countBy(10, 3), [10, 20, 30]);
test(countBy(5, 1), [5]);
