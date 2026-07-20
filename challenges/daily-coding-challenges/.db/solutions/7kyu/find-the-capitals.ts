// Write a function that takes a single string (word) as argument.
// The function must return an ordered list containing the indexes of all capital letters in the string.

function capitals(word: string): number[] {
  const res: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (word.charAt(i) === word.charAt(i).toUpperCase()) {
      res.push(i);
    }
  }
  return res.sort();
}
