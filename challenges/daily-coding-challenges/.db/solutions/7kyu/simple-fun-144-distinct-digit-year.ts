// The year of 2013 is the first year after the old 1987 with only distinct digits.
// Now your task is to solve the following problem: given a year number, find the minimum year number which is
// strictly larger than the given one and has only distinct digits.

function distinctNumbers(n: number): boolean {
  return n
    .toString()
    .split("")
    .every((x, index, ar) => ar.indexOf(x) == ar.lastIndexOf(x));
}

function distinctDigitYear(y: number): number {
  while (y) {
    y++;
    if (distinctNumbers(y)) {
      return y;
    }
  }
  return y;
}
