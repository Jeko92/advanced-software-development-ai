// You've been collecting change all day, and it's starting to pile up in your pocket, but you're too lazy
// to see how much you've found.
// Good thing you can code!
// Create change_count() to return a dollar amount of how much change you have!
// Valid types of change include:
// penny: 0.01
// nickel: 0.05
// dime: 0.10
// quarter: 0.25
// dollar: 1.00
// These amounts are already preloaded as floats into the CHANGE object for you to use!
// You should return the total in the format $x.xx.

import { test } from "@/test.ts";

const CHANGE: Record<string, number> = {
  penny: 0.01,
  nickel: 0.05,
  dime: 0.10,
  quarter: 0.25,
  dollar: 1.00,
};

function changeCount(s: string): string {
  // your code here
}

test(changeCount("penny nickel"), "$0.06");
test(changeCount("quarter dime"), "$0.35");
test(changeCount("dollar"), "$1.00");
test(changeCount("penny penny penny"), "$0.03");
test(changeCount("quarter quarter dollar"), "$1.50");
