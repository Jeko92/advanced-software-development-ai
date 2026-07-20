/*
https://www.codewars.com/kata/59f11118a5e129e591000134
In this Kata, you will be given an array of numbers in which two numbers occur once
and the rest occur only twice. Your task will be to return the sum of the numbers that
occur only once.

For example, repeats([4,5,7,5,4,8]) = 15 because only the numbers 7 and 8 occur once,
and their sum is 15.
*/

function repeat(a: number[]): number {
  let sum: number = 0;
  for (let num of a) {
    if (a.indexOf(num) === a.lastIndexOf(num)) {
      sum += num;
    }
  }
  return sum;
}
