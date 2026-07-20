// Today Suzuki will be interviewing his students to ensure they are progressing in their training. He decided to schedule
// the interviews based on the length of the students name in descending order. The students will line up and wait for their
// turn. You will be given a string of student names. Sort them and return a list of names in descending order.
// Here is an example input:
// string = 'Tadashi Takahiro Takao Takashi Takayuki Takehiko Takeo Takeshi Takeshi'
// Names of equal length will be returned in reverse alphabetical order (Z->A) such that:
// string = "xxa xxb xxc xxd xa xb xc xd"
// Returns
// ['xxd', 'xxc', 'xxb', 'xxa', 'xd', 'xc', 'xb', 'xa']

import { test } from "@/test.ts";

function lineupStudents(s: string): string[] {
  // your code here
}

test(lineupStudents("xxa xxb xxc xxd xa xb xc xd"), ["xxd", "xxc", "xxb", "xxa", "xd", "xc", "xb", "xa"]);
test(lineupStudents("Alice Bob Charlie"), ["Charlie", "Alice", "Bob"]);
test(lineupStudents("Tom Ann Ben"), ["Tom", "Ann", "Ben"]);
test(lineupStudents("a bb ccc"), ["ccc", "bb", "a"]);
test(lineupStudents("az aa ab"), ["az", "ab", "aa"]);
