import { test } from "@/test.ts";

function getMiddle(str: string): string {
  // your code here
}

test(getMiddle("test"), "es");
test(getMiddle("testing"), "t");
test(getMiddle("middle"), "dd");
test(getMiddle("A"), "A");
test(getMiddle("of"), "of");
