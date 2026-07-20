/*
Write a function that takes an array of numbers (integers for the tests) and a target number.
It should find two different items in the array that, when added together, give the target value.
The indices of these items should then be returned in a tuple like so: (index1, index2).
*/

function twoSum(n: number[], t: number): [number, number] | undefined {
  let k: number;
  for (let i = 0; i < n.length; i++) {
    k = n.indexOf((t - n[i]), i + 1);
    if (k > -1) return [i, k];
  }
}
