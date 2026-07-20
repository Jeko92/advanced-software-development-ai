import { test } from "@/test.ts";

function oddCount(n: number): number {
  // your code here
}

test(oddCount(7), 3);
test(oddCount(0), 0);
test(oddCount(1), 0);
test(oddCount(5), 2);
test(oddCount(10), 5);
