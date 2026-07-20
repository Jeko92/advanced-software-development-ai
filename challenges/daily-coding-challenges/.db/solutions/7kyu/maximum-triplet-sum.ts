// Given an array/list [] of n integers , find maximum triplet sum in the array Without duplications .
// Input >> Output Examples
// 1- maxTriSum ({3,2,6,8,2,3}) ==> return (17)
// Explanation:
// As the triplet that maximize the sum {6,8,3} in order , their sum is (17)

function maxTriSum(a: number[]): number {
  return [...new Set(a)].sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a + b);
}
