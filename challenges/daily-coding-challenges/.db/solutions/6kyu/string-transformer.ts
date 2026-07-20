// Given a string, return a new string that has transformed based on the input:

// Change case of every character, ie. lower case to upper case, upper case to lower case.
// Reverse the order of words from the input.

function stringTransformer(s: string): string {
  return s.split('').map(c => c === c.toLowerCase() ?
    c.toUpperCase() : c.toLowerCase()).join('').split(' ').reverse().join(' ');
}
