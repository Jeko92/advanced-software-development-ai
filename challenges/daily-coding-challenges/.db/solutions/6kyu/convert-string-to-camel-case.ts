// Complete the method/function so that it converts dash/underscore delimited words into camel casing.
// The first word within the output should be capitalized only if the original word was capitalized
// (known as Upper Camel Case, also often referred to as Pascal case).
// Examples
// toCamelCase("the-stealth-warrior") // returns "theStealthWarrior"
// toCamelCase("The_Stealth_Warrior") // returns "TheStealthWarrior"

function toCamelCase(str: string): string {
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) == '-' || str.charAt(i) == '_') {
      str = str.slice(0, i)
        + str[i + 1].toUpperCase()
        + str.slice(i + 2);
    }
  }
  return str;
}
