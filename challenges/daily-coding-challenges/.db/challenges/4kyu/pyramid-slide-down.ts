// /3/
// \7\ 4
// 2 \4\ 6
// 8 5 \9\ 3
// Your task is to write a function longestSlideDown that takes a pyramid representation as argument and returns its
// ' longest 'slide down'. Let's say that the 'slide down' is a sum of consecutive numbers from the top to the bottom
// of the pyramid. As you can see, the longest 'slide down' is 3 + 7 + 4 + 9 = 23

import { test } from "@/test.ts";

function longestSlideDown(a: number[][]): number {
  // your code here
}

test(longestSlideDown([[3], [7, 4], [2, 4, 6], [8, 5, 9, 3]]), 23);
test(longestSlideDown([[1]]), 1);
test(longestSlideDown([[1], [2, 3]]), 4);
test(longestSlideDown([[75], [95, 64], [17, 47, 82], [18, 35, 87, 10]]), 308);
test(longestSlideDown([[1], [1, 2], [3, 1, 2], [5, 2, 3, 1]]), 10);
