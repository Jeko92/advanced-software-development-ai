import { test } from "@/test.ts";

function setAlarm(employed: boolean, vacation: boolean): boolean {
  // your code here
}

test(setAlarm(true, false), true);
test(setAlarm(true, true), false);
test(setAlarm(false, false), false);
test(setAlarm(false, true), false);
test(setAlarm(true, false), true);
