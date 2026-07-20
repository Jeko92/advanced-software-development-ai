import { test } from "@/test.ts";

function getSize(w: number, h: number, d: number): number[] {
  // your code here
}

test(getSize(1, 1, 1), [6, 1]);
test(getSize(2, 3, 4), [52, 24]);
test(getSize(1, 2, 3), [22, 6]);
test(getSize(5, 5, 5), [150, 125]);
test(getSize(10, 1, 1), [42, 10]);
