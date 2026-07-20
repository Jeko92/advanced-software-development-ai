/*
https://www.codewars.com/kata/56576f82ab83ee8268000059
Description:
Kevin is noticing his space run out! Write a function that removes the spaces from the values and returns an
array showing the space decreasing. For example, running this function on the array ['i', 'have','no','space']
would produce ['i','ihave','ihaveno','ihavenospace'].
*/

function spacey(ar: string[]): string[] {
  let result: string[] = [];
  for (let i = 0; i < ar.length; i++) {
    result.push(ar.slice(0, i + 1).join(""));
  }
  return result;
}
