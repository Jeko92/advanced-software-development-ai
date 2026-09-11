/*
https://www.codewars.com/kata/586d6cefbcc21eed7a001155/
For a given string s find the character c (or C) with longest consecutive repetition and return:
[c, l]
where l (or L) is the length of the repetition. If there are two or more characters with the same l
return the first in order of appearance.
For empty string return:
["", 0]
Happy coding! :)
*/

import { test } from '@/test.ts';

function longestRepetition(s: string): [string, number] {
  let bestCharacter = '';
  let bestLength = 0;
  let currentCharacter = '';
  let currentLength = 0;
  for (const character of s) {
    if (character === currentCharacter) {
      currentLength++;
    } else {
      currentCharacter = character;
      currentLength = 1;
    }

    if (currentLength > bestLength) {
      bestCharacter = currentCharacter;
      bestLength = currentLength;
    }
  }

  return [bestCharacter, bestLength];
}

function longestRepetition2(s: string): [string, number] {
  const matches = s.match(/(.)\1*/g) ?? [];

  const longest = matches.reduce((a, b) => (b.length > a.length ? b : a), '');

  return [longest[0] ?? '', longest.length];
}

test(longestRepetition('aaabbbbbcccc'), ['b', 5]);
test(longestRepetition(''), ['', 0]);
test(longestRepetition('a'), ['a', 1]);
test(longestRepetition('aabbcc'), ['a', 2]);
test(longestRepetition('zzz'), ['z', 3]);

test(longestRepetition2('aaabbbbbcccc'), ['b', 5]);
test(longestRepetition2(''), ['', 0]);
test(longestRepetition2('a'), ['a', 1]);
test(longestRepetition2('aabbcc'), ['a', 2]);
test(longestRepetition2('zzz'), ['z', 3]);
