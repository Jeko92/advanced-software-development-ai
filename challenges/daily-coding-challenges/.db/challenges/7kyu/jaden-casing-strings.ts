import { test } from "@/test.ts";

function toJadenCase(str: string): string {
  // your code here
}

test(toJadenCase("how can mirrors be real if our eyes aren't real"), "How Can Mirrors Be Real If Our Eyes Aren't Real");
test(toJadenCase("hello world"), "Hello World");
test(toJadenCase("a"), "A");
test(toJadenCase("the quick brown fox"), "The Quick Brown Fox");
test(toJadenCase("i am"), "I Am");
