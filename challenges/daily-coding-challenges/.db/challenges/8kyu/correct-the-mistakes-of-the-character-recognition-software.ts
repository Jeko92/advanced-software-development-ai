import { test } from "@/test.ts";

function correct(str: string): string {
  // your code here
}

test(correct("L0ve 1s a wonderful thing"), "LOve Is a wonderful thing");
test(correct("5OFT"), "SOFT");
test(correct("H1 there"), "HI there");
test(correct("0ld 5ch00l"), "Old SchOOl");
test(correct(""), "");
