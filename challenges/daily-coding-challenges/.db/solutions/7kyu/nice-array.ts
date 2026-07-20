/*
A Nice array is defined to be an array where for every value n in the array, there is also an
element n-1 or n+1 in the array.
example:
[2,10,9,3] is Nice array because
2=3-1
10=9+1
3=2+1
9=10-1
*/

function isNice(a: number[]): boolean {
  if (a.length == 0) return false;
  for (let el of a) {
    if (!a.includes(el + 1) && !a.includes(el - 1)) {
      return false;
    }
  }
  return true;
}
