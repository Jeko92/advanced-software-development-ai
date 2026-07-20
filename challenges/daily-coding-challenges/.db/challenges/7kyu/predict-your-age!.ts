// My grandfather always predicted how old people would get, and right before he passed away
// he revealed his secret!
// In honor of my grandfather's memory we will write a function using his formula!
// Take a list of ages when each of your great-grandparent died.
// Multiply each number by itself.
// Add them all together.
// Take the square root of the result.
// Divide by two.

import { test } from "@/test.ts";

function predictAge(
  age1: number,
  age2: number,
  age3: number,
  age4: number,
  age5: number,
  age6: number,
  age7: number,
  age8: number
): number {
  // your code here
}

test(predictAge(65, 60, 75, 55, 60, 63, 64, 45), 59);
test(predictAge(100, 100, 100, 100, 100, 100, 100, 100), 141);
test(predictAge(50, 50, 50, 50, 50, 50, 50, 50), 70);
test(predictAge(80, 70, 60, 90, 75, 85, 65, 55), 74);
test(predictAge(0, 0, 0, 0, 0, 0, 0, 0), 0);
