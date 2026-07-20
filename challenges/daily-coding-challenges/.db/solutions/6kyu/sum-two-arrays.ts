/*
https://www.codewars.com/kata/59c3e8c9f5d5e40cab000ca6
Your task is to create a function called sum_arrays() in Python or addArrays in Javascript,
which takes two arrays consisting of integers, and returns the sum of those two arrays.
The twist is that (for example) [3,2,9] does not equal 3 + 2 + 9, it would equal '3' + '2' + '9'
converted to an integer for this kata, meaning it would equal 329.
The output should be an array of the the sum in a similar fashion to the input (for example,
if the sum is 341, you would return [3,4,1]).
Examples are given below of what two arrays should return.
[3,2,9],[1,2] --> [3,4,1]
[4,7,3],[1,2,3] --> [5,9,6]
[1],[5,7,6] --> [5,7,7]
*/

function addArrays(a1: number[], a2: number[]): number[] {
  if (a2.length === 0) return a1;
  const num1: number = parseInt(a1.join(''));
  const num2: number = parseInt(a2.join(''));
  const str: string = num1 + num2 + '';
  return str[0] === '-'
    ? str.slice(1).split('')
      .map((el: string, i: number) => i === 0
        ? Number(el) - (Number(el) * 2)
        : Number(el))
    : str.split('').map((el: string) => Number(el));
}
