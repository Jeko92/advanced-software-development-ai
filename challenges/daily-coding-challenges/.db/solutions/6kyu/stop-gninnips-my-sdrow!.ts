/*
Write a function that takes in a string of one or more words, and returns the same string, but with all
five or more letter words reversed (Just like the name of this Kata). Strings passed in will consist of
only letters and spaces. Spaces will be included only when more than one word is present.
*/

function spinWords(s: string): string {
  return s.split(' ').map(w => w.length > 4 ? w.split('').reverse().join('') : w).join(' ');
}
