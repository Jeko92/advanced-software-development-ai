// Your job is to write a function which increments a string, to create a new string.
// If the string already ends with a number, the number should be incremented by 1.
// If the string does not end with a number. the number 1 should be appended to the new string.
// Examples:
// foo -> foo1
// foobar23 -> foobar24
// foo0042 -> foo0043
// foo099 -> foo100
// Attention: If the number has leading zeros the amount of digits should be considered.

import { test } from '@/test';

function incrementString(s: string): string {
  const match = s.match(/\d+$/);
  console.log(match);

  if (!match) {
    return s + '1';
  }
  const numberPart = match[0];
  const textPart = s.slice(0, -numberPart.length);

  const incremented = String(Number(numberPart) + 1);
  const padded = incremented.padStart(numberPart.length, '0');
  return textPart + padded;
}

test(incrementString('foo'), 'foo1');
test(incrementString('foobar23'), 'foobar24');
test(incrementString('foo0042'), 'foo0043');
test(incrementString('foo099'), 'foo100');
test(incrementString('foo42bar099'), 'foo42bar100');
