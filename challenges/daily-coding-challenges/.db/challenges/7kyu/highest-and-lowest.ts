import { test } from "@/test.ts";

function highAndLow(str: string): string {
  // your code here
}

test(highAndLow("1 2 3 4 5"), "5 1");
test(highAndLow("1 2 -3 4 5"), "5 -3");
test(highAndLow("1 9 3 4 -5"), "9 -5");
test(highAndLow("8 3"), "8 3");
test(highAndLow("0"), "0 0");
