import { test } from "@/test.ts";

function divisibleByThree(str: string): boolean {
  // your code here
}

test(divisibleByThree("123"), true);
test(divisibleByThree("111"), true);
test(divisibleByThree("12"), false);
test(divisibleByThree("1"), false);
test(divisibleByThree("369"), true);
