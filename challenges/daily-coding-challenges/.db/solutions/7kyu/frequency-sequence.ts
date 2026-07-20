/*
https://www.codewars.com/kata/frequency-sequence
Return an output string that translates an input string s/$s by replacing each character in s/$s
with a number representing the number of times that character occurs in s/$s and separating each number
with the character(s) sep/$sep.
*/

function freqSeq(str: string, sep: string): string {
  return [...str].map((char: string) => str.split(char).length - 1).join(sep);
}
