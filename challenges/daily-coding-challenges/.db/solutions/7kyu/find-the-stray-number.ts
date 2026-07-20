/*
You are given an odd-length array of integers, in which all of them are the same,
except for one single number.
Complete the method which accepts such an array, and returns that single different number.
*/

function stray(numbers: number[]): number {
  numbers = numbers.slice().sort();
  return numbers[0] !== numbers[1] ? numbers[0] : numbers[numbers.length - 1];
}
