// Write an algorithm that takes an array and moves all of the zeros to the end, preserving the order of the other elements.
// moveZeros([false,1,0,1,2,0,1,3,"a"]) // returns[false,1,1,2,1,3,"a",0,0]

import { test } from "@/test.ts";

function moveZeros(a: unknown[]): unknown[] {
    // your code here
}

test(moveZeros([false, 1, 0, 1, 2, 0, 1, 3, "a"]), [false, 1, 1, 2, 1, 3, "a", 0, 0]);
test(moveZeros([0, 0, 0, 1, 2, 3]), [1, 2, 3, 0, 0, 0]);
test(moveZeros([1, 2, 3]), [1, 2, 3]);
test(moveZeros([0, 0, 0]), [0, 0, 0]);
test(moveZeros([0, "a", false, 0, 5]), ["a", false, 5, 0, 0]);
