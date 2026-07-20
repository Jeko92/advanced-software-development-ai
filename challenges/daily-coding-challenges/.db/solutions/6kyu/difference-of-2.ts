/*
https://www.codewars.com/kata/5340298112fa30e786000688
The objective is to return all pairs of integers from a given collection of integers that have a difference of 2.
The result should be sorted in ascending order.
The input will consist of unique values. The order of the integers in the input collection should not matter.
Examples
[1, 2, 3, 4]      -->  [[1, 3], [2, 4]]
[4, 1, 2, 3]      -->  [[1, 3], [2, 4]]
[1, 23, 3, 4, 7]  -->  [[1, 3]]
[4, 3, 1, 5, 6]   -->  [[1, 3], [3, 5], [4, 6]]
*/

function differenceOfTwo(arr: number[]): number[][] {
  const sorted: number[] = arr.slice().sort((a, b) => a - b);
  const result: number[][] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j] - sorted[i] === 2) {
        result.push([sorted[i], sorted[j]]);
      }
    }
  }
  return result;
}
