/*
https://www.codewars.com/kata/5d41e16d8bad42002208fe1a/train/javascript
You should remove any duplicate characters, keeping the first occurence of any such duplicates,
so they are in the same order in the final array as they first appeared in the input string.

Examples

'abcde' === ["1100001", "1100010", "1100011", "1100100", "1100101"]
               True       True       False      True       False

        --> ['a','b','d']

'DIGEST'--> ['D','I','E','T']
*/

function moreZeros(s: string): string[] {
  return [...new Set(s.split('')
    .filter(c => {
      const bin: string = c.charCodeAt(0).toString(2);
      return bin.split('0').length - 1 > bin.split('1').length - 1;
    }))];
}
