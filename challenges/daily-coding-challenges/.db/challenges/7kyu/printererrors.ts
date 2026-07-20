import { test } from "@/test.ts";

function printerError(s: string): string {
  // your code here
}

test(printerError("aaabbbbhaijjjm"), "0/14");
test(printerError("aaaxbbbbyyhh"), "3/12");
test(printerError("kkkwwwaaa"), "3/9");
test(printerError("abcdefghijklmn"), "0/14");
test(printerError("nopqrstuvwxyz"), "13/13");
