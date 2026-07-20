// Complete the solution so that the function will break up camel casing, using a space between words.
// Example:
// solution('camelCasing') // => should return 'camel Casing'

function solution(s: string): string {
  return s.split('').map(c => c === c.toUpperCase() ? ` ${c}` : c).join('');
}
