// Complete the function which returns the weekday according to the input number:
// 1 returns "Sunday"
// 2 returns "Monday"
// 3 returns "Tuesday"
// 4 returns "Wednesday"
// 5 returns "Thursday"
// 6 returns "Friday"
// 7 returns "Saturday"
// Otherwise returns "Wrong, please enter a number between 1 and 7"

import { test } from "@/test.ts";

function whatday(n: number): string {
  // your code here
}

test(whatday(1), "Sunday");
test(whatday(2), "Monday");
test(whatday(6), "Friday");
test(whatday(7), "Saturday");
test(whatday(8), "Wrong, please enter a number between 1 and 7");
