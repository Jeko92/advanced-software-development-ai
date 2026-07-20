/*
https://www.codewars.com/kata/566044325f8fddc1c000002c
Write a function that returns a sequence (index begins with 1) of all the even
characters from a string. If the string is smaller than two characters or longer
than 100 characters, the function should return "invalid string".
For example:
"abcdefghijklm" --> ["b", "d", "f", "h", "j", "l"]
"a"             --> "invalid string"
*/

function evenChars(a: string): string[] | string {
  return a.length < 2 || a.length > 100
    ? "invalid string"
    : a.split("").filter((c, i) => i % 2);
}
