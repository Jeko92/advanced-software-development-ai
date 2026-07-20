// Given an array/list [] of n integers , Arrange them in a way similar to the to-and-fro movement of a Pendulum
// The Smallest element of the list of integers , must come in center position of array/list.
// pendulum ([6, 6, 8 ,5 ,10]) ==> [10, 6, 5, 6, 8]

import { test } from "@/test.ts";

function pendulum(a: number[]): number[] {
  // your code here
}

test(pendulum([6, 6, 8, 5, 10]), [10, 6, 5, 6, 8]);
test(pendulum([1, 2, 3]), [3, 1, 2]);
test(pendulum([1]), [1]);
test(pendulum([3, 1, 2]), [3, 1, 2]);
test(pendulum([5, 4, 3, 2, 1]), [5, 3, 1, 2, 4]);
