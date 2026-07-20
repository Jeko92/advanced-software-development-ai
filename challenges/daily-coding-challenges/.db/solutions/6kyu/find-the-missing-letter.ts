// #Find the missing letter
// Write a method that takes an array of consecutive (increasing) letters as input and that returns the missing letter in
// the array. You will always get an valid array. And it will be always exactly one letter be missing. The length of the
// array will always be at least 2. The array will always contain letters in only one case.
// Example:
// ['a','b','c','d','f'] -> 'e'
// ['O','Q','R','S'] -> 'P'

function findMissingLetter(a: string[]): string {
  const found = a.find((el, i, ar) =>
    i < ar.length - 1 && (el.charCodeAt(0) + 1) !== ar[i + 1].charCodeAt(0)
  );
  return found ? String.fromCharCode(found.charCodeAt(0) + 1) : String.fromCharCode(a[0].charCodeAt(0) - 1);
}
