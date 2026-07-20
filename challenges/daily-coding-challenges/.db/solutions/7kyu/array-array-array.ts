/*
You are given an initial 2-value array (x). You will use this to calculate a score.
If both values in (x) are numbers, the score is the sum of the two. If only one is a number,
the score is that number. If neither is a number, return 'Void!'.
Once you have your score, you must return an array of arrays. Each sub array will be the same
as (x) and the number of sub arrays should be equal to the score.
For example:
if (x) == ['a', 3] you should return [['a', 3], ['a', 3], ['a', 3]].
*/

function explode(x: (string | number)[]): (string | number)[][] | string {
  const sum: number = x.filter((el): el is number => typeof el === 'number').reduce((a, b) => a + b, 0);
  return sum > 0 ? Array(sum).fill(x) : 'Void!';
}
