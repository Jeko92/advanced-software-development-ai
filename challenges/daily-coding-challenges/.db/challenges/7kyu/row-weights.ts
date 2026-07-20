// Scenario
// Several people are standing in a row divided into two teams.
// The first person goes into team 1, the second goes into team 2, the third goes into team 1,
// and so on.
// Task
// Given an array of positive integers (the weights of the people), return a new array/tuple
// of two integers, where the first one is the total weight of team 1, and the second one is
// the total weight of team 2.

import { test } from "@/test.ts";

function rowWeights(arr: number[]): [number, number] {
  // your code here
}

test(rowWeights([13, 27, 49]), [62, 27]);
test(rowWeights([80, 50, 30]), [110, 50]);
test(rowWeights([5, 3, 7, 2, 8]), [20, 5]);
test(rowWeights([1, 2]), [1, 2]);
test(rowWeights([10]), [10, 0]);
