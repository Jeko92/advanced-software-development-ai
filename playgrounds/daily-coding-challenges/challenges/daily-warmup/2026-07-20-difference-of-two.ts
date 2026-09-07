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

import { test } from '@/test.ts';

function differenceOfTwo(arr: number[]): number[][] {
  let sorted = [...arr].sort((a, b) => a - b);
  const result: number[][] = [];

  while (sorted.length > 0) {
    const first = sorted[0];
    const second = sorted[1];
    const third = sorted[2];

    if (first === undefined) break;

    if (second !== undefined && second - first === 2) {
      result.push([first, second]);
    }

    if (third !== undefined && third - first === 2) {
      result.push([first, third]);
    }

    sorted = sorted.slice(1);
  }

  return result;
}

// ============================
//  Version 2 — Sliding window with index (fixed)
// ============================
// Time: O(n log n) — dominated by the sort; the scan itself is O(n)
// Space: O(1) extra (excluding output array and the sort's own space)
function differenceOfTwo2(arr: number[]): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const result: number[][] = [];

  let i = 0;

  while (i < sorted.length - 1) {
    const current = sorted[i];
    const next = sorted[i + 1];

    if (current === undefined || next === undefined) {
      i++;
      continue;
    }

    if (next - current === 2) {
      result.push([current, next]);
    }

    const afterNext = sorted[i + 2];
    if (afterNext !== undefined && afterNext - current === 2) {
      result.push([current, afterNext]);
    }

    i++;
  }

  return result;
}

// ============================
//  Version 3 — Set lookup (fixed)
// ============================
// Time: O(n log n) — the scan is O(n), but the final .sort() dominates
// Space: O(n) — Set storing up to n elements, plus output array
function differenceOfTwo3(arr: number[]): number[][] {
  const numbers = new Set(arr);
  const result: number[][] = [];

  for (const num of arr) {
    if (numbers.has(num + 2)) {
      result.push([num, num + 2]);
    }
  }

  return result.sort((a, b) => a[0]! - b[0]!);
}

test(differenceOfTwo([1, 2, 3, 4]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo([4, 1, 2, 3]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo([1, 23, 3, 4, 7]), [[1, 3]]);
test(differenceOfTwo([4, 3, 1, 5, 6]), [
  [1, 3],
  [3, 5],
  [4, 6],
]);
test(differenceOfTwo([1, 5, 10]), []);

test(differenceOfTwo2([1, 2, 3, 4]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo2([4, 1, 2, 3]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo2([1, 23, 3, 4, 7]), [[1, 3]]);
test(differenceOfTwo2([4, 3, 1, 5, 6]), [
  [1, 3],
  [3, 5],
  [4, 6],
]);
test(differenceOfTwo2([1, 5, 10]), []);

test(differenceOfTwo3([1, 2, 3, 4]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo3([4, 1, 2, 3]), [
  [1, 3],
  [2, 4],
]);
test(differenceOfTwo3([1, 23, 3, 4, 7]), [[1, 3]]);
test(differenceOfTwo3([4, 3, 1, 5, 6]), [
  [1, 3],
  [3, 5],
  [4, 6],
]);
test(differenceOfTwo3([1, 5, 10]), []);
