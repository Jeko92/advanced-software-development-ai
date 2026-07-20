// Given two words and a letter, return a single word that's a combination of both words,
// merged at the point where the given letter first appears in each word. The returned word
// should have the beginning of the first word and the ending of the second, with the dividing
// letter in the middle. You can assume both words will contain the dividing letter.
// StringMerge("hello", "world", "l")       ==>  "held"

function stringMerge(string1: string, string2: string, letter: string): string {
  return string1.slice(0, string1.indexOf(letter)) + string2.slice(string2.indexOf(letter));
}
