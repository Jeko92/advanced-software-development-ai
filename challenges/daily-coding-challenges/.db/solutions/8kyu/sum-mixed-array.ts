// Given an array of integers as strings and numbers, return the sum of the array
// values as if all were numbers.

function sumMix(ar: (string | number)[]): number {
    return ar.map(x => Number(x)).reduce((a, b) => a + b);
}
