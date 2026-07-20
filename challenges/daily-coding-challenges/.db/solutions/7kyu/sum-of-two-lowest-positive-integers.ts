function sumTwoSmallestNumbers(numbers: number[]): number {
  let sorted: number[] = numbers.sort((a, b) => a - b);
  return sorted[0] + sorted[1];
}
