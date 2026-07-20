import { test } from "@/test.ts";

function noSpace(x: string): string {
  // your code here
}

test(noSpace("8 j 8   mf 8 8 8 b 8  8 8 8 8 b 8 8 8 8 8 b  8 8"), "8j8mf8888b88888b88888b88");
test(noSpace("hello world"), "helloworld");
test(noSpace(""), "");
test(noSpace("a b c"), "abc");
test(noSpace("no spaces"), "nospaces");
