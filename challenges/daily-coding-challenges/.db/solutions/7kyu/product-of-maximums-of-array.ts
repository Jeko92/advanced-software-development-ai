// Given an array/list [] of integers , Find the product of the k maximal numbers.

function maxProduct(n: number[], k: number): number {
  return n
    .sort((a, b) => a - b)
    .slice(n.length - k)
    .reduce((a, b) => a * b);
}
