// Given a string, return a new string that has transformed based on the input:

// Change case of every character, ie. lower case to upper case, upper case to lower case.
// Reverse the order of words from the input.

import { test } from '@/test.ts';

function stringTransformer(s: string): string {
  return s
    .split(' ')
    .reverse()
    .map((word) =>
      [...word]
        .map((c) => (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()))
        .join(''),
    )
    .join(' ');
}

test(stringTransformer('Example Input'), 'iNPUT eXAMPLE');
test(stringTransformer('Hello World'), 'wORLD hELLO');
test(stringTransformer(''), '');
test(stringTransformer('abc DEF'), 'def ABC');
test(stringTransformer('one two three'), 'THREE TWO ONE');
