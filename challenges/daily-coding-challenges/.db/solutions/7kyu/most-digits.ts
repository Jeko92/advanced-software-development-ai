// Find the number with the most digits.
// If two numbers in the argument array have the same number of digits, return the first one in the array.

function findLongest(a: number[]): number {
  let longest: number = a[0];
  for (const el of a) {
    if (el.toString().length > longest.toString().length) {
      longest = el;
    }
  }
  return longest;
}
