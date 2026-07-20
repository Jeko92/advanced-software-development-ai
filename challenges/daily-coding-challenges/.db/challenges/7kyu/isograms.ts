import { test } from "@/test.ts";

function isIsogram(s: string): boolean {
  // your code here
}

test(isIsogram("Dermatoglyphics"), true);
test(isIsogram("isogram"), true);
test(isIsogram("aba"), false);
test(isIsogram("moOse"), false);
test(isIsogram(""), true);
