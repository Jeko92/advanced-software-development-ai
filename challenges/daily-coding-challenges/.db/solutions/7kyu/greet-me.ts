/*
https://www.codewars.com/kata/535474308bb336c9980006f2/train/javascript
Write a method that takes one argument as name and then greets that name, capitalized and ends with an exclamation point.

Example:

"riley" --> "Hello Riley!"
"JACK"  --> "Hello Jack!"
*/

function greet(s: string): string {
  return `Hello ${s[0].toUpperCase()}${s.slice(1).toLowerCase()}!`;
}
