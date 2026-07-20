/*
Given a mixed array of number and string representations of integers, add up the string integers
and subtract this from the total of the non-string integers.
*/

function divCon(arr: (string | number)[]): number {
  const strings: number = arr.reduce((acc: number, val: string | number) => typeof val === 'string' ? acc + +val : acc + 0, 0);
  const numbers: number = arr.reduce((acc: number, val: string | number) => typeof val === 'number' ? acc + val : acc + 0, 0);
  return numbers - strings;
}
