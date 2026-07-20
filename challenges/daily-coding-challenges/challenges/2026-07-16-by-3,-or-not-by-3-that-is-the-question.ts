import { test } from "@/test.ts";

function divisibleByThree(str: string): boolean {
  return Number(str) % 3 === 0;
}

test(divisibleByThree("123"), true);
test(divisibleByThree("111"), true);
test(divisibleByThree("12"), true);
test(divisibleByThree("1"), false);
test(divisibleByThree("369"), true);
