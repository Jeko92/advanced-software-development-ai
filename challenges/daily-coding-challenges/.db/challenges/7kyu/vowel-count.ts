import { test } from "@/test.ts";

function getCount(str: string): number {
  // your code here
}

test(getCount("abracadabra"), 5);
test(getCount(""), 0);
test(getCount("aeiou"), 5);
test(getCount("bcdfg"), 0);
test(getCount("Hello World"), 3);
