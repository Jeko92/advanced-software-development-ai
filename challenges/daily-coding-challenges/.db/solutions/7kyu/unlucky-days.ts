/*
Friday 13th or Black Friday is considered as unlucky day. Calculate how many unlucky days are
in the given year. Find the number of Friday 13th in the given year.
Input: Year as an integer.
Output: Number of Black Fridays in the year as an integer.
*/

function unluckyDays(y: number): number {
  let date: Date;
  let count: number = 0;
  for (let i = 1; i <= 12; i++) {
    date = new Date(`${i}/13/${y}`);
    if (date.getDay() === 5) {
      count++;
    }
  }
  return count;
}
