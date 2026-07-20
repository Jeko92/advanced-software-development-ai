function findMissingLetter(chars: string[]): string {
  const [first] = chars;

  if (first === undefined) {
    throw new Error("Array is empty");
  }

  let expected = first.charCodeAt(0);

  for (const char of chars) {
    if (char.charCodeAt(0) !== expected) {
      return String.fromCharCode(expected);
    }
    expected++;
  }

  throw new Error("No missing letter found");
}

console.log(findMissingLetter(["a", "b", "c", "d", "f"]));
console.log(findMissingLetter(["O", "Q", "R", "S"]));
