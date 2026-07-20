// Write a simple function that takes as a parameter a date object and returns a boolean value representing
// whether the date is today or not.
// Make sure that your function does not return a false positive by just checking just the day.

import { test } from "@/test.ts";

function isToday(date: Date): boolean {
  // your code here
}

test(isToday(new Date()), true);
test(isToday(new Date("2000-01-01")), false);
test(isToday(new Date("1999-12-31")), false);
test(isToday(new Date(Date.now() - 86400000)), false);
test(isToday(new Date(Date.now() + 86400000)), false);
