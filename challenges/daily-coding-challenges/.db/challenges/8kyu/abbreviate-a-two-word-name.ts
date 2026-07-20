import { test } from "@/test.ts";

function abbrevName(name: string): string {
  // your code here
}

test(abbrevName("Sam Harris"), "S.H");
test(abbrevName("Patrick Feeney"), "P.F");
test(abbrevName("john doe"), "J.D");
test(abbrevName("Anna Smith"), "A.S");
test(abbrevName("x y"), "X.Y");
