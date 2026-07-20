// Challenge: You are given a list of numbers. The numbers each repeat a certain number of times.
// Remove all numbers that repeat an odd number of times while keeping everything else the same.

// oddOnesOut([1, 2, 3, 1, 3, 3]) = [1, 1]
// In the above example:

// the number 1 appears twice
// the number 2 appears once
// the number 3 appears three times
// 2 and 3 both appear an odd number of times, so they are removed from the list. The final result is: [1,1]

import { test } from "@/test.ts";

function oddOnesOut(a: number[]): number[] {
  // your code here
}

test(oddOnesOut([1, 2, 3, 1, 3, 3]), [1, 1]);
test(oddOnesOut([1, 1, 2, 2]), [1, 1, 2, 2]);
test(oddOnesOut([5, 5, 5]), []);
test(oddOnesOut([]), []);
test(oddOnesOut([4, 4, 4, 4, 3, 3]), [4, 4, 4, 4, 3, 3]);
