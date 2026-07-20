/*In this Kata, your function receives an array of integers as input.
Your task is to determine whether the numbers are in ascending order.
An array is said to be in ascending order if there are no two adjacent integers
where the left integer exceeds the right integer in value.
*/

function inAscOrder(a: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i + 1] < a[i]) {
      return false;
    }
  }
  return true;
}
