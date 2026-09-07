/*
https://www.codewars.com/kata/frequency-sequence
Return an output string that translates an input string s/$s by replacing each character in s/$s
with a number representing the number of times that character occurs in s/$s and separating each number
with the character(s) sep/$sep.
*/

import { test } from '@/test.ts';

function freqSeq(str: string, sep: string): string {
  return str
    .split('')
    .map((char) => (str.match(new RegExp(char, 'g')) || []).length)
    .join(sep);
}

interface Counts {
  [key: string]: number;
}

function freqSeq2(str: string, sep: string): string {
  const counts: Counts = {};
  for (const char of str) {
    counts[char] = (counts[char] ?? 0) + 1;
  }
  return str
    .split('')
    .map((char) => counts[char])
    .join(sep);
}

test(freqSeq('hello', '-'), '1-1-2-2-1');
test(freqSeq('aab', ','), '2,2,1');
test(freqSeq('abc', '|'), '1|1|1');
test(freqSeq('aaa', '.'), '3.3.3');
test(freqSeq('abab', '-'), '2-2-2-2');

test(freqSeq2('hello', '-'), '1-1-2-2-1');
test(freqSeq2('aab', ','), '2,2,1');
test(freqSeq2('abc', '|'), '1|1|1');
test(freqSeq2('aaa', '.'), '3.3.3');
test(freqSeq2('abab', '-'), '2-2-2-2');
