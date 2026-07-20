// Write a function that converts any sentence into a V A P O R W A V E sentence. a V A P O R W A V E sentence converts all the
// letters into uppercase, and adds 2 spaces between each letter (or special character) to create this V A P O R W A V E effect.

import { test } from "@/test.ts";

function vaporcode(s: string): string {
  // your code here
}

test(vaporcode("Vaporwave"), "V  A  P  O  R  W  A  V  E");
test(vaporcode("hello"), "H  E  L  L  O");
test(vaporcode("a b"), "A  B");
test(vaporcode("Hi"), "H  I");
test(vaporcode("xyz"), "X  Y  Z");
