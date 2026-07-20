/*
https://www.codewars.com/kata/534d2f5b5371ecf8d2000a08
Description:
Your task, is to create NxN multiplication table, of size provided in parameter.
for example, when given size is 3:
1 2 3
2 4 6
3 6 9
for given example, the return value should be: [[1,2,3],[2,4,6],[3,6,9]]
*/

function multiplicationTable(n: number): number[][] {
  let res: number[][] = [];
  let ar: number[] = [];
  for (let i = 1; i < n + 1; i++) {
    for (let j = 1; j < n + 1; j++) {
      ar.push(i * j);
    }
    res.push(ar);
    ar = [];
  }
  return res;
}
