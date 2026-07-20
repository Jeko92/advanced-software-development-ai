import { test } from "@/test.ts";

function isSquare(n: number): boolean {
  // your code here
}

test(isSquare(0), true);
test(isSquare(1), true);
test(isSquare(4), true);
test(isSquare(9), true);
test(isSquare(3), false);
