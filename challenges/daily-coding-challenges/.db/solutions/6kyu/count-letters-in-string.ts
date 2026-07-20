/*
In this kata, you've to count lowercase letters in a given string and return the letter count in a hash with 'letter'
as key and count as 'value'.
*/

function letterCount(s: string): Record<string, number> {
  return s.split('').reduce((a: Record<string, number>, v: string) => {
    a[v] = (a[v] || 0) + 1;
    return a;
  }, {});
}
