// In John's car the GPS records every s seconds the distance travelled from an origin (distances are measured in an
// arbitrary but consistent unit). For example, below is part of a record with s = 15:
// x = [0.0, 0.19, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25]
// The sections are:
// 0.0-0.19, 0.19-0.5, 0.5-0.75, 0.75-1.0, 1.0-1.25, 1.25-1.50, 1.5-1.75, 1.75-2.0, 2.0-2.25
// We can calculate John's average hourly speed on every section and we get:
// [45.6, 74.4, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0]
// Given s and x the task is to return as an integer the *floor* of the maximum average speed per hour obtained on the
// sections of x. If x length is less than or equal to 1 return 0 since the car didn't move.

import { test } from "@/test.ts";

function gps(s: number, a: number[]): number {
  // your code here
}

test(gps(15, [0.0, 0.19, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25]), 74);
test(gps(10, [0, 1, 2, 3]), 360);
test(gps(60, [0, 1]), 60);
test(gps(30, [0.0]), 0);
test(gps(20, [0, 0.5, 1.0, 1.5]), 90);
