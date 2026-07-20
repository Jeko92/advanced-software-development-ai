/*
https://www.codewars.com/kata/5174a4c0f2769dd8b1000003/
Finish the solution so that it sorts the passed in array of numbers.
If the function passes in an empty array or null/nil value then it should return an empty array.
For example:
solution([1, 2, 10, 50, 5]); // should return [1,2,5,10,50]
solution(null); // should return []
*/

import { test } from "@/test.ts";

function solution(nums: number[] | null): number[] {
  // your code here
}

test(solution([1, 2, 10, 50, 5]), [1, 2, 5, 10, 50]);
test(solution(null), []);
test(solution([]), []);
test(solution([3, 1, 2]), [1, 2, 3]);
test(solution([5, 5, 5]), [5, 5, 5]);
