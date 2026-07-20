// You are given two arrays a1 and a2 of strings. Each string is composed with letters from a to z.
// Let x be any string in the first array and y be any string in the second array.
// Find max(abs(length(x) − length(y)))
// If a1 and/or a2 are empty return -1

function mxdiflg(a1: string[], a2: string[]): number {
  if (a1.length === 0 || a2.length === 0) return -1;
  const lengthA1: number[] = a1.map((el: string) => el.length);
  const lengthA2: number[] = a2.map((el: string) => el.length);

  return Math.max(
    Math.max.apply(0, lengthA1) - Math.min.apply(0, lengthA2),
    Math.max.apply(0, lengthA2) - Math.min.apply(0, lengthA1)
  );
}
