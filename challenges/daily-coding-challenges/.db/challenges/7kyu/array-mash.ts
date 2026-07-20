// Mash 2 arrays together so that the returning array has alternating elements of the 2 arrays . Both arrays will always be the same length.
// eg. [1,2,3] + ['a','b','c'] = [1, 'a', 2, 'b', 3, 'c']

import { test } from "@/test.ts";

function arrayMash<T>(a: T[], b: T[]): T[] {
  // your code here
}

test(arrayMash([1, 2, 3], [4, 5, 6]), [1, 4, 2, 5, 3, 6]);
test(arrayMash(['a', 'b', 'c'], ['x', 'y', 'z']), ['a', 'x', 'b', 'y', 'c', 'z']);
test(arrayMash([1, 2], [3, 4]), [1, 3, 2, 4]);
test(arrayMash(['hello'], ['world']), ['hello', 'world']);
test(arrayMash([true, false], [false, true]), [true, false, false, true]);
