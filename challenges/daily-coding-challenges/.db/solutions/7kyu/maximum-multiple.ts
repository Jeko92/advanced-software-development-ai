// Given a Divisor and a Bound , Find the largest integer N , Such That ,
// N is divisible by divisor
// N is less than or equal to bound
// N is greater than 0.
// The parameters (divisor, bound) passed to the function are only positve values .
// It's guaranteed that a divisor is Found .

function maxMultiple(d: number, b: number): number {
  if (d > b) return 0;
  for (let i = b; i > 0; i--) {
    if (i % d === 0) {
      return i;
    }
  }
  return 0;
}
