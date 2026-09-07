/*
https://www.codewars.com/kata/5a8d2bf60025e9163c0000bc
In this Kata, you will sort elements in an array by decreasing frequency of elements.
If two elements have the same frequency, sort them by increasing value.
solve([2,3,5,3,7,9,5,3,7]) = [3,3,3,5,5,7,7,2,9]
--we sort by highest frequency to lowest frequency.
*/

import { test } from '@/test.ts';

function solve(arr: number[]): number[] {
  const frequency = new Map<number, number>();

  for (const num of arr) {
    frequency.set(num, (frequency.get(num) ?? 0) + 1);
  }

  return [...arr].sort((a, b) => {
    const countA = frequency.get(a)!;
    const countB = frequency.get(b)!;

    if (countA !== countB) {
      return countB - countA;
    }
    return a - b;
  });
}

function solve2(arr: number[]): number[] {
  const frequencyArr: [number, number][] = [];

  for (const num of arr) {
    const occurrences = arr.filter((n) => n === num).length;
    frequencyArr.push([num, occurrences]);
  }

  return frequencyArr
    .sort((a, b) => {
      const valA = a[0];
      const countA = a[1];

      const valB = b[0];
      const countB = b[1];

      if (countA !== countB) {
        return countB - countA;
      }
      return valA - valB;
    })
    .map((pair) => pair[0]);
}

function solve3(arr: number[]): number[] {
  if (arr.length === 0) return [];

  const sorted = [...arr].sort((a, b) => a - b);

  const frequencyPairs: [val: number, count: number][] = [];
  let currentVal = sorted[0]!;
  let currentCount = 0;

  for (const num of sorted) {
    if (num === currentVal) {
      currentCount++;
    } else {
      frequencyPairs.push([currentVal, currentCount]);
      currentVal = num;
      currentCount = 1;
    }
  }
  frequencyPairs.push([currentVal, currentCount]);

  frequencyPairs.sort((a, b) => b[1] - a[1] || a[0] - b[0]);

  const result: number[] = [];
  for (const [val, count] of frequencyPairs) {
    for (let i = 0; i < count; i++) {
      result.push(val);
    }
  }

  return result;
}

test(solve([2, 3, 5, 3, 7, 9, 5, 3, 7]), [3, 3, 3, 5, 5, 7, 7, 2, 9]);
test(solve([1, 1, 2, 2, 3]), [1, 1, 2, 2, 3]);
test(solve([5, 5, 5]), [5, 5, 5]);
test(solve([1, 2, 3]), [1, 2, 3]);
test(solve([4, 4, 1, 1, 1, 2]), [1, 1, 1, 4, 4, 2]);

console.log('===============================================');

test(solve2([2, 3, 5, 3, 7, 9, 5, 3, 7]), [3, 3, 3, 5, 5, 7, 7, 2, 9]);
test(solve2([1, 1, 2, 2, 3]), [1, 1, 2, 2, 3]);
test(solve2([5, 5, 5]), [5, 5, 5]);
test(solve2([1, 2, 3]), [1, 2, 3]);
test(solve2([4, 4, 1, 1, 1, 2]), [1, 1, 1, 4, 4, 2]);

console.log('===============================================');

test(solve3([2, 3, 5, 3, 7, 9, 5, 3, 7]), [3, 3, 3, 5, 5, 7, 7, 2, 9]);
test(solve3([1, 1, 2, 2, 3]), [1, 1, 2, 2, 3]);
test(solve3([5, 5, 5]), [5, 5, 5]);
test(solve3([1, 2, 3]), [1, 2, 3]);
test(solve3([4, 4, 1, 1, 1, 2]), [1, 1, 1, 4, 4, 2]);
