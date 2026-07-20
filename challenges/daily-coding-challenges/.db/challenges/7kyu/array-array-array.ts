/*
You are given an initial 2-value array (x). You will use this to calculate a score.
If both values in (x) are numbers, the score is the sum of the two. If only one is a number,
the score is that number. If neither is a number, return 'Void!'.
Once you have your score, you must return an array of arrays. Each sub array will be the same
as (x) and the number of sub arrays should be equal to the score.
For example:
if (x) == ['a', 3] you should return [['a', 3], ['a', 3], ['a', 3]].
*/

import { test } from "@/test.ts";

function explode(x: (string | number)[]): (string | number)[][] | string {
  // your code here
}

test(explode(['a', 3]), [['a', 3], ['a', 3], ['a', 3]]);
test(explode([1, 2]), [[1, 2], [1, 2], [1, 2]]);
test(explode(['a', 'b']), 'Void!');
test(explode([2, 'x']), [[2, 'x'], [2, 'x']]);
test(explode([0, 0]), 'Void!');
