// Americans are odd people: in their buildings, the first floor is actually the ground floor and there
// is no 13th floor ('cause of superstition).
// Write a function that given an American floor (passed as an integer) returns the real floor.
// Moreover, your function should work for basement floors too: just return the same value as the passed one.
// Usage Examples
// getRealFloor(1) == 0
// getRealFloor(0) == 0 // Special case to please Europeans
// getRealFloor(5) == 4
// getRealFloor(15) == 13
// getRealFloor(-3) == -3

import { test } from "@/test.ts";

function getRealFloor(f: number): number {
  // your code here
}

test(getRealFloor(1), 0);
test(getRealFloor(0), 0);
test(getRealFloor(5), 4);
test(getRealFloor(15), 13);
test(getRealFloor(-3), -3);
