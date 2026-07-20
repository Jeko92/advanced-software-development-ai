// In this Kata, you will be given a string that may have mixed uppercase and lowercase letters and
// your task is to convert that string to either lowercase only or uppercase only based on:

// make as few changes as possible.
// if the string contains equal number of uppercase and lowercase letters, convert the string to lowercase.

function solve(s: string): string {
  let upperCase: RegExpMatchArray | number = 0;
  let lowerCase: RegExpMatchArray | number = 0;
  if (s.match(/[A-Z]/g)) {
    upperCase = s.match(/[A-Z]/g)!;
  }
  if (s.match(/[a-z]/g)) {
    lowerCase = s.match(/[a-z]/g)!;
  }

  return (upperCase as RegExpMatchArray).length > (lowerCase as RegExpMatchArray).length ? s.toUpperCase() : s.toLowerCase();
}
