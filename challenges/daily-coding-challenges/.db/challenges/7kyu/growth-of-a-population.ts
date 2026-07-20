import { test } from "@/test.ts";

function nbYear(p0: number, percent: number, aug: number, p: number): number {
  // your code here
}

test(nbYear(1500, 5, 100, 5000), 15);
test(nbYear(1500000, 2.5, 10000, 2000000), 10);
test(nbYear(1000000, 0, 1000, 1001000), 1);
test(nbYear(1500, 5, 100, 1500), 0);
test(nbYear(100, 10, 0, 200), 8);
