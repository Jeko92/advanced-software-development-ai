/*
https://www.codewars.com/kata/5502c9e7b3216ec63c0001aa
The Western Suburbs Croquet Club has two categories of membership, Senior and Open. They would like your help with an application
form that will tell prospective members which category they will be placed.
To be a senior, a member must be at least 55 years old and have a handicap greater than 7. In this croquet club, handicaps range
from -2 to +26; the better the player the lower the handicap.
Example Input
[[18, 20],[45, 2],[61, 12],[37, 6],[21, 21],[78, 9]]
Example Output
["Open", "Open", "Senior", "Open", "Open", "Senior"]
*/

import { test } from '@/test.ts';

function openOrSenior(data: number[][]): string[] {
  const membershipCategory: string[] = [];
  const defineCategory = (memberData: number[]): string => {
    return memberData[0]! >= 55 && memberData[1]! > 7 ? 'Senior' : 'Open';
  };
  for (const memberInfo of data) {
    membershipCategory.push(defineCategory(memberInfo));
  }
  return membershipCategory;
}

function openOrSenior2(data: number[][]): string[] {
  return data.map((memberData) =>
    memberData[0]! >= 55 && memberData[1]! > 7 ? 'Senior' : 'Open',
  );
}

function openOrSenior3(data: number[][]): string[] {
  return data.map((memberData) => {
    const [age, handicap] = memberData;
    if (age === undefined || handicap === undefined) {
      throw new Error('Invalid member data');
    }
    return age >= 55 && handicap > 7 ? 'Senior' : 'Open';
  });
}

test(
  openOrSenior([
    [18, 20],
    [45, 2],
    [61, 12],
    [37, 6],
    [21, 21],
    [78, 9],
  ]),
  ['Open', 'Open', 'Senior', 'Open', 'Open', 'Senior'],
);
test(openOrSenior([[55, 8]]), ['Senior']);
test(openOrSenior([[54, 8]]), ['Open']);
test(openOrSenior([[55, 7]]), ['Open']);
test(
  openOrSenior([
    [60, 15],
    [30, 5],
  ]),
  ['Senior', 'Open'],
);
console.log('=======================================');
test(
  openOrSenior2([
    [18, 20],
    [45, 2],
    [61, 12],
    [37, 6],
    [21, 21],
    [78, 9],
  ]),
  ['Open', 'Open', 'Senior', 'Open', 'Open', 'Senior'],
);
test(openOrSenior2([[55, 8]]), ['Senior']);
test(openOrSenior2([[54, 8]]), ['Open']);
test(openOrSenior2([[55, 7]]), ['Open']);
test(
  openOrSenior2([
    [60, 15],
    [30, 5],
  ]),
  ['Senior', 'Open'],
);
console.log('=======================================');
test(
  openOrSenior3([
    [18, 20],
    [45, 2],
    [61, 12],
    [37, 6],
    [21, 21],
    [78, 9],
  ]),
  ['Open', 'Open', 'Senior', 'Open', 'Open', 'Senior'],
);
test(openOrSenior3([[55, 8]]), ['Senior']);
test(openOrSenior3([[54, 8]]), ['Open']);
test(openOrSenior3([[55, 7]]), ['Open']);
test(
  openOrSenior3([
    [60, 15],
    [30, 5],
  ]),
  ['Senior', 'Open'],
);
