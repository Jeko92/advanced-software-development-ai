/*
https://www.codewars.com/kata/52988f3f7edba9839c00037d/solutions/javascript
Implement a function which filters out array values which satisfy the given predicate.
reject([1, 2, 3, 4, 5, 6], (n) => n % 2 === 0)  =>  [1, 3, 5]
*/

function reject<T>(ar: T[], predicate: (el: T) => boolean): T[] {
  return ar.filter((el) => {
    if (!predicate(el)) return true;
  });
}
