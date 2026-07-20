// Given an array, find the Nth smallest element in this array

function nthSmallest(a: number[], n: number): number {
  return a.sort((a, b) => a - b)[n - 1];
}
