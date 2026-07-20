/*
Given a string, remove any characters that are unique from the string.
Example:
input: "abccdefee"
output: "cceee"
*/

function onlyDuplicates(s: string): string {
  return s.split('').filter((x: string) => s.indexOf(x) != s.lastIndexOf(x)).join('');
}
