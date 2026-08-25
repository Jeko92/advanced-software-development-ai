/*
Create a function called moreZeros that takes a string as input.

For each character:
- Convert its ASCII code to binary.
- Check whether the binary representation contains more zeroes than ones.
- Leading zeroes should not be counted.

Return an array containing only the characters that have more zeroes
than ones in their binary representation.

The returned array must not contain duplicate characters.
Only the first occurrence of each character should be included,
keeping the original order.

Examples:

"a" --> ASCII 97 --> binary "1100001"
4 zeroes, 3 ones --> include "a"

"c" --> ASCII 99 --> binary "1100011"
3 zeroes, 4 ones --> do not include "c"

"abcde" --> ["a", "b", "d"]

"DIGEST" --> ["D", "I", "E", "T"]
*/

import { test } from '@/test.ts';

function moreZeros(s: string): string[] {
  const result: string[] = [];
  for (const char of [...s]) {
    const charCode = char.charCodeAt(0).toString(2);
    const zeroesCount = (charCode.match(/0/g) || []).length;
    const onesCount = (charCode.match(/1/g) || []).length;
    if (zeroesCount > onesCount) {
      result.push(char);
    }
  }
  return Array.from(new Set(result));
}

test(moreZeros('abcde'), ['a', 'b', 'd']);
test(moreZeros('DIGEST'), ['D', 'I', 'E', 'T']);
test(moreZeros(''), []);
test(moreZeros('aaa'), ['a']);
test(moreZeros('hello'), ['h']);
