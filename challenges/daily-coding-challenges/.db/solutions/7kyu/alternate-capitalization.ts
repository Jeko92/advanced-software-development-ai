/*
https://www.codewars.com/kata/alternate-capitalization/train/javascript
Given a string, capitalize the letters that occupy even indexes and odd indexes separately,
and return as shown below. Index 0 will be considered even.
For example, capitalize("abcdef") = ['AbCdEf', 'aBcDeF']. See test cases for more examples.
*/

function capitalize(s: string): string[] {
  return [
    s.split('').map((x: string, index: number) => index % 2 === 0 ? x.toUpperCase() : x).join(''),
    s.split('').map((x: string, index: number) => index % 2 !== 0 ? x.toUpperCase() : x).join('')
  ];
}
