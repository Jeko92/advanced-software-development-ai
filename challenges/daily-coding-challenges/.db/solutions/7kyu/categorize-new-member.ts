/*
https://www.codewars.com/kata/5502c9e7b3216ec63c0001aa
The Western Suburbs Croquet Club has two categories of membership, Senior and Open. They would like your help with an application
form that will tell prospective members which category they will be placed.
To be a senior, a member must be at least 55 years old and have a handicap greater than 7. In this croquet club, handicaps range
from -2 to +26; the better the player the lower the handicap.
Example Input
[[18, 20],[45, 2],[61, 12],[37, 6],[21, 21],[78, 9]]
Example Output
["Open", "Open", "Senior", "Open", "Open", "Senior"]
*/

function openOrSenior(data: number[][]): string[] {
  const result: string[] = [];
  data.forEach((item: number[]) => {
    item[0] >= 55 && item[1] > 7 ?
      result.push('Senior') : result.push('Open');
  });
  return result;
}
