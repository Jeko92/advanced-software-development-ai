import { test } from "@/test.ts";

function makeUpperCase(str: string): string {
  // your code here
}

test(makeUpperCase("hello"), "HELLO");
test(makeUpperCase(""), "");
test(makeUpperCase("world"), "WORLD");
test(makeUpperCase("abc"), "ABC");
test(makeUpperCase("Hello World"), "HELLO WORLD");
