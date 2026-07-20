/*
Given a list of integers and a single sum value, return the first two values (parse from the left please) in order
of appearance that add up to form the sum.
Negative numbers and duplicate numbers can and will appear.
*/

import { test } from "@/test.ts";

function sum_pairs(list: number[], s: number): [number, number] | undefined {
    // your code here
}

test(sum_pairs([1, 4, 8, 7, 3, 15], 8), [1, 7]);
test(sum_pairs([1, -2, 3, 0, -6, 1], -6), [0, -6]);
test(sum_pairs([20, -13, 40], -7), undefined);
test(sum_pairs([1, 2, 3, 4, 1, 0], 2), [1, 1]);
test(sum_pairs([10, 5, 2, 3, 7, 5], 10), [3, 7]);
