/*
Your goal in this kata is to implement a difference function, which subtracts one list from another
and returns the result. It should remove all values from list a, which are present in list b.
array_diff([1,2],[1]) == [2]
*/

function array_diff(a: number[], b: number[]): number[] {
  return a.filter(el => !b.includes(el));
}
