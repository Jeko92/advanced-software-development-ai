/*
When provided with a String, capitalize all vowels
For example:
Input : "Hello World!"
Output : "HEllO WOrld!"
*/

function swap(s: string): string {
  return s.split('').map((c: string) => (/[aeiou]/).test(c) ? c.toUpperCase() : c).join('');
}
