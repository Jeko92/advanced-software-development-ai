// Program a function sumAverage(arr) where arr is an array containing arrays full of numbers, for example:
// sumAverage([[1, 2, 2, 1], [2, 2, 2, 1]]);
// First, determine the average of each array. Then, return the sum of all the averages.
// All numbers will be less than 100.
// arr will contain a maximum of 50 arrays.
// After calculating all the averages, add them all together, then round down, as shown in the example below:

function sumAverage(a: number[][]): number {
  return Math.floor(
    a.map((a) => a.reduce((a, b) => a + b) / a.length).reduce((a, b) => a + b)
  );
}
