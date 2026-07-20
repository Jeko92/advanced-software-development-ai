/*
https://www.codewars.com/kata/557cffec8c3e8e55cc00010f
Create an algorithm to count the number of zeros that appear between 1 and N.
Examples:
There are 2 zeros from 1 to 20: 10, 20
There are 11 zeros from 1 to 100: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
*/

function countZeros(n: number): number {
  let str: string = '';
  for (let i = 9; i <= n; i++) {
    str += String(i);
  }
  return str.split('0').length - 1;
}
