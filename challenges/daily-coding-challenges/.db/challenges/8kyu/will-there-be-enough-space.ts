import { test } from "@/test.ts";

function enough(cap: number, on: number, wait: number): number {
  // your code here
}

test(enough(10, 5, 5), 0);
test(enough(10, 5, 6), 1);
test(enough(10, 8, 5), 3);
test(enough(100, 60, 50), 10);
test(enough(5, 5, 0), 0);
