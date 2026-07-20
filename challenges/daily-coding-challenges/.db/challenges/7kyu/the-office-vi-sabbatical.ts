// You need to approach your boss. Her decision will be based on three parameters:
// val=your value to the organisation
// happ=her happiness level at the time of asking and finally
// The numbers of letters from 'sabbatical' that are present in string 'x'.
// Note that if x contains three instances of the letter 'l', that still scores three points,
// even though there is only one in the word sabbatical.
// If the sum of the three parameters (as described above) is > 22, return 'Sabbatical! Boom!',
// else return 'Back to your desk, boy.'.

import { test } from "@/test.ts";

function sabb(x: string, val: number, happ: number): string {
  // your code here
}

test(sabb("sabbatical", 5, 5), "Sabbatical! Boom!");
test(sabb("xyz", 10, 10), "Sabbatical! Boom!");
test(sabb("abc", 1, 1), "Back to your desk, boy.");
test(sabb("sabbatical", 0, 0), "Back to your desk, boy.");
test(sabb("sssaaabbb", 10, 10), "Sabbatical! Boom!");
