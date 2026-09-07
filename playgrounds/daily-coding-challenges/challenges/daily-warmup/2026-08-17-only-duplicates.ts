/*
Given a string, remove any characters that are unique from the string.
Example:
input: "abccdefee"
output: "cceee"
*/

import { test } from '@/test';

function onlyDuplicates(s: string): string {
  const frequency: Record<string, number> = {};

  for (const char of s) {
    frequency[char] = (frequency[char] ?? 0) + 1;
  }

  return s
    .split('')
    .filter((char) => (frequency[char] ?? 0) > 1)
    .join('');
}

test(onlyDuplicates('abccdefee'), 'cceee');
test(onlyDuplicates('abcde'), '');
test(onlyDuplicates('aabbcc'), 'aabbcc');
test(onlyDuplicates('hello'), 'll');
test(onlyDuplicates(''), '');
