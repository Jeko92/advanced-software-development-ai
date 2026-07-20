// Complete the method which accepts an array of integers, and returns one of the following:
// "yes, ascending" - if the numbers in the array are sorted in an ascending order
// "yes, descending" - if the numbers in the array are sorted in a descending order
// "no" - otherwise

function isSortedAndHow(a: number[]): string {
  if (
    a
      .slice()
      .sort((x, y) => y - x)
      .join("") === a.join("")
  ) {
    return "yes, descending";
  }
  if (
    a
      .slice()
      .sort((x, y) => x - y)
      .join("") === a.join("")
  ) {
    return "yes, ascending";
  }
  return "no";
}
