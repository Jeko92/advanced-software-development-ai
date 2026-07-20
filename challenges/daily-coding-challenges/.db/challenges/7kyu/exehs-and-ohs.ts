import { test } from "@/test.ts";

function XO(s: string): boolean {
  // your code here
}

test(XO("xo"), true);
test(XO("Xo"), true);
test(XO("xxOo"), true);
test(XO("xxxm"), false);
test(XO("ooom"), false);
