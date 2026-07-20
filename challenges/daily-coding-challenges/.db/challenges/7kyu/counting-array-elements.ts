// Write a function that takes an array and counts the number of each unique element present.
// count(['james', 'james', 'john'])
// #=> { 'james': 2, 'john': 1}

import { test } from "@/test.ts";

function count(a: string[]): Record<string, number> {
  // your code here
}

test(count(['james', 'james', 'john']), { james: 2, john: 1 });
test(count(['a', 'b', 'a', 'c', 'b', 'a']), { a: 3, b: 2, c: 1 });
test(count(['hello']), { hello: 1 });
test(count([]), {});
test(count(['x', 'x', 'x']), { x: 3 });
