// Given a list of digits, return the smallest number that could be formed from these digits,
// using the digits only once (ignore duplicates).

function minValue(a: number[]): number {
  return +[...new Set([...a])].sort((a, b) => a - b).join('');
}
