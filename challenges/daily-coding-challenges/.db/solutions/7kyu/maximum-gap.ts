// Given an array/list [] of integers , Find The maximum difference between the successive elements
// in its sorted form.

function maxGap(a: number[]): number {
  return [...new Set(a)].sort((a, b) => b - a).reduce((acc: number, b: number, i: number, ar: number[]) => b - ar[i + 1] > acc ? b - ar[i + 1] : acc, 0);
}
