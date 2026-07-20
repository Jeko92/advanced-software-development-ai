// Add the isUpperCase method to String to see whether the string is ALL CAPS.

import { test } from "@/test.ts";

declare global {
  interface String {
    isUpperCase(): boolean;
  }
}

String.prototype.isUpperCase = function (): boolean {
  // your code here
};

test("HELLO".isUpperCase(), true);
test("hello".isUpperCase(), false);
test("Hello".isUpperCase(), false);
test("".isUpperCase(), true);
test("HELLO WORLD".isUpperCase(), true);
