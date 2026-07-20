/*
https://www.codewars.com/kata/576757b1df89ecf5bd00073b/train/javascript
Build Tower by the following given argument:
number of floors (integer and always greater than 0).
Tower block is represented as *
for example, a tower of 3 floors looks like below
[
  '  *  ',
  ' *** ',
  '*****'
]
and a tower of 6 floors looks like below
[
  '     *     ',
  '    ***    ',
  '   *****   ',
  '  *******  ',
  ' ********* ',
  '***********'
]
*/

function towerBuilder(floors: number): string[] {
  const tower: string[] = [];
  let spaces: string = '';
  let stars: string = '';
  for (let i = 1; i <= floors; i++) {
    spaces = " ".repeat(floors - i);
    stars = "*".repeat((2 * i) - 1);
    tower.push(`${spaces}${stars}${spaces}`);
  }
  return tower;
}
