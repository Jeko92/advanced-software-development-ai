/*
https://www.codewars.com/kata/5a8d2bf60025e9163c0000bc
In this Kata, you will sort elements in an array by decreasing frequency of elements.
If two elements have the same frequency, sort them by increasing value.
solve([2,3,5,3,7,9,5,3,7]) = [3,3,3,5,5,7,7,2,9]
--we sort by highest frequency to lowest frequency.
*/

function solve(arr: number[]): number[] {
  const list: Record<number, number> = arr.reduce((acc: Record<number, number>, val: number) => {
    acc[val] = acc[val] + 1 || 1;
    return acc;
  }, {});
  return arr.sort((a, b) => list[b] - list[a] || a - b);
}
