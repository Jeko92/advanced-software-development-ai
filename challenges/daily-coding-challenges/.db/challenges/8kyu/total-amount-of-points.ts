// Our football team finished the championship. The result of each match look like "x:y". Results of all matches are recorded
// in the collection.
// For example: ["3:1", "2:2", "0:1", ...]
// Write a function that takes such collection and counts the points of our team in the championship. Rules for counting points
// for each match:
// if x>y - 3 points
// if x<y - 0 point
// if x=y - 1 point

import { test } from "@/test.ts";

function points(a: string[]): number {
  // your code here
}

test(points(["3:1", "2:2", "0:1"]), 4);
test(points([]), 0);
test(points(["1:0", "2:0", "3:0"]), 9);
test(points(["0:1", "0:2", "0:3"]), 0);
test(points(["1:1", "2:2"]), 2);
