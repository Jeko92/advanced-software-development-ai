/*
https://www.codewars.com/kata/5667e8f4e3f572a8f2000039
This time no story, no theory. The examples below show you how to write function accum:
Examples:
accum("abcd") -> "A-Bb-Ccc-Dddd"
accum("RqaEzty") -> "R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy"
accum("cwAt") -> "C-Ww-Aaa-Tttt"
*/

function accum(str: string): string {
  let res: string = '';
  for (let i = 0; i < str.length; i++) {
    res += str[i].toUpperCase();
    for (let j = 0; j < i; j++) {
      res += `${str.charAt(i).toLowerCase()}`;
    }
    res += '-';
  }
  return res.substring(0, res.length - 1);
}
