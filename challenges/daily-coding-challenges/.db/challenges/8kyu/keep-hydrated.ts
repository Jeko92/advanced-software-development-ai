import { test } from "@/test.ts";

function litres(time: number): number {
  // your code here
}

test(litres(2), 1);
test(litres(1.4), 0);
test(litres(12.3), 6);
test(litres(0.82), 0);
test(litres(11.8), 5);
