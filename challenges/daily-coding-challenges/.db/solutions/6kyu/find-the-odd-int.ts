/*
Given an array, find the int that appears an odd number of times.
There will always be only one integer that appears an odd number of times.
*/

function findOdd(A: number[]): number {
  const res = A.reduce((a: Record<string, number | undefined>, v: number) => {
    a[v] ? a[v] = undefined : a[v] = 1;
    return a;
  }, {});
  return +Object.keys(res).find(key => res[key] !== undefined)!;
}
