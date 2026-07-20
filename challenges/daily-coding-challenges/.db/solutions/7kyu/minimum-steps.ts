// Given an array of N integers, you have to find how many times you have to add up the smallest numbers in
// the array until their Sum becomes greater or equal to K.

function minimumSteps(arr: number[], num: number): number | undefined {
  const a: number[] = arr.sort((a, b) => a - b);
  let sum: number = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i];
    if (sum >= num) return i;
  }
}
