/*
https://www.codewars.com/kata/534d2f5b5371ecf8d2000a08
Description:
Your task, is to create NxN multiplication table, of size provided in parameter.
for example, when given size is 3:
1 2 3
2 4 6
3 6 9
for given example, the return value should be: [[1,2,3],[2,4,6],[3,6,9]]
*/

import { test } from "@/test.ts";

function multiplicationTable(n: number): number[][] {
  // your code here
}

test(multiplicationTable(1), [[1]]);
test(multiplicationTable(2), [[1, 2], [2, 4]]);
test(multiplicationTable(3), [[1, 2, 3], [2, 4, 6], [3, 6, 9]]);
test(multiplicationTable(4), [[1, 2, 3, 4], [2, 4, 6, 8], [3, 6, 9, 12], [4, 8, 12, 16]]);
test(multiplicationTable(5), [[1, 2, 3, 4, 5], [2, 4, 6, 8, 10], [3, 6, 9, 12, 15], [4, 8, 12, 16, 20], [5, 10, 15, 20, 25]]);
