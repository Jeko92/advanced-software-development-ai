// Here we have a function that help us spam our hearty laughter. But is not working! I need you to find out why...
// Expected results:
// spam(1);  // hue
// spam(6);  // huehuehuehuehuehue
// spam(14); // huehuehuehuehuehuehuehuehuehuehuehuehuehue

import { test } from "@/test.ts";

function spam(number: number): string {
  // your code here
}

test(spam(1), "hue");
test(spam(3), "huehuehue");
test(spam(6), "huehuehuehuehuehue");
test(spam(0), "");
test(spam(2), "huehue");
