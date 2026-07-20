// Write a method sum (sum_array in python, SumArray in C#) that takes an array of numbers and
// returns the sum of the numbers. These may be integers or decimals for Ruby and any instance
// of Num for Haskell. The numbers can also be negative. If the array does not contain any numbers
// then you should return 0.

function sum(n: number[]): number {
    return n.reduce((a, b) => a + b, 0);
}
