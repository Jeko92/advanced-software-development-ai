import { test } from "@/test.ts";

function cubeChecker(volume: number, side: number): boolean {
  // your code here
}

test(cubeChecker(8, 2), true);
test(cubeChecker(27, 3), true);
test(cubeChecker(10, 2), false);
test(cubeChecker(1, 1), true);
test(cubeChecker(8, 0), false);
