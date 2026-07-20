// You receive some random elements as a space-delimited string.
// Check if the elements are part of an ascending sequence of integers starting with 1,
// with an increment of 1 (e.g. 1, 2, 3, 4).
// Return:
// 0 if the elements can form such a sequence, and no number is missing ("not broken", e.g. "1 2 4 3")
// 1 if there are any non-numeric elements in the input ("invalid", e.g. "1 2 a")
// n if the elements are part of such a sequence, but some numbers are missing,
// and n is the lowest of them ("broken", e.g. "1 2 4" or "1 5")

function findMissingNumber(s: string): number {
  if (s.match(/[a-z]/i)) {
    return 1;
  }
  if (s.length === 0) {
    return 0;
  }
  const nums: number[] = s.split(' ').map((x: string) => Number(x)).sort();
  if (nums[0] != 1) {
    return 1;
  }
  for (let i = 1; i < Math.max.apply(0, nums); i++) {
    if (!nums.includes(i)) {
      return i;
    }
  }
  return 0;
}
