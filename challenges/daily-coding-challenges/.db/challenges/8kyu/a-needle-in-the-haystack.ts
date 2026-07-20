// Can you find the needle in the haystack?
// Write a function findNeedle() that takes an array full of junk but containing one "needle"
// After your function finds the needle it should return a message (as a string) that says:
// "found the needle at position " plus the index it found the needle

import { test } from "@/test.ts";

function findNeedle(haystack: string[]): string {
  // your code here
}

test(findNeedle(["hay", "junk", "needle", "more"]), "found the needle at position 2");
test(findNeedle(["needle"]), "found the needle at position 0");
test(findNeedle(["a", "b", "c", "needle"]), "found the needle at position 3");
test(findNeedle(["x", "needle", "y"]), "found the needle at position 1");
test(findNeedle(["junk", "junk", "junk", "junk", "needle"]), "found the needle at position 4");
