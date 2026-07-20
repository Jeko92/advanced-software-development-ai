// Given an array of integers your solution should find the smallest integer.

import { test } from "@/test.ts";

class SmallestIntegerFinder {
  findSmallestInt(args: number[]): number {
    // your code here
  }
}

const finder = new SmallestIntegerFinder();
test(finder.findSmallestInt([34, 15, 88, 2]), 2);
test(finder.findSmallestInt([34, 15, 88, 2, 0]), 0);
test(finder.findSmallestInt([1]), 1);
test(finder.findSmallestInt([-5, 3, 10]), -5);
test(finder.findSmallestInt([100, 200, 50]), 50);
