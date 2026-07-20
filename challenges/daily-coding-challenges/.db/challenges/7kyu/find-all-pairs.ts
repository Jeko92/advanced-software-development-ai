import { test } from "@/test.ts";

function duplicates(array: number[]): number {
  // your code here
}

test(duplicates([1, 2, 3, 1, 2]), 2);
test(duplicates([1, 1, 1, 1]), 1);
test(duplicates([1, 2, 3]), 0);
test(duplicates([7, 7, 4, 4, 3]), 2);
test(duplicates([1, 1, 2, 2, 3, 3]), 3);
